const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET course by id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new course
router.post('/', async (req, res) => {
  const { name, professor, schedule, credits } = req.body;
  
  try {
    const course = new Course({ name, professor, schedule, credits });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// GET all the hometasks for the given course
router.get('/:id/hometasks', async (req, res) => {
  try {
    const hometasks = await Hometask.find({ courseId: req.params.id })
      .sort({ deadline: 1 });
      
    res.json(hometasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;