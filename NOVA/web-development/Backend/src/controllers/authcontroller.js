import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Cek email yang sudah terdaftar
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "Email sudah digunakan!" });
        }

        // 2. Acak password (Hashing)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Simpan user baru ke database
        const newUser = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        res.status(201).json({
            message: "User berhasil terdaftar!",
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};