import { Router } from 'express';
const router = Router();
import Course from '../models/Course.js';  
import Hometask from '../models/Hometask.js';  

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

// POST (create) new course
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

// PUT (update) course by id
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(  
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE course by id
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);  
    
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

export default router;