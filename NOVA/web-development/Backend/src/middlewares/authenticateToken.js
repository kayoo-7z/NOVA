import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

  if (!token) {
    return res.status(401).json({
      status: 'failed',
      message: 'Token tidak ditemukan',
    });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({
      status: 'failed',
      message: 'Token tidak valid atau kedaluwarsa',
    });
  }
};

export default authenticateToken;