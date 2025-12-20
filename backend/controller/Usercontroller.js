const bcrypt = require("bcrypt");
const Job = require("../model/Jobs");

const User = require("../model/User");
const Category = require("../model/Category");
const ContacAt = require("../model/Contact");
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
    req.session.user = {
      id: user.userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
    };

    // Return success response with token and user data
    res.json({
      success: true,
      message: "Login successful",
      token, // Include the JWT token in the response
      user: req.session.user, // Return session data (optional)
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
    // ✅ Fetch users where userType is 'education'
    const users = await User.find({ userType: "healthcare" });

    // ✅ Base URL setup dynamically
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // ✅ Corrected mapping of user data to include full image URL
    const updatedUsers = users.map((item) => ({
      ...item._doc,
      image: item.image ? `${baseUrl}${item.image}` : "/default-image.png",
    }));

    // ✅ Send the updated users list
    res.status(200).json({ success: true, users: updatedUsers });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // ✅ Fetch users where userType is 'education'
    const users = await User.find({ userType: "education" });

    // ✅ Base URL setup dynamically
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // ✅ Corrected mapping of user data to include full image URL
    const updatedUsers = users.map((item) => ({
      ...item._doc,
      // In the backend, ensure the default image URL is also complete
image: item.image ? `${baseUrl}${item.image}` : `${baseUrl}/default-image.png`,
    }));

    // ✅ Send the updated users list
    res.status(200).json({ success: true, users: updatedUsers });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// Handle new contact form submission
exports.requestCall = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, phone });
    await newContact.save();

    res.status(201).json({
      message:
        "Thank you for reaching out! Our team will get back to you soon.",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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

      let updateFields = { ...req.body };

      // Handle file upload
      if (req.file) {
        updateFields.image = `/uploads/${req.file.filename}`;
      }

      // Remove empty fields
      Object.keys(updateFields).forEach((key) => {
        if (!updateFields[key]) {
          delete updateFields[key];
        }
      });

      console.log("Fields to update:", updateFields);

      // Ensure `teachers` is correctly parsed if received as a string
      if (updateFields.teachers && typeof updateFields.teachers === "string") {
        try {
          updateFields.teachers = JSON.parse(updateFields.teachers);
        } catch (parseError) {
          return res.status(400).json({ success: false, message: "Invalid teachers format" });
        }
      }

      // Find and update the user by email
      const updatedUser = await User.findOneAndUpdate(
        { email }, 
        { $set: updateFields }, 
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Update session with new user data
      req.session.user = {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        userType: updatedUser.userType,
      };

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
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
    !salary||
    !jobDescription ||
    !jobRequirements ||
    !applicationDeadline||
    ! howToApply
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
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
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
