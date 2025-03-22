import express, { Request, Response, RequestHandler, NextFunction } from 'express';
import Task from '../taskModel';

const router = express.Router();

// Removed requireAuth middleware for now
router.get('/tasks', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

router.post('/tasks', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { task } = req.body as { task?: string };
    if (!task) {
      const error = new Error('Bad Request: Task is required') as Error & { status?: number };
      error.status = 400;
      throw error;
    }

    const newTask = new Task({ task });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

interface UpdateTask {
  task?: string;
  completed?: boolean;
}

router.put('/tasks/:id', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedTask = req.body as UpdateTask;

    if (updatedTask.task === undefined && updatedTask.completed === undefined) {
      const error = new Error('Bad Request: No valid fields to update') as Error & { status?: number };
      error.status = 400;
      throw error;
    }

    const task = await Task.findByIdAndUpdate(id, updatedTask, { new: true });
    if (!task) {
      const error = new Error('Not Found: Task does not exist') as Error & { status?: number };
      error.status = 404;
      throw error;
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

router.delete('/tasks/:id', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      const error = new Error('Not Found: Task does not exist') as Error & { status?: number };
      error.status = 404;
      throw error;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}) as RequestHandler);

export default router;