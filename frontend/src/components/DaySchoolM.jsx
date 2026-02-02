import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
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

function DaySchoolM() {
  const [usersByCategory, setUsersByCategory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASEURI}/user/getAllUsers`)
      .then((response) => {
        if (response.data.success && Array.isArray(response.data.users)) {
          const categorizedUsers = {};
          categories.forEach((category) => {
            categorizedUsers[category] = response.data.users.filter(
              (user) => user.category === category && (user.status === 'active' || user.status === 'unblock')
            );
          });
          setUsersByCategory(categorizedUsers);
        } else {
          console.error('Invalid API response format:', response.data);
        }
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);


  const renderCarousel = (title, users) => {
    // Don't render empty categories - hide them completely
    if (users.length === 0) {
      return null;
    }

    return (
      <div key={title} className="bg-gray-100 p-8 relative z-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-left pl-4 lg:pl-16">{title}</h1>
        </header>
        <main className="px-4 md:px-8 lg:px-16 py-5">
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
                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer border border-gray-100/50 h-full mx-2"
                onClick={() => navigate(`/schools`, { state: { user } })}
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                  <img
                    src={user.image || "/default-image.png"}
                    alt={user.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/default-image.png")}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] uppercase tracking-widest font-black bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-[#E76F51]">
                      {user.category || title || "INSTITUTE"}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                      <div className="w-2 h-2 rounded-full animate-pulse bg-[#E76F51]"></div>
                      <span className="text-[10px] text-gray-700 font-bold uppercase tracking-wider">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3
                    className="text-xl font-bold text-gray-900 line-clamp-1 mb-2 transition-colors duration-300 hover:text-[#E76F51]"
                  >
                    {user.name || 'No Name Found'}
                  </h3>

                  <div className="flex items-start gap-2 text-gray-500 mb-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E76F51]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      className="px-5 py-2 text-white text-xs font-bold rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all duration-300 bg-[#E76F51] hover:bg-[#d34c2a]"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </main>
      </div>
    );
  };

  return (
    <div className="bg-gray-100">
      {categories.map((category) => renderCarousel(category, usersByCategory[category] || []))}
    </div>
  );
}

export default DaySchoolM;
