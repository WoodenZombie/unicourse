import Hometask from '../models/Hometask.js';
import Course from '../models/Course.js';

export const createHometask = async (req, res) => {
  const { courseId, description, deadline } = req.body;
  const errors = {};

  if (!courseId || courseId.length !== 24) errors.courseId = 'Valid course ID required';
  if (!description || typeof description !== 'string') errors.description = 'Description required';
  if (!deadline || isNaN(new Date(deadline))) errors.deadline = 'Valid deadline required';
  else if (new Date(deadline) <= new Date()) errors.deadline = 'Deadline must be in future';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      code: 'dtoInIsNotValid',
      message: 'Validation failed',
      errors
    });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        code: 'courseDoesNotExist',
        message: 'Course not found'
      });
    }

    const hometask = new Hometask({ courseId, description, deadline });
    await hometask.save();
    res.status(201).json({ success: true, data: hometask });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create hometask' });
  }
};

export const getHometask = async (req, res) => {
  if (!req.params.id || req.params.id.length !== 24) {
    return res.status(400).json({
      success: false,
      code: 'dtoInIsNotValid',
      message: 'Invalid ID format'
    });
  }

  try {
    const hometask = await Hometask.findById(req.params.id).populate('courseId', 'name');
    if (!hometask) {
      return res.status(404).json({
        success: false,
        code: 'hometaskDoesNotExist',
        message: 'Hometask not found'
      });
    }
    res.json({ success: true, data: hometask });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get hometask' });
  }
};

export const getAllHometasks = async (req, res) => {
  try {
    const hometasks = await Hometask.find().populate('courseId', 'name');
    res.json({ success: true, data: hometasks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get hometasks' });
  }
};

export const updateHometask = async (req, res) => {
  if (!req.params.id || req.params.id.length !== 24) {
    return res.status(400).json({
      success: false,
      code: 'dtoInIsNotValid',
      message: 'Invalid ID format'
    });
  }

  try {
    const updateData = { ...req.body };
    if (req.body.status === 'completed') {
      updateData.completedAt = new Date();
    }

    const hometask = await Hometask.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('courseId', 'name');

    if (!hometask) {
      return res.status(404).json({
        success: false,
        code: 'hometaskDoesNotExist',
        message: 'Hometask not found'
      });
    }

    res.json({ success: true, data: hometask });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update hometask' });
  }
};

export const markAsCompleted = async (req, res) => {
  if (!req.params.id || req.params.id.length !== 24) {
    return res.status(400).json({
      success: false,
      code: 'dtoInIsNotValid',
      message: 'Invalid ID format'
    });
  }

  try {
    const hometask = await Hometask.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', completedAt: new Date() },
      { new: true }
    );

    if (!hometask) {
      return res.status(404).json({
        success: false,
        code: 'hometaskDoesNotExist',
        message: 'Hometask not found'
      });
    }

    res.json({ success: true, data: hometask });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to complete hometask' });
  }
};

export const deleteHometask = async (req, res) => {
  if (!req.params.id || req.params.id.length !== 24) {
    return res.status(400).json({
      success: false,
      code: 'dtoInIsNotValid',
      message: 'Invalid ID format'
    });
  }

  try {
    const hometask = await Hometask.findByIdAndDelete(req.params.id);
    if (!hometask) {
      return res.status(404).json({
        success: false,
        code: 'hometaskDoesNotExist',
        message: 'Hometask not found'
      });
    }

    res.json({ success: true, message: 'Hometask deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete hometask' });
  }
};