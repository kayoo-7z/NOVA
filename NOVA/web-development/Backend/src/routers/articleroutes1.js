import express from 'express';
import { getArticles } from '../controllers/articlecontrollers1.js';
const router = express.Router();

router.get('/noviq/articles', getArticles);

export default router;