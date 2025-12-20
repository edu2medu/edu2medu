// const express = require('express');
// require('dotenv').config();
// const session = require('express-session');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');
// const app = express();
// const port = process.env.APP_PORT || 8002;

// // MongoDB connection (using URI from .env)
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB connected successfully'));

// // Load allowed origins from .env and split into an array
// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
//   'http://localhost:5173', // Add your frontend origin here
//   'https://edu2medu-nine.vercel.app',
//   'https://www.edu2medu.com',
//   'https://edu2medu.com'
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log('Origin:', origin); // Log the origin for debugging
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     methods: 'GET,POST,PUT,DELETE,PATCH',
//     allowedHeaders: 'Content-Type,Authorization',
//     credentials: true, // Allow credentials (cookies, authorization headers)
//   })
// );

// // Handle preflight requests
// app.options('*', cors());// Handle preflight requests
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Session Middleware (use the SESSION_SECRET from .env file)
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET, // Use the session secret from the .env file
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Set to `true` if you're using HTTPS in production
//   })
// );

// // Routes
// const UserRouter = require('./routes/UserRouter');
// const AdminRouter = require('./routes/AdminRouter');
// const AuthRouter = require('./routes/AuthRoutes');

// app.use('/user', UserRouter);
// app.use('/admin', AdminRouter);
// app.use('/auth', AuthRouter);

// // Home route for testing
// app.get('/', (req, res) => {
//   res.send('Backend is working! 🚀');
// });

// // Catch-all handler for undefined routes
// app.all('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// // Set the server to listen on port from environment variable
// app.listen(port, () => {
//   console.log(
//     `Server is running on ${process.env.REACT_APP_BASEURI || `http://localhost:${port}`}`
//   );
// });

// // Export for Vercel (optional for deployment)
// module.exports = app;



const express = require('express');
require('dotenv').config();
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.APP_PORT || 8002;

// MongoDB connection (using URI from .env)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Load allowed origins from .env and split into an array
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'https://edu2medu-nine.vercel.app',
  'https://www.edu2medu.com',
  'https://edu2medu.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Request Origin:', origin); // Debugging log
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE,PATCH',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true, // Allow credentials (cookies, authorization headers)
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Handle preflight requests (OPTIONS) with same CORS options
app.options('*', cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Routes
const UserRouter = require('./routes/UserRouter');
const AdminRouter = require('./routes/AdminRouter');
const AuthRouter = require('./routes/AuthRoutes');

app.use('/user', UserRouter);
app.use('/admin', AdminRouter);
app.use('/auth', AuthRouter);

// Home route
app.get('/', (req, res) => {
  res.send('Backend is working! 🚀');
});

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(
    `Server is running on ${process.env.REACT_APP_BASEURI || `http://localhost:${port}`}`
  );
});

// For Vercel deployments (optional)
module.exports = app;

