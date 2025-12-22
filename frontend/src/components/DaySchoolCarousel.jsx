import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState, useMemo } from 'react';
import { deduplicatedGet } from '../utils/apiClient';
import { getCachedData, setCachedData } from '../utils/apiCache';
import { useNavigate } from 'react-router-dom';

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3, slidesToSlide: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1, slidesToSlide: 1 },
};

const categories = [
  'Day School',
  'Boarding School',
  'Play School',
  'Private Tutor',
  'Coaching Centre',
];

function DaySchoolCarousel() {
  const [usersByCategory, setUsersByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const cacheKey = 'all-users-education';
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
                (user) => user.category === category && user.status === 'active'
              );
            });
            setUsersByCategory(categorizedUsers);
          }
        } else {
          // Fetch fresh data with timeout (max 3 seconds)
          const fetchPromise = deduplicatedGet(`${import.meta.env.VITE_BASEURI}/user/getAllUsers`);
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
                (user) => user.category === category && user.status === 'active'
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

  const renderSkeleton = () => (
    <div className="bg-[#fffbe7] p-6 md:p-8 lg:p-12">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-left">
          Loading...
        </h1>
      </header>
      <main className="px-2 md:px-4 lg:px-8">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          showDots={false}
          arrows={false}
          containerClass="carousel-container"
          itemClass="carousel-item"
        >
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="relative bg-gray-200 rounded-xl shadow-lg mx-2 md:mx-4 h-64 md:h-80 animate-pulse"
            >
              <div className="relative h-full">
                <div className="w-full h-full bg-gray-300"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </main>
    </div>
  );

  const renderCarousel = (title, users) => (
    <div key={title} className="bg-[#fffbe7] p-6 md:p-8 lg:p-12 relative z-10">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-left">
          {title}
        </h1>
      </header>
      <main className="px-2 md:px-4 lg:px-8">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border-2 border-dashed border-gray-300 hover:border-[#E76F51] transition-colors">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
              <p className="text-[#E76F51] text-lg font-semibold mb-3">Coming Soon...</p>
              <p className="text-sm text-gray-500">We're currently adding {title.toLowerCase()} options. Check back soon!</p>
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
            itemClass="carousel-item"
          >
            {users.map((user) => (
              <div
                key={user._id}
                className="relative bg-white rounded-xl shadow-lg mx-2 md:mx-4 h-64 md:h-80 cursor-pointer overflow-hidden transform transition-transform hover:scale-105"
                onClick={() => navigate(`/category/${user.category}`)}
              >
                <div className="relative h-full">
                  <img
  src={user.image}
  alt={user.name}
  className="w-full h-full object-cover"
  // loading="lazy"
  // decoding="async"  
   onError={(e) => (e.target.src = "/default-image.png")}/* Prevents blocking the main thread */
/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h2 className="text-lg md:text-xl font-bold text-white">
                      {user.name || 'No Name Found'}
                    </h2>
                    <p className="text-sm md:text-base text-gray-200">
                      {user.address || 'No Address Found'}
                    </p>
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
            {renderSkeleton()}
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

export default DaySchoolCarousel;