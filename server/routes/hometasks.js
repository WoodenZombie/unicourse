const express = require('express');
const router = express.Router();
const Hometask = require('../models/Hometask');

// GET all hometasks
router.get('/', async (req, res) => {
  try {
    const hometasks = await Hometask.find().populate('courseId');
    res.json(hometasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new hometask
router.post('/', async (req, res) => {
  const { courseId, description, deadline} = req.body;
  
  try {
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


// PATCH mark hometask as completed
router.patch('/:id/complete', async (req, res) => {
  try {
    const hometask = await Hometask.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    
    if (!hometask) return res.status(404).json({ message: 'Hometask not found' });
    res.json(hometask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;