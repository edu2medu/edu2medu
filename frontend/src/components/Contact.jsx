import { useState } from "react";
import axios from "axios";
import { User, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
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
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;

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

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden py-20 px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Header Section with Gradient */}
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
                initial={{ opacity: 0, x: -20 }}
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
                initial={{ opacity: 0, x: -20 }}
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
        </motion.div>
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
};

export default Contact;
