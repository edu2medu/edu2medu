import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt,  FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { motion } from "framer-motion";

const MeduDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      const savedUser = sessionStorage.getItem("selectedUser");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      sessionStorage.setItem("selectedUser", JSON.stringify(user));
    }

    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [user]);

  const handleBack = () => {
    sessionStorage.removeItem("selectedUser"); // Remove session data
    navigate("/healthcare"); // Navigate back to list page
  };
  // Function to format text with line breaks
  const formatTextWithLineBreaks = (text, prependAsterisk = false) => {
    if (!text) return "No information available.";
    return text.split("\n").map((line, index) => (
      <p key={index} className="text-gray-700 leading-relaxed">
        {prependAsterisk && line.trim() !== "" ? "* " : ""}
        {line}
      </p>
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-xl text-center"
        >
          <p className="text-red-600 text-lg font-semibold">User details not found.</p>
          <button
            className="mt-4 flex items-center justify-center gap-2 px-6 py-2 bg-teal-500 text-white rounded-lg shadow-lg hover:bg-teal-600 transition duration-300"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="mt-0">
      <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Back to List Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden lg:flex fixed top-24 left-4 z-50 items-center gap-2 px-4 py-2 bg-[#17A2B8] text-white rounded-full shadow-md hover:shadow-lg transition duration-300"
          onClick={handleBack}
        >
          <FaArrowLeft />
          <span>Back to List</span>
        </motion.button>

        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
          >
            <div className="relative">
              <div className="relative w-full h-52 sm:h-72 md:h-96 overflow-hidden">
                <motion.img
                  variants={{
                    hidden: { scale: 1.2, opacity: 0 },
                    visible: { scale: 1, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
                  }}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  src={user.image || "/placeholder.svg?height=400&width=800"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "/placeholder.svg?height=400&width=800")}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 bg-white px-6 py-4 rounded-xl shadow-lg border w-5/6 max-w-md text-center"
              >
                <h2 className="text-xl sm:text-3xl font-bold text-teal-700">{user.name}</h2>
                <p className="text-gray-600 text-sm sm:text-lg">{user.ctitle}</p>
              </motion.div>
            </div>

            <div className="p-6 pt-20 sm:p-10">
                     {/* Contact Information Section */}
                            <motion.div
                              variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: {
                                  opacity: 1,
                                  x: 0,
                                  transition: { delay: 0.5, duration: 0.5 },
                                },
                              }}
                              initial="hidden"
                              animate={isLoaded ? "visible" : "hidden"}
                              className="mb-8 bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl relative"
                            >
                              <FaQuoteLeft className="absolute top-4 left-4 flex text-sky-200 text-xl" />
                              <div className="flex  justify-between">
                                <div className="w-1/2 pr-4 px-10">
                                  <h3 className="text-xl font-bold text-sky-700 mb-2">
                                    Contact Information
                                  </h3>
                                  <h1 className="font-bold">
                                    {formatTextWithLineBreaks(user.contactInfo)}
                                  </h1>
                                </div>
                                <div className="w-1/2 px-25">
                                  <h3 className="text-xl font-semibold text-sky-700 mb-2">
                                    Establishment
                                  </h3>
                                  <h1 className="font-serif">
                                    {formatTextWithLineBreaks(user.establishment)}
                                  </h1>
                                </div>
                              </div>
                              <FaQuoteRight className="absolute bottom-4 right-4 text-sky-200 text-xl" />
                            </motion.div>
              {/* About Section */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.5 } },
                }}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                className="mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl relative"
              >
                <FaQuoteLeft className="absolute top-4 left-4 text-teal-200 text-xl" />
                <div className="ml-6 mr-6">
                  <h3 className="text-xl font-semibold text-teal-700 mb-2">About</h3>
                  {formatTextWithLineBreaks(user.additionalInfo)}
                  <p className="text-gray-700 leading-relaxed">{user.additionalInfo || "No additional information available."}</p>
                </div>
                <FaQuoteRight className="absolute bottom-4 right-4 text-teal-200 text-xl" />
              </motion.div>

              {/* Amenity Section */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.5 } },
                }}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                className="mb-8 bg-gradient-to-r from-cyan-50 to-sky-50 p-6 rounded-2xl relative"
              >
                <FaQuoteLeft className="absolute top-4 left-4 text-cyan-200 text-xl" />
                <div className="ml-6 mr-6">
                  <h3 className="text-xl font-semibold text-cyan-700 mb-2">Amenity</h3>
                  {user.amenity ? (
                    <ul className="list-disc pl-5">
                      {user.amenity
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, index) => (
                          <li key={index} className="text-gray-700 leading-relaxed">
                            * {line.trim()}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">No amenities listed.</p>
                  )}
                </div>
                <FaQuoteRight className="absolute bottom-4 right-4 text-cyan-200 text-xl" />
              </motion.div>

              {/* Specialization Section */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.5 } },
                }}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                className="mb-8 bg-gradient-to-r from-cyan-50 to-sky-50 p-6 rounded-2xl relative"
              >
                <FaQuoteLeft className="absolute top-4 left-4 text-cyan-200 text-xl" />
                <div className="p-6">
                  <h1 className="text-2xl font-semibold mb-4">Specialist Information</h1>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    {user.teachers && user.teachers.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {user.teachers.map((teacher, index) => {
                          const teacherName =
                            typeof teacher.name === "object" ? teacher.name.type : teacher.name || "Unknown";
                          const teacherQualification =
                            typeof teacher.qualification === "object"
                              ? teacher.qualification.type
                              : teacher.qualification || "Unknown";

                          return (
                            <li key={index} className="text-lg font-semibold">
                              <span className="text-teal-700">{teacherName}</span> -{" "}
                              {teacherQualification}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No specialist information available.</p>
                    )}
                  </div>
                </div>
                <FaQuoteRight className="absolute bottom-4 right-4 text-cyan-200 text-xl" />
              </motion.div>

             {/* Contact Information Section */}
             {/* <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { delay: 0.5, duration: 0.5 },
                  },
                }}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                className="mb-8 bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl relative"
              >
                <FaQuoteLeft className="absolute top-4 left-4 text-sky-200 text-xl" />
                <div className="ml-6 mr-6">
                  <h3 className="text-xl font-semibold text-sky-700 mb-2">
                    Contact Information
                  </h3>
                  {formatTextWithLineBreaks(user.contactInfo)}
                </div>
                <FaQuoteRight className="absolute bottom-4 right-4 text-sky-200 text-xl" />
              </motion.div> */}
 

              {/* Location Section */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.5 } },
                }}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                className="space-y-4"
              >
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  <div className="bg-teal-400 p-3 rounded-full shadow-md">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Location</h3>
                    <p className="text-gray-700">{user.address || "Not provided"}</p>
                  </div>
                </div>
              </motion.div>

              {/* Call Button */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.5 } },
                }}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                className="mt-8"
              >
                <button
                  className="w-full py-4 bg-teal-500 text-white font-medium rounded-xl shadow-lg hover:bg-teal-600 transition duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                  onClick={() => user.phone && window.open(`tel:${user.phone}`, "_self")}
                >
                  {user.phone ? `Call ${user.name.split(" ")[0]}` : "No Contact Available"}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MeduDetail;