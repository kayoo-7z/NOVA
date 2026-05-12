import pg from 'pg';
import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

const { Pool } = pg;

// Konfigurasi koneksi ke PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Terhubung ke Database PostgreSQL NOVA!');
});

pool.on('error', (err) => {
  console.error('❌ Error Database:', err);
});

export default pool;