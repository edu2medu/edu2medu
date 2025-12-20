

const jwt = require('jsonwebtoken');    // Import the jsonwebtoken library to handle JWT authentication
const dotenv = require('dotenv');    // Import dotenv to load environment variables from a .env file
dotenv.config();     // Load environment variables into process.env

// Middleware function to authenticate users based on JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer', '').trim();
  // Extract the Authorization header and remove the 'Bearer ' prefix if it exists
  console.log(token);
  console.log(process.env.JWT_SECRET);
  // If no token is found, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);       // Verify the token using the secret key from environment variables
    req.user = decoded;      // Attach the decoded token payload (user data) to the request object
    next();     // Call the next middleware or route handler

  } catch (error) {
    
    // If the token has expired, return a 401 Unauthorized response with a specific message
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please login again' });
    }
    
    // If the token is invalid for any other reason, return a 403 Forbidden response
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Export the middleware function for use in other parts of the application
module.exports = authMiddleware;











// const authMiddleware = (req, res, next) => {
//     if (req.session && req.session.user) {
//       next(); // User is authenticated, continue to the route
//     } else {
//       res.status(401).json({ message: "Unauthorized. Please log in." });
//     }
//   };
  
//   module.exports = authMiddleware;
  












// const jwt = require("jsonwebtoken");
// const userdb = require("../models/userSchema");
// const keysecret = process.env.SECRET_KEY


// const authenticate = async(req,res,next)=>{

//     try {
//         const token = req.headers.authorization;
        
//         const verifytoken = jwt.verify(token,keysecret);
        
//         const rootUser = await userdb.findOne({_id:verifytoken._id});
        
//         if(!rootUser) {throw new Error("user not found")}

//         req.token = token
//         req.rootUser = rootUser
//         req.userId = rootUser._id

//         next();

//     } catch (error) {
//         res.status(401).json({status:401,message:"Unauthorized no token provide"})
//     }
// }


// module.exports = authenticate