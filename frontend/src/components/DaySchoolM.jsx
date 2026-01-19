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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
              <p className="text-[#17A2B8] text-lg font-semibold mb-3">Coming Soon...</p>
              <p className="text-sm text-gray-500">We're currently onboarding {title.toLowerCase()} institutions. Check back soon!</p>
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
                onClick={() => navigate(`/category/${user.category}`)}
              >
                <img
                  src={user.image || "/default-image.jpg"}
                  alt={user.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                  onError={(e) => (e.target.src = "/default-image.jpg")}
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

  return (
    <div className="bg-white min-h-screen">
      {categories.map((category) => renderCarousel(category, usersByCategory[category] || []))}
    </div>
  );
}

export default DaySchoolM;
