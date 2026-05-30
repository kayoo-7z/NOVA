import express from 'express';
import {
  completeProfile,
  getProfile,
} from '../controllers/profileController.js';
import { authenticationMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/lengkapi-data', authenticationMiddleware, completeProfile);
router.get('/profile', authenticationMiddleware, getProfile);

export default router;