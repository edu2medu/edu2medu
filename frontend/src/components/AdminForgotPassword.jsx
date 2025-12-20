import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const AdminForgotPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Log the id and token when the component mounts
  useEffect(() => {
    console.log("🆔 ID from URL:", id);
    console.log("🔑 Token from URL:", token);
  }, [id, token]);

  // Validate the token and user ID
  const validateToken = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURI}/admin/admin-forgotpassword/${id}/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        setIsValidToken(true); // Token is valid
      } else {
        toast.error("Invalid or expired token!", { position: "top-center" });
        navigate("/"); // Redirect to home or login page
      }
    } catch (error) {
      console.error("Error validating token:", error);
      toast.error("An error occurred while validating the token.", { position: "top-center" });
      navigate("/"); // Redirect to home or login page
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle password reset submission
  const handlePasswordReset = async (e) => {
    e.preventDefault();
  
    if (!password) {
      return toast.error("Password is required!", { position: "top-center" });
    }
  
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURI}/admin/admin-updatepassword/${id}/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),  // ✅ Ensure correct JSON format
      });
  
      const data = await res.json();
  
      if (res.ok) {
        toast.success("Password reset successful!", { position: "top-center" });
        navigate("/login");
      } else {
        toast.error(data.message || "Error resetting password", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Server error, try again!", { position: "top-center" });
    }
  };
  
  // Validate the token when the component mounts
  useEffect(() => {
    validateToken();
  }, [id, token]);

  // Show loading spinner while validating the token
  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        Loading... &nbsp;
        <CircularProgress />
      </Box>
    );
  }

  // Show the password reset form if the token is valid
  return (
    <section className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/login.jpg)" }}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Enter Your New Password</h1>
        </div>
        <form onSubmit={handlePasswordReset}>
          {message && <p className="text-green-600 font-bold text-center mb-4">{message}</p>}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium">New Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              name="password"
              id="password"
              placeholder="Enter your new password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
        <p className="text-center mt-4">
          <NavLink to="/" className="text-blue-500 hover:underline">Home</NavLink>
        </p>
        <ToastContainer />
      </div>
    </section>
  );
};

export default AdminForgotPassword;