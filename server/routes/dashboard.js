// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Hometask = require('../models/Hometask');

router.get('/', async (req, res) => {
  try {
    const [courses, hometasks] = await Promise.all([
      Course.find().lean(),
      Hometask.find()
        .populate('courseId', 'name')
        .sort({ deadline: 1 }) // Сортировка по сроку выполнения
        .lean()
    ]);
    
    res.json({
      courses,
      upcomingHometasks: hometasks.filter(t => t.status !== 'completed'),
      completedHometasks: hometasks.filter(t => t.status === 'completed')
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;