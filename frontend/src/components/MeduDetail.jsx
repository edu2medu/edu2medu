import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
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
    <div className="pt-24 sm:pt-28 bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 min-h-screen">
      {/* Back Button Container - Standardized positioning */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#17A2B8] text-white rounded-full shadow-lg hover:bg-[#138496] transition-all duration-300 transform hover:scale-105 active:scale-95 z-30"
          onClick={handleBack}
        >
          <FaArrowLeft className="text-sm" />
          <span className="font-bold text-sm sm:text-base">Back to List</span>
        </motion.button>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
        >
          <div className="relative">
            <div className="relative w-full h-56 sm:h-80 md:h-[28rem] overflow-hidden">
              <motion.img
                variants={{
                  hidden: { scale: 1.1, opacity: 0 },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    transition: { duration: 0.8, ease: "easeOut" },
                  },
                }}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                src={user.image || "/placeholder.svg?height=400&width=800"}
                alt={user.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => (e.target.src = "/placeholder.svg?height=400&width=800")}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Standardized Title Card - Matches SchoolDetail */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative mx-auto -mt-16 sm:-mt-20 bg-white px-6 py-5 sm:px-10 sm:py-8 rounded-2xl shadow-xl border border-gray-50 w-[92%] sm:w-5/6 text-center z-20"
            >
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#17A2B8] tracking-tight">
                {user.name}
              </h2>
              <div className="w-16 h-1 bg-[#17A2B8] opacity-30 mx-auto my-3 rounded-full"></div>
              <p className="text-gray-500 text-sm sm:text-lg italic leading-relaxed">
                {user.description || "A premier healthcare facility dedicated to providing exceptional medical care."}
              </p>
              {/* Contact and Address Info */}
              <div className="mt-4 flex flex-col sm:flex-row gap-2 text-gray-700 justify-center">
                {user.phone && (
                  <p className="flex items-center justify-center sm:justify-start">
                    <FaPhoneAlt className="mr-2" />
                    <span className="font-medium">Contact:</span> {user.phone}
                  </p>
                )}
                {user.address && (
                  <p className="flex items-center justify-center sm:justify-start">
                    <FaMapMarkerAlt className="mr-2" />
                    <span className="font-medium">Address:</span> {user.address}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          <div className="p-4 sm:p-6 pt-16 sm:pt-20 md:p-10">
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
              className="mb-8 bg-gradient-to-r from-sky-50 to-blue-50 p-4 sm:p-6 rounded-2xl relative"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-full sm:w-1/2 sm:pr-4">
                  <h3 className="text-lg sm:text-xl font-bold text-sky-700 mb-2">
                    Contact Information
                  </h3>
                  <div className="text-sm sm:text-base font-bold break-words">
                    {formatTextWithLineBreaks(user.contactInfo)}
                  </div>
                </div>
                <div className="w-full sm:w-1/2 sm:pl-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-sky-700 mb-2">
                    Establishment
                  </h3>
                  <div className="text-sm sm:text-base font-serif break-words">
                    {formatTextWithLineBreaks(user.establishment)}
                  </div>
                </div>
              </div>
            </motion.div>
            {/* About Section */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.5 } },
              }}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 p-4 sm:p-6 rounded-2xl relative"
            >
              <div className="px-2 sm:px-6">
                <h3 className="text-lg sm:text-xl font-semibold text-teal-700 mb-2">About</h3>
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                  {formatTextWithLineBreaks(user.additionalInfo)}
                  {!user.additionalInfo && <p>No additional information available.</p>}
                </div>
              </div>
            </motion.div>

            {/* Amenity Section */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.5 } },
              }}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="mb-8 bg-gradient-to-r from-cyan-50 to-sky-50 p-4 sm:p-6 rounded-2xl relative"
            >
              <div className="px-2 sm:px-6">
                <h3 className="text-lg sm:text-xl font-semibold text-cyan-700 mb-2">Amenity</h3>
                {user.amenity ? (
                  <ul className="list-disc pl-4 sm:pl-5 space-y-2">
                    {user.amenity
                      .split("\n")
                      .filter((line) => line.trim() !== "")
                      .map((line, index) => (
                        <li key={index} className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                          {line.trim()}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">No amenities listed.</p>
                )}
              </div>
            </motion.div>

            {/* Specialization Section */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { delay: 0.4, duration: 0.5 } },
              }}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="mb-8 bg-gradient-to-r from-cyan-50 to-sky-50 p-4 sm:p-6 rounded-2xl relative"
            >
              <div className="p-2 sm:p-4 md:p-6">
                <h1 className="text-xl sm:text-2xl font-semibold mb-4">Specialist Information</h1>
                <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                  {user.teachers && user.teachers.length > 0 ? (
                    <ul className="list-disc pl-4 sm:pl-5 space-y-2">
                      {user.teachers.map((teacher, index) => {
                        const teacherName =
                          typeof teacher.name === "object" ? teacher.name.type : teacher.name || "Unknown";
                        const teacherQualification =
                          typeof teacher.qualification === "object"
                            ? teacher.qualification.type
                            : teacher.qualification || "Unknown";

                        return (
                          <li key={index} className="text-sm sm:text-base md:text-lg font-semibold break-words">
                            <span className="text-teal-700">{teacherName}</span> -{" "}
                            {teacherQualification}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm sm:text-base text-gray-600">No specialist information available.</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Location Section */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.5 } },
              }}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="mb-8"
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
                <span className="flex items-center justify-center gap-2">
                  <FaPhoneAlt />
                  {user.phone ? `Call Now` : "No Contact Available"}
                </span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MeduDetail;