import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { createError } from './errorHandler';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return next(createError('Authentication required', 401));
  }

  req.userId = req.session.userId;
  next();
};
