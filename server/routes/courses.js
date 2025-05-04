import { Router } from 'express';
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Hometask from '../models/Hometask.js';
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse,
  validationErrorResponse 
} from '../utils/apiResponse.js';

const router = Router();

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return validationErrorResponse(res, 'Invalid ID format');
  }
  next();
};

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().select('-__v');
    successResponse(res, courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    errorResponse(res, 'Server error while fetching courses');
  }
});

// GET course by id
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .select('-__v')
      .populate('hometasks', 'title deadline status -_id');

    if (!course) {
      return notFoundResponse(res, 'Course');
    }
    successResponse(res, course);
  } catch (err) {
    console.error(`Error fetching course ${req.params.id}:`, err);
    errorResponse(res, 'Server error while fetching course');
  }
});

// POST (create) new course
router.post('/', async (req, res) => {
  try {
    const { name, professor, schedule, credits } = req.body;
    
    // Basic validation
    if (!name || !professor || !schedule || !credits) {
      return validationErrorResponse(res, 'Missing required fields');
    }

    const course = new Course({ 
      name, 
      professor, 
      schedule, 
      credits: Number(credits) 
    });
    
    await course.save();
    successResponse(res, course, 201);
  } catch (err) {
    console.error('Error creating course:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return validationErrorResponse(res, errors);
    }
    
    errorResponse(res, 'Server error while creating course');
  }
});

// PUT (update) course by id
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true,
        select: '-__v'
      }
    );

    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    successResponse(res, course);
  } catch (err) {
    console.error(`Error updating course ${req.params.id}:`, err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return validationErrorResponse(res, errors);
    }
    
    errorResponse(res, 'Server error while updating course');
  }
});

// DELETE course by id
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    // Delete associated hometasks first
    await Hometask.deleteMany({ courseId: req.params.id });
    
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return notFoundResponse(res, 'Course');
    }

    successResponse(res, { 
      message: 'Course and associated hometasks deleted successfully' 
    });
  } catch (err) {
    console.error(`Error deleting course ${req.params.id}:`, err);
    errorResponse(res, 'Server error while deleting course');
  }
});

// GET all hometasks for the given course
router.get('/:id/hometasks', validateObjectId, async (req, res) => {
  try {
    const courseExists = await Course.exists({ _id: req.params.id });
    if (!courseExists) {
      return notFoundResponse(res, 'Course');
    }

    const hometasks = await Hometask.find({ courseId: req.params.id })
      .select('-__v')
      .sort({ deadline: 1 });

    successResponse(res, hometasks);
  } catch (err) {
    console.error(`Error fetching hometasks for course ${req.params.id}:`, err);
    errorResponse(res, 'Server error while fetching hometasks');
  }
});

export default router;