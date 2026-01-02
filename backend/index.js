const express = require('express');
require('dotenv').config();
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || process.env.APP_PORT || 8002;

// MongoDB connection (using URI from .env)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    // Don't exit process, let the app continue (for Render compatibility)
  });

// Load allowed origins from .env and split into an array
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'https://edu2medu-frontend.vercel.app',
  'https://edu2medu-backend.onrender.com',
  'https://www.edu2medu.com',
  'https://edu2medu.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Remove console.log in production for faster response
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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

// Optimize JSON parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
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

