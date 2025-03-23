import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose'; 
import Task from '../models/taskModel';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.use(requireAuth);

router.get('/tasks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Fetching tasks for user:', req.user!.id);
    const tasks = await Task.find({ userId: req.user!.id });
    console.log('Tasks found:', tasks);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

router.post('/tasks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { task } = req.body;
    console.log('Creating task:', { task, userId: req.user!.id });
    if (!task) {
      const error = new Error('Task is required') as Error & { status?: number };
      error.status = 400;
      throw error;
    }
    const newTask = new Task({ task, userId: req.user!.id });
    await newTask.save();
    console.log('Task created:', newTask);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

router.put('/tasks/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { task, completed } = req.body;
    console.log('Update attempt - Task ID:', id, 'User ID:', req.user!.id, 'Data:', { task, completed });
    const updatedTask = await Task.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), userId: req.user!.id }, // Cast to ObjectId
      { task, completed },
      { new: true }
    );
    console.log('Updated task:', updatedTask);
    if (!updatedTask) {
      const error = new Error('Not Found: Task does not exist or you lack permission') as Error & { status?: number };
      error.status = 404;
      throw error;
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
});

router.delete('/tasks/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log('Delete attempt - Task ID:', id, 'User ID:', req.user!.id);
    const deletedTask = await Task.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id), // Cast to ObjectId
      userId: req.user!.id,
    });
    console.log('Deleted task:', deletedTask);
    if (!deletedTask) {
      const error = new Error('Not Found: Task does not exist or you lack permission') as Error & { status?: number };
      error.status = 404;
      throw error;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;