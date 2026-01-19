import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";
import { deduplicatedGet } from "../utils/apiClient";
import { getCachedData, setCachedData } from "../utils/apiCache";
import { debounce } from "../utils/debounce";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Education");
  const [selectedOption, setSelectedOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    if (location.pathname.includes("/healthcare")) {
      setSelectedCategory("Healthcare");
    } else {
      setSelectedCategory("Education");
    }
  }, [location.pathname]);

  // Fetch categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      const cacheKey = 'all-categories';
      const cachedData = getCachedData(cacheKey);

      try {
        let response;
        if (cachedData) {
          // Use cached data for instant display (< 100ms)
          response = { data: cachedData };
          setCategoriesLoading(false);
          setAllCategories(response.data || []);
        } else {
          // Fetch fresh data with timeout (max 2 seconds for categories)
          const fetchPromise = deduplicatedGet(`${import.meta.env.VITE_BASEURI}/user/getallcategories`);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 2000)
          );

          response = await Promise.race([fetchPromise, timeoutPromise]);
          setCachedData(cacheKey, response.data);
          setAllCategories(response.data || []);
        }
      } catch (error) {
        setAllCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on selected category type
  const filteredCategories = useMemo(() => {
    const userType = selectedCategory === "Education" ? "education" : "healthcare";
    return allCategories.filter(category => category.userType === userType);
  }, [allCategories, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedOption("");
    navigate(category === "Education" ? "/" : "/healthcare");
  };
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint =
        selectedCategory === "Education"
          ? `${import.meta.env.VITE_BASEURI}/user/searchEducation`
          : `${import.meta.env.VITE_BASEURI}/user/searchHealthcare`;

      const response = await deduplicatedGet(endpoint, {
        params: { query: searchQuery },
      });

      if (response.status === 200) {
        // Filter results to only show active or unblocked users
        const activeResults = response.data.filter(user => user.status === 'active' || user.status === 'unblock');

        navigate("/search-results", {
          state: {
            searchResults: activeResults,
            selectedCategory
          },
        });
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside 2xx
        setError(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        // Request was made but no response received
        setError("Network error. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError("An unexpected error occurred.");
      }
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search handler (300ms delay)
  const debouncedSearch = debounce(handleSearch, 300);

  // Handle category click - navigate to category page
  const handleCategoryClick = (category) => {
    const categoryName = category.categoryType || category.name;
    if (selectedCategory === "Education") {
      navigate(`/category/${categoryName.replace(/\s+/g, " ")}`);
    } else {
      navigate(`/medicalcategory/${categoryName.replace(/\s+/g, " ")}`);
    }
  };

  return (
    <div className="relative w-full bg-black min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          key={selectedCategory}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src={selectedCategory === "Education" ? "educ.mp4" : "h.mp4"}
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      {/* Category Buttons */}
      <div className="relative z-10 flex gap-6 mb-6 flex-wrap justify-center">
        {["Education", "Healthcare"].map((category) => (
          <button
            key={category}
            className={`px-6 py-2 rounded-md text-lg font-bold transition-all ${selectedCategory === category
              ? category === "Education"
                ? "bg-[#E76F51] text-white"
                : "bg-[#17A2B8] text-white"
              : "bg-gray-200 text-black hover:bg-opacity-80"
              }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Animated Title */}
      <motion.h1
        className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
      >
        <span
          className={`bg-gradient-to-r from-white ${selectedCategory === "Education"
            ? "to-[#E76F51]"
            : "to-[#17A2B8]"
            } bg-clip-text text-transparent`}
        >
          {selectedCategory === "Education"
            ? "Find Your Dream School!"
            : "Find Your Trusted Healthcare!"}
        </span>
      </motion.h1>

      {/* Search Bar */}
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mt-6 flex justify-center items-center">
        <div className="flex items-center w-full max-w-md relative">
          <SearchIcon
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${selectedCategory === "Education"
              ? "text-[#E76F51]"
              : "text-[#17A2B8]"
              }`}
          />
          <input
            type="text"
            placeholder={
              selectedOption ||
              (selectedCategory === "Education"
                ? "Search schools, boards, cities..."
                : "Search hospitals, clinics, doctors...")
            }
            className="p-3 pl-10 pr-14 rounded-lg w-full text-sm sm:text-base placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#5e758e] shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className={`absolute right-1 top-1/2 transform -translate-y-1/2 ${selectedCategory === "Education" ? "bg-[#E76F51]" : "bg-[#17A2B8]"
              } text-white p-2 rounded-md hover:bg-opacity-80 transition duration-300 ease-in-out transform hover:scale-110`}
            onClick={handleSearch}
          >
            <SearchIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dynamic Categories List */}
      <div className="relative z-10 mt-4 px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 sm:flex sm:flex-wrap sm:justify-center text-center sm:text-left">
        {categoriesLoading ? (
          // Loading skeleton
          [...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`h-6 w-20 sm:w-24 bg-gray-300 rounded animate-pulse mx-auto ${selectedCategory === "Education"
                ? "bg-[#E76F51]/30"
                : "bg-[#17A2B8]/30"
                }`}
            ></div>
          ))
        ) : filteredCategories.length > 0 ? (
          filteredCategories.map((category) => {
            const categoryName = category.categoryType || category.name;
            return (
              <motion.span
                key={category._id || categoryName}
                className={`font-bold text-center sm:text-left cursor-pointer text-xs sm:text-sm md:text-base transition duration-300 px-2 py-1 rounded-md hover:bg-white/10 ${selectedCategory === "Education"
                  ? "text-[#E76F51] hover:text-[#d34c2a]"
                  : "text-[#17A2B8] hover:text-[#117585]"
                  }`}
                onClick={() => handleCategoryClick(category)}
                title={category.description || categoryName}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {categoryName}
              </motion.span>
            );
          })
        ) : (
          // Fallback if no categories found
          <span className={`text-sm col-span-full ${selectedCategory === "Education"
            ? "text-[#E76F51]"
            : "text-[#17A2B8]"
            }`}>
            No categories available
          </span>
        )}
      </div>
    </div>
  );
};

export default Home;