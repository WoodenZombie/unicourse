import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import courseRoutes from './routes/courses.js';
import hometaskRoutes from './routes/hometasks.js';
import dashboardRoutes from './routes/dashboard.js';

// Initialize Express
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/unicourse?directConnection=true')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/hometasks', hometaskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});