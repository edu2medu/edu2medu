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
        <h1 className="text-3xl font-extrabold text-gray-900 border-l-4 border-[#17A2B8] pl-4 animate-pulse">
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
              className="relative bg-white rounded-xl shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer overflow-hidden animate-pulse"
            >
              <div className="w-full h-64 bg-gray-300 rounded-t-xl"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent">
                <div className="h-6 bg-gray-400 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </Carousel>
      </main>
    </div>
  );

  const renderCarousel = (title, users) => (
    <div key={title} className="py-8 md:py-12 relative z-10">
      <header className="mb-6 px-6 md:px-16">
        <h1 className="text-3xl font-extrabold text-gray-900 border-l-4 border-[#17A2B8] pl-4">{title}</h1>
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
                className="relative bg-white rounded-xl shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/medicalcategory/${user.category}`)}
              >
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                  loading="lazy" // Lazy loading for images
                />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent">
                  <h2 className="text-lg font-semibold text-white">{user.name || 'No Name Found'}</h2>
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