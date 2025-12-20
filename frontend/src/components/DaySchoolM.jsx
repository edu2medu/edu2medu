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
            (user) => user.category === category && user.status === 'active'
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
                className="relative bg-white rounded-lg shadow-lg mx-2 md:mx-4 h-60 cursor-pointer"
                onClick={() => navigate(`/category/${user.category}`)}
              >
                <div className="relative h-full">
                  <img
                    src={user.image || "/default-image.jpg"}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-t-xl"
                    onError={(e) => (e.target.src = "/default-image.jpg")}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-700 bg-opacity-100 rounded-b-xl">
                    <h2 className="text-lg font-semibold text-gray-200">
                      {user.name || 'No Name Found'}
                    </h2>
                    <p className="text-lg font-semibold text-gray-200">
                      {user.address}
                    </p>
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
