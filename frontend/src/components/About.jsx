"use client";
import { motion } from "framer-motion";
import { 
  Target, 
  Eye, 
  Users, 
  Search, 
  Heart, 
  GraduationCap, 
  Stethoscope,
  CheckCircle,
  Award,
  Globe,
  Zap
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find the perfect educational institution or healthcare provider with our advanced search engine.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Users,
      title: "Trusted Network",
      description: "Connect with verified institutions and healthcare providers in your area.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "We prioritize your needs and make finding the right services effortless.",
      color: "from-red-500 to-rose-600"
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Get instant access to comprehensive information and real-time updates.",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  const values = [
    {
      icon: CheckCircle,
      title: "Accuracy",
      description: "We ensure all information is verified and up-to-date."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing the best user experience."
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Making quality education and healthcare accessible to everyone."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#17A2B8]/10 to-[#1E2939]/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
    <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white px-6 py-2 rounded-full shadow-lg mb-6">
              <span className="text-2xl">🎓</span>
              <span className="font-semibold">About Edu2Medu</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Connecting <span className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] bg-clip-text text-transparent">Talent</span> with <span className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] bg-clip-text text-transparent">Opportunity</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
              Edu2Medu is your trusted platform for discovering quality education and healthcare services. 
              We bridge the gap between seekers and providers, making informed decisions easier than ever.
            </p>
          </motion.div>
        </div>
      </section>
        
        {/* Who We Are Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 space-y-6"
            >
              <div className="inline-block">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Who We <span className="text-[#17A2B8]">Are</span>
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-[#17A2B8] to-[#1E2939] rounded-full"></div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong className="text-[#17A2B8]">Edu2Medu</strong> is a comprehensive search platform dedicated to 
                connecting individuals with the best educational institutions and healthcare providers. 
                We understand that choosing the right school, college, or healthcare facility is a crucial 
                decision that impacts lives.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our platform serves as a bridge, bringing together students, parents, patients, and service 
                providers in one unified ecosystem. Whether you're looking for a school, coaching center, 
                hospital, or clinic, <strong className="text-[#1E2939]">Edu2Medu makes your search simple and reliable</strong>.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-[#17A2B8]/20">
                  <p className="text-sm font-semibold text-gray-700">🎯 Verified Listings</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-[#17A2B8]/20">
                  <p className="text-sm font-semibold text-gray-700">📊 Comprehensive Data</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-[#17A2B8]/20">
                  <p className="text-sm font-semibold text-gray-700">🔍 Easy Search</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="lg:w-1/2 flex justify-center relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#17A2B8]/20 to-[#1E2939]/20 rounded-3xl blur-3xl animate-pulse"></div>
                <motion.img
                  src="student.jpg"
                  alt="Edu2Medu Platform"
                  className="relative object-cover rounded-3xl shadow-2xl w-full max-w-md h-auto border-4 border-white/50 ring-4 ring-[#17A2B8]/20"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                />
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-lg flex items-center justify-center"
                >
                  <GraduationCap className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center"
                >
                  <Stethoscope className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform group-hover:rotate-6 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#17A2B8] transition-colors">
                  Our Mission
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To <strong className="text-gray-900">empower individuals</strong> by providing easy access to 
                  comprehensive, verified information about educational institutions and healthcare providers. 
                  We strive to make informed decision-making simple, transparent, and accessible to everyone.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform group-hover:rotate-6 transition-transform">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#17A2B8] transition-colors">
                  Our Vision
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To become the <strong className="text-gray-900">most trusted platform</strong> for discovering 
                  education and healthcare services, where every user can find exactly what they need. We envision 
                  a future where quality education and healthcare are accessible to all, enabled by technology 
                  and transparency.
                </p>
              </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose <span className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] bg-clip-text text-transparent">Edu2Medu?</span>
            </h2>
            <p className="text-lg text-gray-600">Discover what makes us the perfect platform for your needs</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative overflow-hidden bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className={`relative mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="relative text-xl font-bold text-gray-900 mb-3 group-hover:text-[#17A2B8] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="relative text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
        </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our Core <span className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
          <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 hover:border-[#17A2B8]/30"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#17A2B8] to-[#1E2939] rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What We <span className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] bg-clip-text text-transparent">Offer</span>
            </h2>
            <p className="text-lg text-gray-600">Comprehensive services for both seekers and providers</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Seekers */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-xl border-2 border-blue-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">For Seekers</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Search and compare educational institutions",
                  "Find healthcare providers near you",
                  "Access detailed profiles and reviews",
                  "Get contact information instantly",
                  "Browse job openings in education & healthcare"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* For Providers */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-teal-50 to-emerald-50 p-8 rounded-2xl shadow-xl border-2 border-teal-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">For Providers</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Create and manage your profile",
                  "Showcase your services and facilities",
                  "Post job openings and find talent",
                  "Connect with potential students/patients",
                  "Update information in real-time"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-[#17A2B8] to-[#1E2939] p-8 md:p-12 rounded-3xl shadow-2xl text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust Edu2Medu for finding the best education and healthcare services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-[#17A2B8] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.location.href = '/register'}
                >
                  Create Account
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/50 hover:bg-white/30 transition-all"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Us
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
  );
};

export default About;
