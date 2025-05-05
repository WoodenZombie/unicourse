import { Router } from 'express';
import {
  createHometask,
  getHometask,
  getAllHometasks,
  updateHometask,
  markAsCompleted,
  deleteHometask
} from '../controllers/hometaskController.js';

const router = Router();

router.post('/', createHometask);
router.get('/', getAllHometasks);
router.get('/:id', getHometask);
router.post('/:id', updateHometask);
router.patch('/:id/complete', markAsCompleted);
router.delete('/:id', deleteHometask);

export default router;