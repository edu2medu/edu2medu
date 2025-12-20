const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  ctitle: { type: String, required: true },
  categoryType: { type: String, required: true },
  userType:{ type: String , required:true},
  image: { type: String },
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;