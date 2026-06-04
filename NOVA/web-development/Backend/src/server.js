import pool from './config/db.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import predictRoutes from './routes/predictRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

pool.query('SELECT NOW()')
  .then((result) => {
    console.log('Database connected:', result.rows[0]);
  })
  .catch((error) => {
    console.error('Database connection error:', error.message);
  });

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', predictRoutes);

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    status: 'failed',
    message: 'Resource tidak ditemukan',
  });
});

// Global error handler
app.use(errorMiddleware);

app.listen(port, host, () => {
  console.log(`NOVA API berjalan di http://${host}:${port}`);
});