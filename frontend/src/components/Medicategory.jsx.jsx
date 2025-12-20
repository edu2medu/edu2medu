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
          // Use cached data for instant display
          response = { data: cachedData };
          setLoading(false);
        } else {
          response = await deduplicatedGet(
            `${import.meta.env.VITE_BASEURI}/user/getHealthcareUsers`
          );
          setCachedData(cacheKey, response.data);
        }

        if (response.data?.users && Array.isArray(response.data.users)) {
          // Strict filtering - only show 'active' status users
          const activeUsers = response.data.users.filter(
            (user) => 
              user.category === categoryName && 
              user.status === 'active' // exact match with enum value
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
    <div className="bg-gradient-to-br from-teal-50 via-cyan-70 to-sky-50 min-h-screen py-10 px-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-24 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#17A2B8] text-white rounded-full shadow-md hover:shadow-lg"
        onClick={() => navigate("/healthcare")}
      >
        <FaArrowLeft />
        <span>Back</span>
      </motion.button>

      {/* Category Title */}
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 pt-4">
        {categoryName}
      </h2>

      {/* Status Messages */}
      {loading && (
        <p className="text-center text-gray-600 animate-pulse">Loading providers...</p>
      )}
      
      {error && (
        <p className="text-center text-red-500 bg-red-50 p-3 rounded-lg max-w-md mx-auto">
          {error}
        </p>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {!loading && users.length > 0 ? (
          users.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/medu-details`, { state: { user } })}
            >
              {/* User Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={user.image || "/default-healthcare.jpg"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default-healthcare.jpg";
                  }}
                />
              </div>

              {/* User Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 truncate">
                  {user.name || "Healthcare Provider"}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {user.ctitle || "Specialist"}
                </p>
                
                {/* Status Badge */}
                <div className="mt-3">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {user.status || "active"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-full flex justify-center py-16 px-4"
            >
              <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center border-2 border-dashed border-gray-300 hover:border-[#17A2B8] transition-colors">
                <div className="mb-6">
                  <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">{categoryName}</h3>
                <p className="text-[#17A2B8] text-xl font-semibold mb-4">Coming Soon...</p>
                <p className="text-base text-gray-500 mb-2">We're currently onboarding {categoryName.toLowerCase()} specialists.</p>
                <p className="text-sm text-gray-400">Please check back soon for updates!</p>
              </div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
};

export default Medicategory;