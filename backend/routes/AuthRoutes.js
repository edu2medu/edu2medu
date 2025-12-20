const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const AuthRouter = express.Router();

// ✅ Middleware for JWT Authentication
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();
  console.log("Received Token:", token);
  console.log("JWT Secret:", process.env.JWT_SECRET);

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired, please login again" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};

// ✅ Session Check Route
AuthRouter.get("/check-session", (req, res) => {
  console.log("Session Data:", req.session); // Debugging

  if (req.session && req.session.user) {
    return res.json({ success: true, user: req.session.user });
  } else {
    return res.json({ success: false, message: "No active session" });
  }
});



module.exports = authMiddleware;
