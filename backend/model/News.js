const mongoose = require("mongoose");

const Newschema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    moreContent:{type:String,required:true},
    image: { type: String,required:true }, // Can be a URL or base64
  
    
  }
  
);

const News = mongoose.model('news', Newschema);
module.exports = News;
