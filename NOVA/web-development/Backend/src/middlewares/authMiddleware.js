import jwt from 'jsonwebtoken';
import AuthenticationError from '../exceptions/AuthenticationError.js';

export const authenticationMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError('Token tidak ditemukan');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('Token tidak valid');
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    next(new AuthenticationError('Token tidak valid atau sudah expired'));
  }
};