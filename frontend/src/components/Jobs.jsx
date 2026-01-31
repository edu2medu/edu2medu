import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASEURI}/user/getalljobs`);
        const jobsData = Array.isArray(response.data) ? response.data : [];
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-8 sm:py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
          <div className="w-full lg:w-1/2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white px-6 py-2 rounded-full shadow-lg"
              >
                <span className="text-2xl">📝</span>
                <span className="font-semibold">Post Job Openings</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight break-words">
                Connect with the <span className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] bg-clip-text text-transparent">Right Talent!</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                At <strong className="text-[#17A2B8]">Edu2Medu</strong>, we believe in building a <strong className="text-[#1E2939]">strong bridge</strong> between opportunity and talent in the education and healthcare sectors.
              </p>

              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                If you're an institution, organization, or professional looking to hire, <strong className="text-[#17A2B8]">we've made it simple for you!</strong>
              </p>

              {/* Modern Feature Cards */}
              <div className="mt-8 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 hover:border-[#17A2B8]/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl text-white font-bold">✓</span>
                    </div>
                    <p className="text-lg text-gray-800 leading-relaxed pt-2">
                      <strong className="text-gray-900">Any registered subscriber</strong> can post job openings on our platform.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 hover:border-[#17A2B8]/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl text-white font-bold">✓</span>
                    </div>
                    <p className="text-lg text-gray-800 leading-relaxed pt-2">
                      Mention your <strong className="text-gray-900">job details and contact information</strong>, and interested candidates will reach out to you directly.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 hover:border-[#17A2B8]/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl text-white font-bold">✓</span>
                    </div>
                    <p className="text-lg text-gray-800 leading-relaxed pt-2">
                      Whether you're hiring <strong className="text-gray-900">teachers, medical staff, trainers, or admins</strong> – Edu2Medu helps you connect with the right people.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="lg:w-1/2 flex justify-center relative"
          >
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#17A2B8]/20 to-[#1E2939]/20 rounded-full blur-3xl animate-pulse"></div>
              <motion.img
                src="ab.jpg"
                alt="Educational items illustration"
                className="relative object-cover rounded-3xl shadow-2xl w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px] border-4 border-white/50 ring-4 ring-[#17A2B8]/20 transform transition-all duration-500 ease-in-out"
                whileHover={{ scale: 1.05, rotate: 2 }}
              />
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center"
              >
                <span className="text-2xl">💼</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center"
              >
                <span className="text-2xl">🎓</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Why Work With Edu2Medu Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose <span className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] bg-clip-text text-transparent">Edu2Medu?</span>
            </h2>
            <p className="text-lg text-gray-600">Discover what makes us the perfect platform for your hiring needs</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Collaborative Environment",
                desc: "We foster a collaborative environment to deliver excellent education and healthcare services.",
                gradient: "from-blue-500 to-cyan-600",
                icon: "🤝"
              },
              {
                title: "Growth Opportunities",
                desc: "Develop your skills and advance your career in education and healthcare through mentorship and training.",
                gradient: "from-purple-500 to-pink-600",
                icon: "📈"
              },
              {
                title: "Exciting Projects",
                desc: "Work on impactful projects that make a difference in the education and healthcare sectors.",
                gradient: "from-orange-500 to-red-600",
                icon: "🚀"
              },
              {
                title: "Flexible Work Culture",
                desc: "Enjoy a healthy work-life balance with our flexible work policies.",
                gradient: "from-green-500 to-emerald-600",
                icon: "⚖️"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative overflow-hidden bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                {/* Icon */}
                <div className={`relative mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                  <span className="text-3xl">{item.icon}</span>
                </div>

                <h3 className="relative text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#17A2B8] transition-colors">
                  {item.title}
                </h3>
                <p className="relative text-base text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Open Positions Section */}
        <div className="mt-20 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Open <span className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] bg-clip-text text-transparent">Positions</span>
            </h2>
            <p className="text-lg text-gray-600">Explore exciting career opportunities</p>
          </motion.div>

          {/* Display Jobs Dynamically */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 overflow-hidden"
                >
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#17A2B8] to-[#1E2939]"></div>

                  {/* Badge */}
                  <div className="inline-block mb-4 px-3 py-1 bg-gradient-to-r from-[#17A2B8]/10 to-[#1E2939]/10 rounded-full">
                    <span className="text-sm font-semibold text-[#17A2B8]">{job.jobType}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#17A2B8] transition-colors">
                    {job.jobTitle}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700 flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Company:</span>
                      <span>{job.companyName}</span>
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Location:</span>
                      <span>{job.location}</span>
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Salary:</span>
                      <span className="text-[#17A2B8] font-semibold">{job.salary}</span>
                    </p>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{job.jobDescription}</p>

                  {job.applicationDeadline && (
                    <p className="text-sm text-gray-500 mb-4">
                      <strong>Deadline:</strong> {job.applicationDeadline}
                    </p>
                  )}

                  <button className="w-full bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    Apply Now
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="inline-block p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
                  <span className="text-6xl mb-4 block">📋</span>
                  <p className="text-xl text-gray-700 font-semibold">No job openings available at the moment.</p>
                  <p className="text-gray-500 mt-2">Check back soon for new opportunities!</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
