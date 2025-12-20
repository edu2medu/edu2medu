
const Admin=require('../model/Admin');
const User = require('../model/User');
const multer = require('multer');
const News = require("../model/News");
const fs = require('fs');
const Category=require('../model/Category')
const Contact=require('../model/Contact')
const path=require("path")
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");









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




exports.adminLogin = async (req, res) => {
  try {
    const { emailOrPhone, password, userType } = req.body;

    // Log the request body for debugging
    // console.log("Request Body:", req.body);

    // Find admin by email or phone and userType
    const admin = await Admin.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      userType,
    });

    // Log the admin found (or not found)
    console.log("Admin Found:", admin);

    if (!admin) {
      return res.status(400).json({ success: false, message: "Admin not found" });
    }

    // Compare password directly (without bcrypt)
    if (password !== admin.password) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token for admin
    const token = jwt.sign(
      {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        userType: admin.userType,
      },
      process.env.SECRET_KEY, // Use JWT secret from environment variables
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Store admin session (optional, if you still want to use sessions)
    req.session.userType = "admin";
    req.session.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      userType: admin.userType,
    };

    // Ensure session is saved before sending response
    req.session.save((err) => {
      if (err) {
        console.error("Session Save Error:", err);
        return res.status(500).json({ success: false, message: "Session error" });
      }
      res.json({
        success: true,
        message: "Admin login successful",
        token, // Include the JWT token in the response
        admin: req.session.admin, // Return session data (optional)
      });
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


  




  exports.getEducationUsers = async (req, res) => {
    try {
      // Fetch only users where userType is 'Education'
      const users = await User.find({ userType: "education" }, "-password");
  
      res.status(200).json({ success: true, users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

  exports.getHealthcareUsers = async (req, res) => {
    try {
      // Fetch only users where userType is 'Education'
      const users = await User.find({ userType: "healthcare" }, "-password");
  
      res.status(200).json({ success: true, users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };


  exports.blockEducationUser= async (req, res) => {
    const { userId } = req.body;
  
    try {
      const users = await User.findById(userId);
  
      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (users.status === 'blocked') {
        return res.status(400).json({ message: 'User is already block' });
      }
  
      users.status = 'blocked';
      await users.save();
  
      return res.status(200).json({ message: 'User block successfully!' });
    } catch (error) {
      console.error('Error activating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  


  exports.blockHealthcareUser= async (req, res) => {
    const { userId } = req.body;
  
    try {
      const users = await User.findById(userId);
  
      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (users.status === 'blocked') {
        return res.status(400).json({ message: 'User is already block' });
      }
  
      users.status = 'blocked';
      await users.save();
  
      return res.status(200).json({ message: 'User block successfully!' });
    } catch (error) {
      console.error('Error activating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  



  exports.unblockEducationUser= async (req, res) => {
    const { userId } = req.body;
  
    try {
      const users = await User.findById(userId);
  
      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (users.status === 'active') {
        return res.status(400).json({ message: 'User is already active' });
      }
  
      users.status = 'active';
      await users.save();
  
      return res.status(200).json({ message: 'User active successfully!' });
    } catch (error) {
      console.error('Error activating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  


  exports.unblockHealthcareUser= async (req, res) => {
    const { userId } = req.body;
  
    try {
      const users = await User.findById(userId);
  
      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (users.status === 'active') {
        return res.status(400).json({ message: 'User is already active' });
      }
  
      users.status = 'active';
      await users.save();
  
      return res.status(200).json({ message: 'User block successfully!' });
    } catch (error) {
      console.error('Error activating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };





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
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
      } else {
          cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."), false);
      }
  }
});




exports.addCategory = (req, res) => {
    upload.single("image")(req, res, async (err) => {
        if (err) {
            console.error("File upload error:", err);
            return res.status(500).json({ 
                success: false, 
                message: "File upload failed" 
            });
        }

        const { name, ctitle, categoryType,userType } = req.body;
        const image = req.file ? `uploads/${req.file.filename}` : null;  

        if (!name || !ctitle || !categoryType || !image ||!userType) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        try {
            const newCategory = new Category({
                name,
                ctitle,
                categoryType,
                image,
                userType
            });

            await newCategory.save();
            res.status(201).json({ 
                success: true, 
                message: "Category added successfully", 
                category: newCategory 
            });
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).json({ 
                success: false, 
                message: "Failed to add category" 
            });
        }
    });
};


  
  
  

  

// Create News
exports.createNews = (req, res) => {
  upload.single("image")(req, res, async (err) => {
      if (err) {
          console.error("File upload error:", err);
          return res.status(500).json({
              success: false,
              message: "File upload failed"
          });
      }

      const { title, content, moreContent } = req.body;
      const image = req.file ? `uploads/${req.file.filename}` : null;

      // ✅ Correct the validation check
      if (!title || !content || !moreContent || !image) {
          return res.status(400).json({
              success: false,
              message: "All fields including the image are required"
          });
      }

      try {
          const news = new News({
              title,
              content,
              moreContent,
              image, // ✅ Save only the image path, not `req.body.newsImage`
          });

          await news.save();
          res.status(201).json({
              success: true,
              message: "News added successfully",
              news
          });
      } catch (error) {
          console.error("Database error:", error);
          res.status(500).json({
              success: false,
              message: "Failed to add news"
          });
      }
  });
};








exports.getAllNews = async (req, res) => {
  try {
      const news = await News.find().sort({ createdAt: -1 });

      if (!news.length) {
          return res.status(404).json({
              success: false,
              message: "No news articles found"
          });
      }

      // ✅ Base URL add karne ke liye
      const baseUrl = `${req.protocol}://${req.get("host")}/`;
      const updatedNews = news.map(item => ({
          ...item._doc,
          image: item.image ? `${baseUrl}${item.image}` : "/default-image.png"
      }));

      res.status(200).json({
          success: true,
          message: "News articles retrieved successfully",
          news: updatedNews
      });
  } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
          success: false,
          message: "Failed to retrieve news"
      });
  }
};



// Get Single News
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
};

// Delete News
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news", error });
  }
};


// Fetch all contact submissions (for admin)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};



exports.sendPasswordLink = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Please enter your email" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate a new token
    const token = jwt.sign(
      { _id: admin._id, random: Math.random().toString() }, // Adding randomness
      process.env.SECRET_KEY,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // Save the new token and expiry time to the database
    admin.verifytoken = token;
    admin.verifytokenExpires = Date.now() + 3600000; // 1-hour expiry
    await admin.save();

    console.log("✅ Token updated in DB:", admin.verifytoken);

    // Send the reset link
    const frontendUrl = process.env.FRONTEND_URL || "https://edu2medu.com";
    const resetLink = `${frontendUrl}/admin-resetpassword/${admin._id}/${token}`;
    
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


exports.adminforgotpassword = async (req, res) => {
  const { id, token } = req.params;

  try {
    console.log("🆔 ID from request:", id);
    console.log("🔑 Token from request:", token);

    // Find admin and check if token is valid
    const admin = await Admin.findOne({
      _id: id,
      verifytoken: token,
      verifytokenExpires: { $gt: Date.now() }, // Token must be valid
    });

    console.log("🛠 Admin found in DB:", admin);

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found or token expired" });
    }

    // Verify JWT token
    try {
      jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      console.error("❌ JWT Verification Error:", err.message);

      // If token is expired, prompt the user to request a new link
      return res.status(401).json({
        success: false,
        message: "Token expired. Please request a new password reset link.",
      });
    }

    // If token is valid, allow the user to reset their password
    res.status(200).json({ success: true, message: "Token verified successfully" });
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
      return res.status(400).json({ success: false, message: "New password is required" });
    }

    const admin = await Admin.findOne({
      _id: id,
      verifytoken: token,
      verifytokenExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.verifytoken = null;
    admin.verifytokenExpires = null;
    await admin.save();

    console.log("✅ Password reset successful!");
    res.status(200).json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    console.error("🚨 Error resetting password:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};











