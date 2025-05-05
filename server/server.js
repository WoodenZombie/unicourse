import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import courseRoutes from './routes/courses.js';
import hometaskRoutes from './routes/hometasks.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGODB_URI = 'mongodb://localhost:27017/unicourse';
const PORT = 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/hometasks', hometaskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});