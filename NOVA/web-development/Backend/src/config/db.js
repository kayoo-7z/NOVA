import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Konfigurasi koneksi ke PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

pool.on('connect', () => {
  console.log('Terhubung ke Database PostgreSQL!');
});

pool.on('error', (err) => {
  console.error('❌ Error Database:', err);
});

export default pool;