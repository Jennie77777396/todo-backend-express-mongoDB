import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '123456';

interface JwtPayload {
  id: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    const error = new Error('Unauthorized: No token provided') as Error & { status?: number };
    error.status = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.id }; 
    next();
  } catch (err) {
    const error = new Error('Unauthorized: Invalid token') as Error & { status?: number };
    error.status = 401;
    return next(error);
  }
};

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}