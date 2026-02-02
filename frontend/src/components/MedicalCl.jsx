import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from 'react';
import { deduplicatedGet } from '../utils/apiClient';
import { getCachedData, setCachedData } from '../utils/apiCache';
import { useNavigate } from 'react-router-dom';

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3, slidesToSlide: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1, slidesToSlide: 1 },
};

const categories = [
  'Hospital',
  'Private Clinic',
  'Medical Stores',
];

function MedicalCl() {
  const [usersByCategory, setUsersByCategory] = useState({});
  const [loading, setLoading] = useState(true); // Loading state for skeleton
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const cacheKey = 'all-users-healthcare';
      const cachedData = getCachedData(cacheKey);

      try {
        let response;
        if (cachedData) {
          // Use cached data for instant display (< 100ms)
          response = { data: cachedData };
          setLoading(false);
          // Process and display immediately
          if (response.data.success && Array.isArray(response.data.users)) {
            const categorizedUsers = {};
            categories.forEach((category) => {
              categorizedUsers[category] = response.data.users.filter(
                (user) => user.category === category && (user.status === 'active' || user.status === 'unblock')
              );
            });
            setUsersByCategory(categorizedUsers);
          }
        } else {
          // Fetch fresh data with timeout (max 3 seconds)
          const fetchPromise = deduplicatedGet(`${import.meta.env.VITE_BASEURI}/user/getHealthcareUsers`);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 3000)
          );

          response = await Promise.race([fetchPromise, timeoutPromise]);
          setCachedData(cacheKey, response.data);

          // Process and display immediately
          if (response.data.success && Array.isArray(response.data.users)) {
            const categorizedUsers = {};
            categories.forEach((category) => {
              categorizedUsers[category] = response.data.users.filter(
                (user) => user.category === category && (user.status === 'active' || user.status === 'unblock')
              );
            });
            setUsersByCategory(categorizedUsers);
          }
        }
      } catch (error) {
        // Silently handle errors, show empty state
        setUsersByCategory({});
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Skeleton Loading Component
  const renderSkeleton = () => (
    <div className="py-8 md:py-12 relative z-10">
      <header className="mb-6 px-6 md:px-16">
        <h1 className="text-3xl font-extrabold text-gray-900 border-l-4 border-blue-500 pl-4 animate-pulse">
          Loading...
        </h1>
      </header>
      <main className="px-6 md:px-16">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          showDots={false}
          arrows={false}
          containerClass="carousel-container"
          itemClass="carousel-item px-4"
        >
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-md p-4 animate-pulse border border-gray-100/50"
            >
              <div className="w-full h-52 bg-gray-200 rounded-2xl mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
            </div>
          ))}
        </Carousel>
      </main>
    </div>
  );

  const renderCarousel = (title, users) => (
    <div key={title} className="py-8 md:py-12 relative z-10">
      <header className="mb-6 px-6 md:px-16">
        <h1 className="text-3xl font-extrabold text-gray-900 border-l-4 border-blue-500 pl-4">{title}</h1>
      </header>
      <main className="px-6 md:px-16">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border-2 border-dashed border-gray-300 hover:border-[#17A2B8] transition-colors">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
              <p className="text-[#17A2B8] text-lg font-semibold mb-3">Coming Soon...</p>
              <p className="text-sm text-gray-500">We're currently onboarding {title.toLowerCase()} specialists. Check back soon!</p>
            </div>
          </div>
        ) : (
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            showDots={false}
            arrows={false}
            containerClass="carousel-container"
            itemClass="carousel-item px-4"
          >
            {users.map((user) => (
              <div
                key={user._id}
                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer border border-gray-100/50 h-full"
                onClick={() => navigate(`/medu-details`, { state: { user } })}
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                  <img
                    src={user.image || "/default-healthcare.jpg"}
                    alt={user.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/default-healthcare.jpg")}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] uppercase tracking-widest font-black bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-[#17A2B8]">
                      {user.category || title || "HEALTHCARE"}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                      <div className="w-2 h-2 rounded-full animate-pulse bg-[#17A2B8]"></div>
                      <span className="text-[10px] text-gray-700 font-bold uppercase tracking-wider">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3
                    className="text-xl font-bold text-gray-900 line-clamp-1 mb-2 transition-colors duration-300 hover:text-[#17A2B8]"
                  >
                    {user.name || 'No Name Found'}
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

                  <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
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
                    <button
                      className="px-5 py-2 text-white text-xs font-bold rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all duration-300 bg-[#17A2B8] hover:bg-[#138496]"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </main>
    </div>
  );

  // Progressive rendering: Show sections as data loads
  // Show first 2-3 sections immediately if they have data, others show skeleton
  const renderSectionsProgressively = () => {
    const categoryKeys = Object.keys(usersByCategory);
    const hasData = categoryKeys.length > 0;

    return categories.map((category, index) => {
      const users = usersByCategory[category] || [];
      const hasCategoryData = users.length > 0;

      // Show first 3 sections immediately if they have data, or show skeleton
      if (loading && !hasCategoryData && index < 3) {
        return (
          <div key={`skeleton-${category}-${index}`}>
            {renderSkeleton(category)}
          </div>
        );
      }

      // Render actual carousel if data is available
      return (
        <div key={category}>
          {renderCarousel(category, users)}
        </div>
      );
    });
  };

  return (
    <>
      {renderSectionsProgressively()}
    </>
  );
}

export default MedicalCl;