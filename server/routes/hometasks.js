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

module.exports = router;