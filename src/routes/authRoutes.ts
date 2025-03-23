import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const router = express.Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    console.log('Register attempt:', { email, password });
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
    console.log('User saved:', user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error('Email and password are required') as Error & { status?: number };
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ email });
    console.log('User found:', user); // Debug user retrieval
    if (!user) {
      const error = new Error('Invalid credentials - User not found') as Error & { status?: number };
      error.status = 401;
      throw error;
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      const error = new Error('Invalid credentials - Password incorrect') as Error & { status?: number };
      error.status = 401;
      throw error;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;