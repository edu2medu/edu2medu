const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  ctitle: { type: String, required: true },
  categoryType: { type: String, required: true },
  userType:{ type: String , required:true},
  image: { type: String },
}, { timestamps: true });

// Add indexes for faster queries
CategorySchema.index({ userType: 1 }); // For filtering by userType

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;