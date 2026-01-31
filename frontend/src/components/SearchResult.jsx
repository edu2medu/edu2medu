import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults = [], selectedCategory = "" } = location.state || {};

  const handleDetailClick = (user) => {
    const route = selectedCategory === "Education" ? "/schools" : "/medu-details";
    navigate(route, { state: { user } });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <button
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 font-semibold rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-300"
            onClick={() => navigate("/")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {selectedCategory === "Education" ? "Education Results" : "Healthcare Results"}
          </h2>
          <div className="hidden sm:block w-24"></div> {/* Spacer for balance */}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {searchResults.length > 0 ? (
            searchResults.map((user, index) => (
              <div
                key={user._id || index}
                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer border border-gray-100/50"
                onClick={() => handleDetailClick(user)}
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={user.image || "/placeholder.svg?height=400&width=800"}
                    alt={user.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#17A2B8] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                      {user.category || (selectedCategory === "Education" ? "INSTITUTE" : "HEALTHCARE")}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] text-gray-700 font-bold uppercase tracking-wider">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-[#17A2B8] transition-colors duration-300">
                    {user.name}
                  </h3>

                  <div className="flex items-start gap-2 text-gray-500 mb-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#17A2B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm leading-snug line-clamp-2 italic font-medium">
                      {user.address || "Location information pending"}
                    </p>
                  </div>

                  {user.phone && (
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-medium">Contact:</span> {user.phone}
                    </p>
                  )}

                  <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-2">
                    {user.description || "Trusted provider offering world-class services and state-of-the-art facilities."}
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
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-block p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-500 font-medium">No results found for your search.</p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 text-[#17A2B8] font-bold hover:underline"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;