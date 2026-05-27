import jwt from 'jsonwebtoken';
import { findUserById } from '../models/userModel.js';

const getToken = (req) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return null;
  }

  return header.slice(7);
};

export const protect = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }

    req.user = user;
    next();
  } catch (_error) {
    res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const token = getToken(req);

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await findUserById(decoded.id);
    }
  } catch (_error) {
    req.user = null;
  }

  next();
};

