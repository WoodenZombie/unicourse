require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const courseRoutes = require('./routes/courses');
const hometaskRoutes = require('./routes/hometasks');

// initialize Express
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// database Connection
require('./config/db');

// routes
app.use('/api/courses', courseRoutes);
app.use('/api/hometasks', hometaskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));