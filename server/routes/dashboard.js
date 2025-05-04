import { Router } from 'express';
const router = Router();
import Course from '../models/Course.js';
import Hometask from '../models/Hometask.js';

// GET dashboard summary
router.get('/', async (req, res) => {
  try {
    const [courses, hometasks] = await Promise.all([
      Course.find().lean(),
      Hometask.find()
        .populate('courseId', 'name professor')
        .sort({ deadline: 1 })
        .lean()
    ]);

    // get current date for filtering upcoming tasks
    const currentDate = new Date();

    const response = {
      stats: {
        totalCourses: courses.length,
        totalHometasks: hometasks.length,
        completedHometasks: hometasks.filter(t => t.status === 'completed').length,
        pendingHometasks: hometasks.filter(t => t.status !== 'completed').length
      },
      courses,
      upcomingHometasks: hometasks.filter(t => 
        t.status !== 'completed' && 
        (!t.deadline || new Date(t.deadline) >= currentDate))
        .slice(0, 10),
      recentlyCompleted: hometasks.filter(t => 
        t.status === 'completed')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
      overdueHometasks: hometasks.filter(t => 
        t.status !== 'completed' && 
        t.deadline && 
        new Date(t.deadline) < currentDate)
    };

    res.json(response);
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ 
      message: 'Failed to load dashboard data',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;