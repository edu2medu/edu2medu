const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  phone: {
    required: true,
    type: String,
    unique:true
  },
  userType: {
    required: true,
    type: String,
    enum: ['admin', 'education', 'healthcare'],
  },
 
  role: {
    type: String,
    enum: ['admin', 'user'],  
    default: 'admin',
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
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
