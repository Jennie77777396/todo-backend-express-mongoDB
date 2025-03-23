import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || '123456'; 

// Register a new user
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error('Email and password are required') as Error & { status?: number };
      error.status = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists') as Error & { status?: number };
      error.status = 400;
      throw error;
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
});

// Login a user
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error('Email and password are required') as Error & { status?: number };
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid credentials') as Error & { status?: number };
      error.status = 401;
      throw error;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;