import express from 'express';
import { getArticles } from '../controller/articlecontrollers1.js';

const router = express.Router();

router.get('/articles', getArticles);

export default router;