import { Router } from 'express';
const router = Router();
import Hometask from '../models/Hometask.js';

// GET all hometasks with optional filtering
router.get('/', async (req, res) => {
  try {
    const { status, courseId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (courseId) filter.courseId = courseId;
    
    const hometasks = await Hometask.find(filter).populate('courseId');
    res.json(hometasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific hometask by ID
router.get('/:id', async (req, res) => {
  try {
    const hometask = await Hometask.findById(req.params.id).populate('courseId');
    if (!hometask) return res.status(404).json({ message: 'Hometask not found' });
    res.json(hometask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST (create) a new hometask
router.post('/', async (req, res) => {
  const { courseId, description, deadline } = req.body;
  
  try {
    // validate deadline is in the future
    if (new Date(deadline) < new Date()) {
      return res.status(400).json({ message: 'Deadline must be in the future' });
    }

    const hometask = new Hometask({
      courseId,
      description,
      deadline: new Date(deadline),
      status: 'pending'
    });
    
    await hometask.save();
    res.status(201).json(hometask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a hometask
router.put('/:id', async (req, res) => {
  const { courseId, description, deadline, status } = req.body;
  
  try {
    // validate deadline is in the future if provided
    if (deadline && new Date(deadline) < new Date()) {
      return res.status(400).json({ message: 'Deadline must be in the future' });
    }

    const updates = {};
    if (courseId) updates.courseId = courseId;
    if (description) updates.description = description;
    if (deadline) updates.deadline = new Date(deadline);
    if (status) updates.status = status;

    const hometask = await Hometask.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('courseId');
    
    if (!hometask) return res.status(404).json({ message: 'Hometask not found' });
    res.json(hometask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH mark hometask as completed
router.patch('/:id/complete', async (req, res) => {
  try {
    const hometask = await Hometask.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    ).populate('courseId');
    
    if (!hometask) return res.status(404).json({ message: 'Hometask not found' });
    res.json(hometask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a hometask
router.delete('/:id', async (req, res) => {
  try {
    const hometask = await Hometask.findByIdAndDelete(req.params.id);
    
    if (!hometask) return res.status(404).json({ message: 'Hometask not found' });
    res.json({ message: 'Hometask deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;