import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes';

dotenv.config();

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  });

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use('/', taskRoutes);

// Custom Error Handling Middleware
interface AppError extends Error {
  status?: number;
}

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong on the server';
  console.error(`[${req.method}] ${req.path} - ${status}: ${message}`);
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});