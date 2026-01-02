const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'edu2medu', // Optional: folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // Optional: resize images
  },
});

module.exports = { cloudinary, storage };

