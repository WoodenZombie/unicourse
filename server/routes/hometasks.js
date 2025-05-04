import { Router } from 'express';
import mongoose from 'mongoose';
import Hometask from '../models/Hometask.js';
import Course from '../models/Course.js';
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

// GET all hometasks
router.get('/', async (req, res) => {
  try {
    const hometasks = await Hometask.find().select('-__v');
    successResponse(res, hometasks);
  } catch (err) {
    console.error('Error fetching hometasks:', err);
    errorResponse(res, 'Server error while fetching hometasks');
  }
});

// GET hometask by id
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const hometask = await Hometask.findById(req.params.id).select('-__v');
    
    if (!hometask) {
      return notFoundResponse(res, 'Hometask');
    }
    
    successResponse(res, hometask);
  } catch (err) {
    console.error(`Error fetching hometask ${req.params.id}:`, err);
    errorResponse(res, 'Server error while fetching hometask');
  }
});

// POST (create) new hometask
router.post('/', async (req, res) => {
  try {
    const { courseId, title, description, deadline } = req.body;
    
    // Validate course exists
    const courseExists = await Course.exists({ _id: courseId });
    if (!courseExists) {
      return notFoundResponse(res, 'Course');
    }

    const hometask = new Hometask({
      courseId,
      title,
      description,
      deadline,
      status: 'pending'
    });
    
    await hometask.save();
    successResponse(res, hometask, 201);
  } catch (err) {
    console.error('Error creating hometask:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return validationErrorResponse(res, errors);
    }
    
    errorResponse(res, 'Server error while creating hometask');
  }
});

// PUT (update) hometask by id
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    const hometask = await Hometask.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        select: '-__v'
      }
    );

    if (!hometask) {
      return notFoundResponse(res, 'Hometask');
    }

    successResponse(res, hometask);
  } catch (err) {
    console.error(`Error updating hometask ${req.params.id}:`, err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return validationErrorResponse(res, errors);
    }
    
    errorResponse(res, 'Server error while updating hometask');
  }
});

// PATCH (mark as completed)
router.patch('/:id/complete', validateObjectId, async (req, res) => {
  try {
    const hometask = await Hometask.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', completedAt: new Date() },
      {
        new: true,
        select: '-__v'
      }
    );

    if (!hometask) {
      return notFoundResponse(res, 'Hometask');
    }

    successResponse(res, hometask);
  } catch (err) {
    console.error(`Error completing hometask ${req.params.id}:`, err);
    errorResponse(res, 'Server error while completing hometask');
  }
});

// DELETE hometask by id
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const hometask = await Hometask.findByIdAndDelete(req.params.id);

    if (!hometask) {
      return notFoundResponse(res, 'Hometask');
    }

    successResponse(res, { message: 'Hometask deleted successfully' });
  } catch (err) {
    console.error(`Error deleting hometask ${req.params.id}:`, err);
    errorResponse(res, 'Server error while deleting hometask');
  }
});

export default router;