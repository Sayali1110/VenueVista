import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById } from '../models/userModel.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email
});

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const errors = [];

    if (name.length < 2) errors.push('Name must be at least 2 characters.');
    if (!emailPattern.test(email)) errors.push('Email must be valid.');
    if (password.length < 8) errors.push('Password must be at least 8 characters.');

    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash });
    const token = signToken(user);

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    if (error.code === '23505') {
      error.statusCode = 409;
      error.message = 'An account with this email already exists.';
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);

    res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    res.status(200).json({ data: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

