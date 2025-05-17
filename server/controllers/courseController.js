import Course from '../models/Course.js';
import Hometask from '../models/Hometask.js';

export const createCourse = async (req, res) => {
  const { name, professor, schedule, credits } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string') errors.name = 'Course name is required';
  if (!professor || typeof professor !== 'string') errors.professor = 'Professor name is required';
  if (!schedule || typeof schedule !== 'string') errors.schedule = 'Schedule is required';
  if (!credits || typeof credits !== 'number' || credits < 1) errors.credits = 'Valid credits required';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      code: 'dtoInIsNotValid',
      message: 'Validation failed',
      errors
    });
  }

  try {
    const course = new Course({ name, professor, schedule, credits });
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: `Failed to create course, ${err}` });
  }
};

export const getCourse = async (req, res) => {
  if (!req.params.id || req.params.id.length !== 24) {
    return res.status(400).json({
      success: false,
      code: 'dtoInIsNotValid',
      message: 'Invalid ID format'
    });
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        code: 'courseDoesNotExist',
        message: 'Course not found'
      });
    }
    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get course' });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get courses' });
  }
};

export const updateCourse = async (req, res) => {
  if (!req.params.id || req.params.id.length !== 24) {
    return res.status(400).json({
      success: false,
      code: 'dtoInIsNotValid',
      message: 'Invalid ID format'
    });
  }

  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        code: 'courseDoesNotExist',
        message: 'Course not found'
      });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update course' });
  }
};

export const deleteCourse = async (req, res) => {
  if (!req.params.id || req.params.id.length !== 24) {
    return res.status(400).json({
      success: false,
      code: 'dtoInIsNotValid',
      message: 'Invalid ID format'
    });
  }

  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        code: 'courseDoesNotExist',
        message: 'Course not found'
      });
    }

    await Hometask.deleteMany({ courseId: req.params.id });
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete course' });
  }
};

export const getCourseHometasks = async (req, res) => {
  if (!req.params.id || req.params.id.length !== 24) {
    return res.status(400).json({
      success: false,
      code: 'dtoInIsNotValid',
      message: 'Invalid ID format'
    });
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        code: 'courseDoesNotExist',
        message: 'Course not found'
      });
    }

    const hometasks = await Hometask.find({ courseId: req.params.id });
    res.json({ success: true, data: hometasks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get hometasks' });
  }
};