import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUsertype] = useState("education");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterNavigate = () => {
    navigate("/register");
  };

  const handleForgotPasswordNavigate = () => {
    setEmailOrPhone("");
    setPassword("");

    // Redirect based on user type
    if (userType === "admin") {
      navigate("/admin-resetpassword");
    } else {
      navigate("/reset-password");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const endpoint =
        userType === "admin"
          ? `${import.meta.env.VITE_BASEURI}/admin/adminlogin`
          : `${import.meta.env.VITE_BASEURI}/user/login`;
  
      const { data } = await axios.post(
        endpoint,
        { emailOrPhone, password, userType },
        { withCredentials: true }
      );
  
      if (data.success) {
        const storageKey = userType === "admin" ? "admin" : "user";
        sessionStorage.setItem(storageKey, JSON.stringify(data[storageKey]));
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userType", userType);
  
        let redirectPath = "/";
        if (userType === "education") {
          redirectPath = "/user-dashboard";
        } else if (userType === "healthcare") {
          redirectPath = "/healthcare-dashboard";
        } else if (userType === "admin") {
          redirectPath = "/admin-dashboard";
        }
  
        // console.log("✅ Redirecting to:", redirectPath);
        // console.log("✅ Session Storage Updated:", {
        //   user: sessionStorage.getItem("user"),
        //   admin: sessionStorage.getItem("admin"),
        //   isAuthenticated: sessionStorage.getItem("isAuthenticated"),
        //   userType: sessionStorage.getItem("userType"),
        // });
  
        // Using `window.location.href` for better reliability
        window.location.href = redirectPath;
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
      // Clear the input fields
      setEmailOrPhone("");
      setPassword("");
    }
  };
  // 🎨 Dynamic Background Image
  const backgroundImage =
    userType === "education"
      ? "url(/logine.jpg)"
      : userType === "healthcare"
      ? "url(/logine.jpg)"
      : "url(/logine.jpg)"; // Default image

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage }}
    >
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-opacity-50 p-8 sm:p-10 rounded-lg shadow-2xl z-10 w-full max-w-md sm:max-w-lg md:max-w-xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, duration: 0.8 }}
      >
        <h2
          className={`text-xl font-serif mb-4 text-center ${
            userType === "education"
              ? "text-[#E76F51]"
              : userType === "healthcare"
              ? "text-[#17A2B8]"
              : "text-gray-700"
          }`}
        >
          Login
        </h2>

        {/* User Type Selection */}
        <div className="mb-4 flex justify-center">
          {["education", "healthcare", "admin"].map((type) => (
            <motion.button
              key={type}
              onClick={() => setUsertype(type)}
              className={`px-4 py-2 text-xs font-semibold transition ${
                userType === type
                  ? type === "education"
                    ? "bg-[#E76F51] text-white"
                    : type === "healthcare"
                    ? "bg-[#17A2B8] text-white"
                    : "bg-gray-700 text-white"
                  : "bg-gray-300 text-black"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4 mt-2">
            <label className="block py-2 text-gray-700 text-xs font-bold">
              Email or Phone
            </label>
            <input
              type="text"
              placeholder="Enter your email or phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4 mt-2">
            <label className="block py-2 text-gray-700 text-xs font-bold">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>

          <motion.button
            type="submit"
            className={`w-full mt-6 mx-auto px-20 py-3 text-white text-xs font-serif rounded-md ${
              userType === "education"
                ? "bg-[#E76F51] hover:bg-[#9f6b5e]"
                : userType === "healthcare"
                ? "bg-[#17A2B8] hover:bg-[#70aeb8]"
                : "bg-gray-700 hover:bg-gray-900"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="mt-3 text-center">
          <p className="text-xs">
            <motion.button
              onClick={handleForgotPasswordNavigate}
              className={`${
                userType === "education"
                  ? "text-[#E76F51]"
                  : userType === "healthcare"
                  ? "text-[#17A2B8]"
                  : "text-gray-700"
              } font-medium hover:underline`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Forgot Password?
            </motion.button>
          </p>
        </div>

        {userType !== "admin" && (
          <div className="mt-3 text-center">
            <p className="text-xs font-medium text-gray-600">
              Don't have an account?{" "}
              <motion.button
                onClick={handleRegisterNavigate}
                className="text-[#E76F51] font-medium hover:underline"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Register Now
              </motion.button>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;

