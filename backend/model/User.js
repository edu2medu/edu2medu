const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  phone: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "education", "healthcare"],
  },
  category: {
    type: String,
    enum: [
      // Education Categories
      "Day School",
      "Boarding School",
      "Play School",
      "Private Tutor",
      "Coaching Centre",
      // Healthcare Categories
      "Hospital",
      "Private Clinic",
      "Medical Stores",
    ],
    required: function () {
      return this.userType !== "admin"; // Category required if not admin
    },
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  amenity: {
    type: String,
  },
  establishment:{
type:String
  },
  teachers:[
    {
      name: { type: String,  },
      qualification: { type: String,  }
    }
  ],
  contactInfo:{
type:String
  },
  status: {
    type: String,
    enum: ["blocked", "active", "unblock"],
    default: "blocked",
    required: true,
  },
  address: {
    type: String,
  },
  additionalInfo: {
    type: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  verifytoken: {
    type: String,
  },
  verifytokenExpires: {
    type: Date,
  },
  paymentDetails: {
    utrNumber: { type: String, default: '' }, // UTR number for payment reference
    paymentDate: { type: Date, default: null }, // Date of payment
    paymentStatus: { 
      type: String, 
      enum: ['paid', 'unpaid'], // Allowed values
      default: 'unpaid', // Default status
    },
  },
  
});

const User = mongoose.model("User", UserSchema);
module.exports = User;



//paymentAmount: { type: Number, default: 0 },






















// const mongoose = require("mongoose");


// const UserSchema = new mongoose.Schema({
//   name: {
//     require: true,
//     type: String,
//   },
//   email: {
//     require: true,
//     type: String,
//     unique: true,
//   },
//   password: {
//     type: String,
//     require: [true, "Password is require"],
//     minlength: [6, "Password must be at least 6 characters"],
//   },
  

//   phone: {
//     require: true,
//     type: String,
//   },
//   userType: {
//     required: true,
//     type: String,
//     enum: ["admin", "education", "healthcare"],
//   },
//   category: {
//     type: String,
//     enum: [
//       // Education Categories
//       "Day School",
//       "Boarding School",
//       "Play School",
//       "Private Tutor",
//       "Coaching Centre",
//       // Healthcare Categories
//       "Hospital",
//       "Private Clinic",
//       "Medical Stores",
//     ],
//     required: function () {
//       return this.userType === "education" || this.userType === "healthcare";
//     },
//   },
//   role: {
//     type: String,
//     enum: ["admin", "user"], // Explicitly define 'admin' and 'user'
//     default: "user",
//   },
//   image: { type: String },

//   description: {
//     type: String,
//   },
//   status: {
//     require: true,
//     type: String,
//     enum: ["block", "active", "unblock"],
//     default: "active",
//   },
//   address: {
//     type: String,
//   },
//   additionalInfo: {
//     type: String,
//   },
//   tokens: [
//     {
//         token: {
//             type: String,
//             required: true,
//         }
//     }
// ],
// verifytoken:{
//     type: String,
// }
  
// });

// const User = mongoose.model("User", UserSchema);
// module.exports = User;
