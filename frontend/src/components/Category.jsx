import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { deduplicatedGet } from "../utils/apiClient";
import { getCachedData, setCachedData } from "../utils/apiCache";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const truncateText = (text, wordLimit = 20) => {
  const words = text.split(" ");
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
};

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for skeleton

  useEffect(() => {
    const fetchCategories = async () => {
      const cacheKey = 'all-categories-education';
      const cachedData = getCachedData(cacheKey);

      try {
        let response;
        if (cachedData) {
          // Use cached data for instant display
          response = { data: cachedData };
          setLoading(false);
        } else {
          response = await deduplicatedGet(`${import.meta.env.VITE_BASEURI}/user/getallcategories`);
          setCachedData(cacheKey, response.data);
        }

        const categoryData = Array.isArray(response.data) ? response.data : [];
        const filteredCategories = categoryData.filter(category => category.userType === "education");
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Change this threshold as needed
    };

    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize); // Add resize listener

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);

  const additionalServices = [
    {
      imgSrc: "india.jpg",
      title: "Pan India Presence",
      description:
        "Whether you're in a metro city or a small town, Edu2Medu ensures that schools from every region of India are included, giving you a wide selection of educational institutions to choose from.",
    },
    {
      imgSrc: "edu.jpg",
      title: "All Boards",
      description:
        "Be it CBSE, ICSE, IB or state boards, Edu2Medu has listed schools with their diverse approaches and curriculum for parents to choose.",
    },
    {
      imgSrc: "team3.jpg",
      title: "Counselling Team",
      description:
        "Our dedicated team of expert counsellors listen to you and comprehend your need and suggest to you unbiased options that suit your requirement.",
    },
    {
      imgSrc: "cap.webp",
      title: "From Play School to Pre-University",
      description:
        "Edu2Medu as a platform, caters to all parents be it seeking admission in preschool, day-school, boarding school or even pre-universities.",
    },
  ];

  // Skeleton Loading Component
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6 md:p-8 lg:p-10">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white shadow-md rounded-md p-4 animate-pulse">
          <div className="w-full h-50 bg-gray-300 rounded-t-md"></div>
          <div className="h-6 bg-gray-300 rounded mt-3 w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded mt-2 w-1/2"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-amber-100 lg:min-h-screen sm:min-h-screen lg:py-10 sm:py-10 px-8">
      <div className="text-center mb-8 sm:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Browse by Category</h1>
        <p className="text-gray-600 mt-3 text-sm md:text-base">Find the best fit for your child's education</p>
      </div>

      {/* Categories Section */}
      {loading ? (
        renderSkeleton()
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6 md:p-8 lg:p-10">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition-transform transform hover:scale-95 cursor-pointer"
              onClick={() => navigate(`/category/${category.categoryType.replace(/\s+/g, " ")}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={category.image ? `${import.meta.env.VITE_BASEURI}/${category.image}` : "/default-image.jpg"}
                alt={category.name}
                className="w-full h-50 object-cover rounded-t-md"
                loading="lazy" // Lazy loading for images
              />
              <h2 className="text-lg font-bold text-gray-800 mt-3">{category.name}</h2>
              <p className="text-gray-600 text-sm mt-1">
                {truncateText(category.description || "Explore the best options available.")}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Additional Services Section */}
      <div className="mt-16 px-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Additional Services</h2>

        {isMobile ? (
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <Carousel
              responsive={{
                superLargeDesktop: {
                  breakpoint: { max: 4000, min: 1024 },
                  items: 3,
                },
                desktop: {
                  breakpoint: { max: 1024, min: 768 },
                  items: 2,
                },
                tablet: {
                  breakpoint: { max: 768, min: 464 },
                  items: 1,
                },
                mobile: {
                  breakpoint: { max: 464, min: 0 },
                  items: 1,
                },
              }}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              showDots={false}
              arrows={false}
            >
              {additionalServices.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white shadow-xl rounded-lg p-6 flex flex-col sm:flex-row transition-transform transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-full sm:w-1/2 pr-4">
                    <img
                      src={service.imgSrc}
                      alt={service.title}
                      className="w-full h-40 mt-4 object-cover rounded-t-lg"
                      loading="lazy" // Lazy loading for images
                    />
                  </div>
                  <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                    <h3 className="text-lg font-semibold text-gray-800 mt-4">{service.title}</h3>
                    <p className="text-gray-600 mt-2 px-6">{truncateText(service.description)}</p>
                  </div>
                </motion.div>
              ))}
            </Carousel>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 lg:grid-rows-2 gap-8">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-white shadow-xl rounded-lg p-6 flex flex-col lg:flex-row transition-transform transform"
              >
                <div className="w-full lg:w-1/2 pr-4">
                  <img
                    src={service.imgSrc}
                    alt={service.title}
                    className="w-full h-40 mt-4 object-cover rounded-t-lg"
                    loading="lazy" // Lazy loading for images
                  />
                </div>
                <div className="w-full lg:w-1/2 mt-4 sm:mt-0">
                  <h3 className="text-lg font-semibold text-gray-800 mt-4">{service.title}</h3>
                  <p className="text-gray-600 mt-2 px-6">{truncateText(service.description)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;