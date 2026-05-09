import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'node:process';

// Import route 
import articleRoutes from './router/articleroutes1.js';

// Konfigurasi dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', articleRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: "Server NOVA Berjalan dengan ES Modules!!! ",
        status: "Active"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});