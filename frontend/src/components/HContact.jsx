import { Mail, Phone, MapPin, User, Send } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
const HContact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return; // Sirf numbers allow honge
      if (value.length > 10) return; // 10 digits se zyada allow nahi karega

      if (value.length < 10) {
        setPhoneError("Phone number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (phoneError || formData.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASEURI}/user/requestcall`, formData);
      setSuccess("Our team will call you shortly!"); 
      setFormData({ name: "", phone: "" });

      // ✅ 3 seconds ke baad success message remove ho jayega
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.error || "Something went wrong");
    }
    
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Split Layout Container */}
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Side - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                Contact <span className="text-[#17A2B8]">Information</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Reach out to us through any of these channels. We're here to help!
              </p>
            </div>

            {/* Contact Cards - Vertical Stack */}
            <div className="space-y-6">
              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#17A2B8] to-[#1E2939] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Email Address</h3>
                    <p className="text-sm text-gray-500 mb-3">Reach us anytime</p>
                    <div className="space-y-1">
                      <a href="mailto:info@edu2medu.com" className="block text-gray-700 hover:text-[#17A2B8] transition-colors">
                        info@edu2medu.com
                      </a>
                      <a href="mailto:support@edu2medu.com" className="block text-gray-700 hover:text-[#17A2B8] transition-colors">
                        support@edu2medu.com
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Phone Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#17A2B8] to-[#1E2939] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Phone Number</h3>
                    <p className="text-sm text-gray-500 mb-3">Give us a call</p>
                    <a href="tel:+919274333156" className="block text-gray-700 hover:text-[#17A2B8] transition-colors text-lg font-semibold">
                      +91-9274333156
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Office Address Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#17A2B8] to-[#1E2939] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Office Address</h3>
                    <p className="text-sm text-gray-500 mb-3">Visit us at</p>
                    <div className="space-y-1 text-gray-700">
                      <p>Sejal complex, Palanpur patiya surat</p>
                      <p>395009, India</p>
                    </div>
                    <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[#17A2B8] hover:underline font-medium">
                      View on Map →
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#17A2B8] via-[#1E2939] to-[#17A2B8] p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold text-white relative z-10 mb-2"
                >
                  Get In Touch
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-blue-100 text-lg relative z-10"
                >
                  We'd love to hear from you. Send us a message!
                </motion.p>
              </div>

              {/* Form Section */}
              <div className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                      <User className="w-4 h-4 text-[#17A2B8]" />
                      Your Name
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#17A2B8] focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                        placeholder="Enter your full name"
                        required
                      />
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </motion.div>

                  {/* Phone Input */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                      <Phone className="w-4 h-4 text-[#17A2B8]" />
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        className="w-full px-4 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#17A2B8] focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-400"
                        placeholder="Enter 10-digit phone number"
                        required
                      />
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {phoneError && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm flex items-center gap-1 mt-1"
                      >
                        {phoneError}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Success/Error Messages */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-green-700 text-center font-medium"
                    >
                      ✓ {success}
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-center font-medium"
                    >
                      ✗ {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    type="submit"
                    disabled={phoneError}
                    className="w-full bg-gradient-to-r from-[#17A2B8] to-[#1E2939] text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Request Call Back
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
export default HContact;
