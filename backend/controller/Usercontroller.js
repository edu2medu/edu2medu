const bcrypt = require("bcrypt");
const Job = require("../model/Jobs");

const User = require("../model/User");
const Category = require("../model/Category");
const Contact = require("../model/Contact");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Define the transporter directly in the controller
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your Gmail email address
    pass: process.env.PASSWORD, // Your Gmail password or app-specific password
  },
});

//Verify email connection
transporter.verify((error, success) => {
  if (error) {
    console.error("🚨 Nodemailer connection error:", error);
  } else {
    console.log("✅ Nodemailer is ready to send emails");
  }
});
// Register User Controller
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, userType, category, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !userType) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Validate category based on userType
    const validCategories = {
      education: [
        "Day School",
        "Boarding School",
        "Play School",
        "Private Tutor",
        "Coaching Centre",
      ],
      healthcare: ["Hospital", "Private Clinic", "Medical Stores"],
    };

    if (
      (userType === "education" || userType === "healthcare") &&
      !validCategories[userType].includes(category)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid category for the selected userType" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      userType,
      category:
        userType === "education" || userType === "healthcare"
          ? category
          : undefined,
      role: role || "user",
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User Controller

exports.loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password, userType } = req.body; // Identifier can be email or phone

    // Find user by email or phone number
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      userType,
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email/phone or password" });
    }

    // ✅ Check if account is blocked (only "blocked" status prevents login)
    // Note: "active" and "unblock" statuses allow login
    if (user.status === "blocked") {
      return res
        .status(403) // 403 Forbidden status code
        .json({ success: false, message: "Your account is blocked. Please contact support." });
    }


    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email/phone or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
      },
      process.env.SECRET_KEY, // Use JWT secret from environment variables
      { expiresIn: "1d" } // Token expires in 1 hour
    );

    // Store user session (optional, if you still want to use sessions)
    // Construct safe user object with all profile fields
    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      status: user.status,
      image: user.image,
      address: user.address,
      description: user.description,
      contactInfo: user.contactInfo,
      amenity: user.amenity,
      establishment: user.establishment,
      additionalInfo: user.additionalInfo,
      teachers: user.teachers,
      category: user.category
    };

    // Store user session
    req.session.user = userPayload;

    // Return success response with token and user data
    res.json({
      success: true,
      message: "Login successful",
      token, // Include the JWT token in the response
      user: userPayload,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getEducationUsers = async (req, res) => {
  try {
    const educationUsers = await User.find({ userType: "education" });

    if (!educationUsers.length) {
      return res
        .status(404)
        .json({ success: false, message: "No education users found" });
    }

    // ✅ Base URL for images
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    // ✅ Update image URLs for each user
    const updatedUsers = educationUsers.map((user) => ({
      ...user._doc,
      image: user.image ? `${baseUrl}${user.image}` : "/default-image.png",
    }));

    res.status(200).json({ success: true, users: updatedUsers });
  } catch (error) {
    console.error("Error fetching education users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getHealthcareUsers = async (req, res) => {
  try {
    // ✅ Optimized query: Only select needed fields and filter active users
    const users = await User.find(
      { userType: "healthcare", status: "active" },
      "name email phone category address description image contactInfo amenity establishment additionalInfo teachers status" // Select only needed fields
    )
      .lean() // Use lean() for faster queries
      .limit(500); // Limit results for faster response

    // ✅ Base URL setup dynamically
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // ✅ Optimized mapping
    const updatedUsers = users.map((item) => ({
      ...item,
      image: item.image ? `${baseUrl}${item.image}` : `${baseUrl}/default-image.png`,
    }));

    // ✅ Send response immediately
    res.status(200).json({ success: true, users: updatedUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    // ✅ Optimized query: Select only needed fields and use lean()
    const categories = await Category.find(
      {},
      "name ctitle categoryType userType image" // Select only needed fields
    )
      .lean() // Faster queries
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(50); // Limit for faster response

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // ✅ Optimized query: Only select needed fields and filter active users
    const users = await User.find(
      { userType: "education", status: "active" },
      "name email phone category address description image contactInfo amenity establishment additionalInfo teachers status" // Select only needed fields
    )
      .lean() // Use lean() for faster queries (returns plain JS objects)
      .limit(500); // Limit results for faster response

    // ✅ Base URL setup dynamically
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // ✅ Optimized mapping - only process what's needed
    const updatedUsers = users.map((item) => ({
      ...item,
      image: item.image ? `${baseUrl}${item.image}` : `${baseUrl}/default-image.png`,
    }));

    // ✅ Send response immediately
    res.status(200).json({ success: true, users: updatedUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// Handle new contact form submission
exports.requestCall = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate phone number format (should be 10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
    }

    // Create and save contact
    const newContact = new Contact({
      name: name.trim(),
      phone: phone.trim()
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! Our team will get back to you soon.",
    });
  } catch (error) {
    console.error("Error in requestCall:", error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: "Validation error",
        details: error.message
      });
    }

    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(500).json({
        error: "Database error. Please try again later."
      });
    }

    res.status(500).json({
      error: "Internal Server Error",
      message: process.env.NODE_ENV === 'development' ? error.message : "Something went wrong. Please try again."
    });
  }
};

//update profile

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist

    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/avif",
      "image/jpg"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF,AVIF, and WebP are allowed."
        ),
        false
      );
    }
  },
});
exports.updateProfile = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(500).json({ success: false, message: "File upload failed" });
    }

    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
      }

      // Verify user exists
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Build updateFields object - exclude email and handle all fields properly
      let updateFields = {};

      // List of allowed fields to update
      const allowedFields = [
        'name', 'phone', 'address', 'description', 'contactInfo',
        'amenity', 'establishment', 'additionalInfo', 'teachers', 'category'
      ];

      // Process each allowed field
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          // Allow empty strings to clear fields
          updateFields[field] = req.body[field];
        }
      });

      // Handle file upload
      if (req.file) {
        updateFields.image = `/uploads/${req.file.filename}`;
      }

      // Ensure `teachers` is correctly parsed if received as a string
      if (updateFields.teachers && typeof updateFields.teachers === "string") {
        try {
          updateFields.teachers = JSON.parse(updateFields.teachers);
        } catch (parseError) {
          console.error("Error parsing teachers:", parseError);
          return res.status(400).json({ success: false, message: "Invalid teachers format" });
        }
      }

      // Remove undefined values but keep empty strings and null
      Object.keys(updateFields).forEach((key) => {
        if (updateFields[key] === undefined) {
          delete updateFields[key];
        }
      });

      console.log("Fields to update:", updateFields);
      console.log("Image file received:", req.file ? req.file.filename : "No file");
      console.log("Image path to save:", updateFields.image || "No image");
      console.log("Updating user with email:", email);

      // Find and update the user by email
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: updateFields },
        { new: true, runValidators: true }
      ).select('-password -tokens -verifytoken -verifytokenExpires'); // Exclude sensitive fields

      if (!updatedUser) {
        console.error("User not found after update attempt");
        return res.status(404).json({ success: false, message: "User not found" });
      }

      console.log("Profile updated successfully for:", updatedUser.email);
      console.log("Updated user image path:", updatedUser.image);

      // Update session with new user data
      const userPayload = {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        userType: updatedUser.userType,
        image: updatedUser.image,
        address: updatedUser.address,
        description: updatedUser.description,
        contactInfo: updatedUser.contactInfo,
        amenity: updatedUser.amenity,
        establishment: updatedUser.establishment,
        additionalInfo: updatedUser.additionalInfo,
        teachers: updatedUser.teachers,
        status: updatedUser.status,
        category: updatedUser.category,
      };

      // Store user session
      req.session.user = userPayload;

      // Store user session


      res.json({
        success: true,
        message: "Profile updated successfully",
        user: userPayload,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
};

//FORGOT PASSWORDS

exports.sendPasswordLink = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter your email" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate a new token
    const token = jwt.sign(
      { _id: user._id, random: Math.random().toString() }, // Adding randomness
      process.env.SECRET_KEY,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // Save the new token and expiry time to the database
    const updatedUser = await User.findByIdAndUpdate(
      user._id, // ✅ Correct user._id
      {
        verifytoken: token,
        verifytokenExpires: Date.now() + 3600000, // 1-hour expiry
      },
      { new: true }
    );

    console.log("✅ Token updated in DB:", updatedUser.verifytoken);

    // Send the reset link
    // Send the reset link
    const frontendUrl = process.env.FRONTEND_URL || "https://edu2medu.com";
    const resetLink = `${frontendUrl}/forgotpassword/${user._id}/${token}`;


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Click the link below to reset your password:
 
 ${resetLink}
 
 This link is valid for 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", email);

    res.status(200).json({
      success: true,
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    console.error("🚨 Error sending password reset email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.forgotpassword = async (req, res) => {
  const { id, token } = req.params;

  try {
    console.log("🆔 ID from request:", id);
    console.log("🔑 Token from request:", token);

    // Find user and check if token is valid
    const validUser = await User.findOne({
      _id: id,
      verifytoken: token,
      verifytokenExpires: { $gt: Date.now() }, // Token must be valid
    });

    console.log("🛠 User found in DB:", validUser);

    if (!validUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found or token expired" });
    }

    // Verify JWT token
    try {
      jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      console.error("❌ JWT Verification Error:", err.message);

      // Generate a new token and send back a response to frontend
      const newToken = jwt.sign(
        { _id: validUser._id, random: Math.random().toString() },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );

      validUser.verifytoken = newToken;
      validUser.verifytokenExpires = Date.now() + 3600000; // 1 hour expiry
      await validUser.save();

      return res.status(401).json({
        success: false,
        message: "Token expired. A new link has been sent to your email.",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Token verified successfully" });
  } catch (error) {
    console.error("🚨 Error verifying token:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  // Debugging Logs
  console.log("🆔 User ID:", id);
  console.log("🔑 Token:", token);
  console.log("📩 Received Request Body:", req.body); // ✅ Check if newPassword is received
  console.log("📝 New Password:", newPassword); // ✅ Ensure it's not undefined

  try {
    if (!newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "New password is required" });
    }

    const user = await User.findOne({
      _id: id,
      verifytoken: token,
      verifytokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.verifytoken = null;
    user.verifytokenExpires = null;
    await user.save();

    console.log("✅ Password reset successful!");
    res
      .status(200)
      .json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    console.error("🚨 Error resetting password:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Search function for education

exports.searchEducation = async (req, res) => {
  const { query } = req.query;
  const baseUrl = req.protocol + '://' + req.get('host'); // Construct base URL from request

  try {
    // Search for education-related users
    const results = await User.find({
      userType: "education",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
      ],
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "No education results found" });
    }

    // Add full image URL to each user
    // Corrected version in both searchEducation and searchHealthcare
    const usersWithImageUrls = results.map(user => ({
      ...user._doc,
      image: user.image ? `${baseUrl}${user.image}` : `${baseUrl}/default-image.png`,
    }));

    res.status(200).json(usersWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.searchHealthcare = async (req, res) => {
  const { query } = req.query;
  const baseUrl = req.protocol + '://' + req.get('host'); // Construct base URL from request

  try {
    // Search for healthcare-related users
    const results = await User.find({
      userType: "healthcare",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
      ],
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "No healthcare results found" });
    }

    // Add full image URL to each user
    // Corrected version in both searchEducation and searchHealthcare
    const usersWithImageUrls = results.map(user => ({
      ...user._doc,
      image: user.image ? `${baseUrl}${user.image}` : `${baseUrl}/default-image.png`,
    }));

    res.status(200).json(usersWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};













//JOBOPENINGS


// Adjust the path to your Job model

exports.createJob = async (req, res) => {
  console.log("🔍 Incoming request headers:", req.headers); // Log headers
  console.log("🔍 Incoming request body:", req.body); // Log data received

  const {
    jobTitle,
    companyName,
    location,
    jobType,
    salary,
    jobDescription,
    jobRequirements,
    applicationDeadline,
    howToApply,
  } = req.body;

  if (
    !jobTitle ||
    !companyName ||
    !location ||
    !jobType ||
    !salary ||
    !jobDescription ||
    !jobRequirements ||
    !applicationDeadline ||
    !howToApply
  ) {
    console.log("❌ Missing fields in request");
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }

};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    // ✅ Optimized query: Use lean() and limit results if needed
    const jobs = await Job.find()
      .select("jobTitle companyName location jobType salary jobDescription jobRequirements applicationDeadline howToApply createdAt")
      .lean()
      .sort({ createdAt: -1 })
      .limit(100); // Limit to 100 most recent jobs

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};

// Delete a job by ID
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      job: deletedJob
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting job",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const jobs = await Job.findById(req.params.id);
    if (!jobs) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
};








//payement


// paymentController.js


exports.storePayment = async (req, res) => {
  const { email, utrNumber } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.paymentDetails = {
      utrNumber,
      paymentStatus: 'paid',
      paymentDate: new Date(),
    };

    await user.save();

    res.status(200).json({ message: 'Payment details stored successfully', user });
  } catch (error) {
    console.error('Error storing payment details:', error);
    res.status(500).json({ message: 'Failed to store payment details' });
  }
};




//getpayment 
exports.getPaymentByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Assuming you pass the email as a parameter

    // Find the user by email and select only the required fields
    const user = await User.findOne({ email }).select('name email paymentDetails');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if paymentDetails exists
    if (!user.paymentDetails) {
      return res.status(404).json({ success: false, message: 'Payment details not found for this user' });
    }

    // Return the user's name, email, and paymentDetails
    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        paymentDetails: user.paymentDetails,
      },
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};



//getpayment pagination

// exports.getAllPayments = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10

//     // Find users with pagination and select only the required fields
//     const users = await User.find()
//       .select('name email paymentDetails')
//       .limit(limit * 1) // Convert limit to a number
//       .skip((page - 1) * limit); // Calculate the number of documents to skip

//     if (users.length === 0) {
//       return res.status(404).json({ success: false, message: 'No users found' });
//     }

//     // Extract name, email, and paymentDetails from each user
//     const paymentDetails = users.map(user => ({
//       name: user.name,
//       email: user.email,
//       paymentDetails: user.paymentDetails,
//     }));

//     res.status(200).json({ success: true, data: paymentDetails });
//   } catch (error) {
//     console.error('Error fetching all payment details:', error);
//     res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };
