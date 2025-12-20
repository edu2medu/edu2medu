import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, selectedCategory } = location.state || {
    searchResults: [],
    selectedCategory: "",
  };

  return (
    <div className="bg-amber-100 min-h-screen py-10 px-8">
      {/* Back Button */}
      <button
        className="mb-4 px-4 py-2 bg-[#17A2B8] text-white rounded-md"
        onClick={() => navigate("/")}
      >
        Back
      </button>

      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        {selectedCategory === "Education" ? "Education Results" : "Healthcare Results"}
      </h2>

      {/* Search Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.length > 0 ? (
          searchResults.map((user, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => navigate("/schools", { state: { user } })}
            >
              {/* User Image */}
                  <img
  src={user.image}
  alt={user.name}
  className="w-full h-full object-cover"
  loading="lazy"
  decoding="async"  /* Prevents blocking the main thread */
/>
        
              {/* User Name */}
              <h2 className="text-lg font-bold text-gray-800 mt-3">
                {user.name || "No Name Available"}
              </h2>
              {/* User Description */}
              <p className="text-gray-600 text-sm mt-1">
                {user.ctitle || "No Description Available"}
              </p>
              {/* Additional Details */}
              <p className="text-sm text-gray-600 mt-1">{user.address}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResult;