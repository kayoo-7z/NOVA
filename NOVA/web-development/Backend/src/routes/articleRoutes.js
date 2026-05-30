import express from 'express';

import {
  getAllArticles,
  getFeaturedArticles,
} from '../controllers/articleController.js';

const router = express.Router();

router.get('/articles', getAllArticles);
router.get('/articles/featured', getFeaturedArticles);

export default router;