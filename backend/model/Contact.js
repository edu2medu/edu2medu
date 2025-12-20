const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true }
);

const Contact = mongoose.model('contact', ContactSchema);
module.exports = Contact;
