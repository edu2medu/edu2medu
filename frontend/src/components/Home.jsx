import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchIcon } from "@heroicons/react/outline";
import { motion } from "framer-motion";
import { deduplicatedGet } from "../utils/apiClient";
import { debounce } from "../utils/debounce";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Education");
  const [selectedOption, setSelectedOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.pathname.includes("/healthcare")) {
      setSelectedCategory("Healthcare");
    } else {
      setSelectedCategory("Education");
    }
  }, [location.pathname]);



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
        const results = Array.isArray(response.data) ? response.data : [];
        const activeResults = results.filter(user => user.status === 'active' || user.status === 'unblock');

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
            className={`px-6 py-2 rounded-md text-lg font-bold transition-all relative z-20 ${selectedCategory === category
              ? `ring-2 ring-white ring-offset-2 ring-offset-gray-900 ${category === "Education"
                ? "bg-[#E76F51] text-white"
                : "bg-[#17A2B8] text-white"
              }`
              : "bg-white text-gray-800 hover:bg-gray-100"
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
          className={`bg-gradient-to-r from-white ${selectedCategory === "Education" ? "to-[#E76F51]" : "to-[#17A2B8]"
            } bg-clip-text text-transparent`}
        >
          {selectedCategory === "Education"
            ? "Find Your Dream School!"
            : "Find Your Trusted Healthcare!"}
        </span>
      </motion.h1>

      {/* Search Bar */}
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mt-6 flex justify-center items-center z-20">
        <div className="flex items-center w-full max-w-md relative">
          <SearchIcon
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${selectedCategory === "Education" ? "text-[#E76F51]" : "text-[#17A2B8]"
              }`}
          />
          <input
            type="text"
            placeholder={
              selectedOption ||
              (selectedCategory === "Education"
                ? "Search schools, subjects, boards, cities..."
                : "Search hospitals, specialists, clinics...")
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
    </div>
  );
};

export default Home;