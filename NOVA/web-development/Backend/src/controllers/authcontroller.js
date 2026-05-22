import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import ClientError from '../exceptions/ClientError.js';
import InvariantError from '../exceptions/InvariantError.js';
import AuthenticationError from '../exceptions/AuthenticationError.js';

import {
  validateRegisterPayload,
  validateLoginPayload,
} from '../validators/authValidator.js';


export const register = async (req, res) => {
  try {
    validateRegisterPayload(req.body);

    const { name, email, password } = req.body;

    // Normalisasi email
    const normalizedEmail = email.toLowerCase().trim();

    // Mengecek apakah email sudah terdaftar di database
    const userExist = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (userExist.rows.length > 0) {
      throw new InvariantError('Email sudah digunakan!');
    }

    // Mengacak password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Menyimpan user baru ke database
    const newUser = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
      `,
      [name.trim(), normalizedEmail, hashedPassword]
    );

    return res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil!',
      data: {
        user: newUser.rows[0],
      },
    });
  } catch (err) {
    handleError(err, res);
  }
};

export const login = async (req, res) => {
  try {
    validateLoginPayload(req.body);

    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Mencari user berdasarkan email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      throw new AuthenticationError('Email atau password salah!');
    }

    const foundUser = result.rows[0];

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      throw new AuthenticationError('Email atau password salah!');
    }

    // Membuat access token menggunakan JWT
    const accessToken = jwt.sign(
      {
        id: foundUser.id,
        email: foundUser.email,
      },
      process.env.ACCESS_TOKEN_KEY,
      {
        expiresIn: '3h',
      }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil!',
      data: {
        accessToken,
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
        },
      },
    });
  } catch (err) {
    handleError(err, res);
  }
};

const handleError = (err, res) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  }

  console.error('SERVER ERROR:', err.message);

  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
};