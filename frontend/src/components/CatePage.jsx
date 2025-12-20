import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { deduplicatedGet } from "../utils/apiClient";
import { getCachedData, setCachedData } from "../utils/apiCache";

const CatePage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [users, setusers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setError(null);
      setLoading(true);
      
      const cacheKey = `all-users-education`;
      const cachedData = getCachedData(cacheKey);
      
      try {
        let response;
        if (cachedData) {
          // Use cached data immediately for instant display
          response = { data: cachedData };
          setLoading(false);
        } else {
          // Fetch fresh data
          response = await deduplicatedGet(`${import.meta.env.VITE_BASEURI}/user/getAllUsers`);
          setCachedData(cacheKey, response.data);
        }
        
        if (response.data && Array.isArray(response.data.users)) {
          const filteredusers = response.data.users.filter(
            (user) => user.category === categoryName && user.status === 'active'
          );
          setusers(filteredusers);
        } else {
          console.error("Unexpected response format", response.data);
          setError("Invalid data format received from the server.");
        }
      } catch (error) {
        console.error("Error fetching users", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [categoryName]);

  // Memoize filtered users to prevent unnecessary re-renders
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) => user.category === categoryName && user.status === 'active'
    );
  }, [users, categoryName]);

  return (
    <div className="bg-amber-100 min-h-screen py-10 px-8">
      <button
        className="mb-4 px-4 py-2 bg-[#17A2B8] text-white rounded-md"
        onClick={() => navigate("/")}
      >
        Back
      </button>

      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        {categoryName}
      </h2>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white shadow-md rounded-md p-4 animate-pulse">
              <div className="w-full h-40 bg-gray-300 rounded-t-md"></div>
              <div className="h-6 bg-gray-300 rounded mt-3 w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded mt-2 w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => navigate("/schools", { state: { user } })}
            >
              <img
                src={user.image || "/default-image.jpg"}
                alt={user.name}
                className="w-full h-40 object-cover rounded-t-md"
                loading="lazy"
                onError={(e) => (e.target.src = "/default-image.jpg")}
              />
              <h2 className="text-lg font-bold text-gray-800 mt-3">
                {user.name || "No Name Available"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {user.description || "No Description Available"}
              </p>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center border-2 border-dashed border-gray-300 hover:border-[#E76F51] transition-colors">
            <div className="mb-6">
              <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">{categoryName}</h3>
            <p className="text-[#E76F51] text-xl font-semibold mb-4">Coming Soon...</p>
            <p className="text-base text-gray-500 mb-2">We're currently adding {categoryName.toLowerCase()} options.</p>
            <p className="text-sm text-gray-400">Please check back soon for updates!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatePage;