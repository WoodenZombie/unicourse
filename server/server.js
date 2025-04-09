require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const courseRoutes = require('./routes/courses');
const hometaskRoutes = require('./routes/hometasks');
const dashboardRoutes = require('./routes/dashboard');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = require('./config/db');

// Start server only after DB connection
const startServer = async () => {
  try {
    await connectDB();
    
    // Routes
    app.use('/api/courses', courseRoutes);
    app.use('/api/hometasks', hometaskRoutes);
    app.use('/api/dashboard', dashboardRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});