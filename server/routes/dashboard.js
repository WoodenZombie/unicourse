import { Router } from 'express';
import Course from '../models/Course.js';
import Hometask from '../models/Hometask.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [courses, hometasks] = await Promise.all([
      Course.find().select('name professor createdAt').lean(),
      Hometask.find()
        .populate('courseId', 'name')
        .sort({ deadline: 1 })
        .lean()
    ]);

    const currentDate = new Date();

    // calculate statistics
    const stats = {
      totalCourses: courses.length,
      totalHometasks: hometasks.length,
      completedHometasks: hometasks.filter(t => t.status === 'completed').length,
      pendingHometasks: hometasks.filter(t => t.status !== 'completed').length
    };

    // get recent activities
    const recentCourses = courses
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    const upcomingHometasks = hometasks
      .filter(t => t.status !== 'completed' && new Date(t.deadline) >= currentDate)
      .slice(0, 5);

    const recentlyCompleted = hometasks
      .filter(t => t.status === 'completed')
      .sort((a, b) => new Date(b.completedAt || b.updatedAt) - new Date(a.completedAt || a.updatedAt))
      .slice(0, 5);

    const overdueHometasks = hometasks
      .filter(t => t.status !== 'completed' && new Date(t.deadline) < currentDate);

    res.json({
      success: true,
      data: {
        stats,
        recentCourses,
        upcomingHometasks,
        recentlyCompleted,
        overdueHometasks
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;