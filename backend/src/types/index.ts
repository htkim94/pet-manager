import { Request } from 'express';
import 'express-session';

// Extend express-session types
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface PasswordResetToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
}

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export interface ApiError extends Error {
  statusCode?: number;
}
