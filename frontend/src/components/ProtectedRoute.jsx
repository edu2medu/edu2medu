import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, userType }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
      const storedUserType = sessionStorage.getItem("userType");

      let user = null;
      let admin = null;

      try {
        user = JSON.parse(sessionStorage.getItem("user") || "null");
        admin = JSON.parse(sessionStorage.getItem("admin") || "null");
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
      }

      // console.log("🔍 ProtectedRoute Debug:");
      // console.log("✅ isAuthenticated:", isAuthenticated);
      // console.log("✅ storedUserType:", storedUserType);
      // console.log("✅ user:", user);
      // console.log("✅ admin:", admin);

      if (
        !isAuthenticated ||
        (userType === "admin" && !admin) ||
        ((userType === "education" || userType === "healthcare") && !user) ||
        userType !== storedUserType
      ) {
        console.warn("⛔ Unauthorized! Redirecting to login...");
        navigate("/login", { replace: true });
      } else {
        console.log("✅ Access granted!");
      }

      setIsLoading(false);
    };

    // Small delay to ensure sessionStorage is fully set
    const timeout = setTimeout(checkAuth, 200);
    return () => clearTimeout(timeout);
  }, [navigate, userType]);

  if (isLoading) {
    return <div className="text-center text-gray-500">Checking authentication...</div>;
  }

  return children;
};

export default ProtectedRoute;
