import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
const {connection} = mongoose;
import cors from 'cors';
import courseRoutes from './routes/courses.js';
import hometaskRoutes from './routes/hometasks.js';
import dashboardRoutes from './routes/dashboard.js';
import connectDB from './config/db.js';

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
      console.log(`MongoDB connected: ${connection.host}`);
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