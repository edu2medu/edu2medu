import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { deduplicatedGet } from "../utils/apiClient";
import { getCachedData, setCachedData } from "../utils/apiCache";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

const Medicategory = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      setError(null);
      setLoading(true);

      const cacheKey = 'all-users-healthcare';
      const cachedData = getCachedData(cacheKey);

      try {
        let response;
        if (cachedData) {
          response = { data: cachedData };
          setLoading(false);
        } else {
          response = await deduplicatedGet(
            `${import.meta.env.VITE_BASEURI}/user/getHealthcareUsers`
          );
          setCachedData(cacheKey, response.data);
        }

        if (response.data?.users && Array.isArray(response.data.users)) {
          const activeUsers = response.data.users.filter(
            (user) =>
              user.category === categoryName &&
              (user.status === 'active' || user.status === 'unblock')
          );
          setUsers(activeUsers);
        } else {
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load healthcare providers");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveUsers();
  }, [categoryName]);

  return (
    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-300"
            onClick={() => navigate("/healthcare")}
          >
            <FaArrowLeft className="text-sm" />
            Back
          </motion.button>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {categoryName}
          </h2>
          <div className="hidden sm:block w-24"></div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-4 shadow-sm animate-pulse border border-gray-100">
                <div className="w-full h-48 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium bg-red-50 inline-block px-6 py-3 rounded-2xl italic">
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {!loading && users.length > 0 ? (
            users.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer border border-gray-100/50"
                onClick={() => navigate(`/medu-details`, { state: { user } })}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={user.image || "/default-healthcare.jpg"}
                    alt={user.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/default-healthcare.jpg")}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#17A2B8] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                      {categoryName}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                      <span className="text-[10px] text-gray-700 font-bold uppercase tracking-wider">ActiveNow</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-[#17A2B8] transition-colors duration-300">
                    {user.name}
                  </h3>

                  <div className="flex items-start gap-2 text-gray-500 mb-4">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#17A2B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm leading-snug line-clamp-2 italic font-medium">
                      {user.address || "Location information pending"}
                    </p>
                  </div>

                  <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-6">
                    {user.description || `Highly qualified ${categoryName.toLowerCase()} services providing exceptional medical care.`}
                  </p>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rating</span>
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <button className="px-5 py-2 bg-[#17A2B8] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#138496] transform hover:-translate-y-0.5 transition-all duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex justify-center py-20 px-4"
              >
                <div className="bg-white rounded-[2.5rem] shadow-sm p-12 max-w-lg w-full text-center border border-gray-100">
                  <div className="mb-8 w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                    <svg className="h-12 w-12 text-[#17A2B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{categoryName}</h3>
                  <p className="text-[#17A2B8] text-lg font-bold mb-4">Coming Soon</p>
                  <p className="text-gray-500 mb-6">We're currently onboarding specialists in this category. Stay tuned!</p>
                  <button
                    onClick={() => navigate("/healthcare")}
                    className="text-[#17A2B8] font-bold hover:underline"
                  >
                    Go back to explore others
                  </button>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Medicategory;