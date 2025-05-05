import { Router } from 'express';
import {
  createCourse,
  getCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getCourseHometasks
} from '../controllers/courseController.js';

const router = Router();

router.post('/', createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourse);
router.post('/:id', updateCourse);
router.delete('/:id', deleteCourse);
router.get('/:id/hometasks', getCourseHometasks);

export default router;