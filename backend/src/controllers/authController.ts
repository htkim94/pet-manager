import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { query } from '../config/db';
import { createError } from '../middleware/errorHandler';
import { User } from '../types';

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError('Email and password are required', 400));
    }

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return next(createError('Email already registered', 409));
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const result = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );

    const user = result.rows[0];

    // Set session
    req.session.userId = user.id;

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError('Email and password are required', 400));
    }

    // Find user
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return next(createError('Invalid email or password', 401));
    }

    const user: User = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return next(createError('Invalid email or password', 401));
    }

    // Set session
    req.session.userId = user.id;

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      return next(createError('Failed to logout', 500));
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out successfully' });
  });
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return next(createError('Not authenticated', 401));
    }

    const result = await query('SELECT id, email, created_at FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return next(createError('User not found', 404));
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(createError('Email is required', 400));
    }

    // Find user
    const userResult = await query('SELECT id FROM users WHERE email = $1', [email]);
    
    // Always return success to prevent email enumeration
    if (userResult.rows.length === 0) {
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent',
      });
    }

    const userId = userResult.rows[0].id;

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Delete any existing tokens for this user
    await query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId]);

    // Save new token
    await query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );

    // In a real app, you would send an email here
    // For now, just log the token (in development only)
    if (process.env.NODE_ENV !== 'production') {
      console.log('Password reset token:', token);
    }

    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent',
      // Only include token in development for testing
      ...(process.env.NODE_ENV !== 'production' && { token }),
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return next(createError('Token and password are required', 400));
    }

    // Find valid token
    const tokenResult = await query(
      'SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return next(createError('Invalid or expired token', 400));
    }

    const userId = tokenResult.rows[0].user_id;

    // Hash new password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Update password
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);

    // Delete used token
    await query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId]);

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};
