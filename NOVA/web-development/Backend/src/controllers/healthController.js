import pool from '../config/db.js';
import { checkAiHealth } from '../services/aiService.js';

export const getHealth = async (req, res) => {
  let database = 'error';
  try {
    await pool.query('SELECT 1');
    database = 'ok';
  } catch {
    database = 'error';
  }

  const aiService = await checkAiHealth();

  return res.status(200).json({
    status: 'success',
    message: 'Health check',
    data: {
      api: 'ok',
      database,
      aiService,
    },
  });
};