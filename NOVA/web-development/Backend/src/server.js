import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'node:process';
import pool from './config/db.js';

// Import route 
import articleRoutes from './routers/articleroutes1.js';
import { register } from './controllers/authController.js';

// Konfigurasi dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', articleRoutes);
app.post('/api/auth/register', register);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: "Server NOVA Berjalan dengan ES Modules!!! ",
        status: "Active"
    });
});

app.listen(PORT, async() => {
    console.log(`Server running on http://localhost:${PORT}`);

    try {
        const res = await pool.query('SELECT NOW()');
        console.log('🐘 Terhubung ke PostgreSQL! Waktu DB:', res.rows[0].now);
    } catch (err) {
     console.error('❌ Gagal terhubung ke Database:', err.message);
    }

});