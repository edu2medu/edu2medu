import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const setVal = (e) => {
        setEmail(e.target.value);
    };

    const sendLink = async (e) => {
        e.preventDefault();

        if (!email) {
            return toast.error("Email is required!", { position: "top-center" });
        }

        if (!email.includes("@")) {
            return toast.warning("Please include @ in your email!", { position: "top-center" });
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BASEURI}/user/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                const newToken = data.token;  // Assuming the API returns a reset token
            
                sessionStorage.removeItem("resetToken"); 
                sessionStorage.setItem("resetToken", newToken);  
                window.location.reload();  // Force refresh
            
                setEmail("");
                setMessage("Password reset link sent successfully to your email.");
                toast.success("Password reset link sent!", { position: "top-center" });
            }
             else {
                toast.error(data.message || "Invalid User", { position: "top-center" });
            }
        } catch (error) {
            toast.error("Server error, please try again later!", { position: "top-center" });
            console.error("Fetch error:", error);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url(/login.jpg)" }}
        >
            <div className="p-8 rounded-lg shadow-md w-full max-w-md bg-white">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Reset Your Password</h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Enter your email to receive a password reset link.
                    </p>
                </div>

                {message && (
                    <p className="text-center text-green-600 font-bold mb-4">
                        Password reset link sent successfully to your email.
                    </p>
                )}

                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={setVal}
                            name="email"
                            id="email"
                            placeholder="Enter your email address"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        onClick={sendLink}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Send Reset Link
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ResetPassword;
