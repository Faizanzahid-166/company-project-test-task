import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/AppError';

// Extend Request to carry requestId and startTime
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      startTime: number;
    }
  }
}

// ─────────────────────────────────────────────
// Request Logger Middleware
// ─────────────────────────────────────────────
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  req.requestId = uuidv4();
  req.startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(
      JSON.stringify({
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs: duration,
        timestamp: new Date().toISOString(),
      })
    );
  });

  next();
};

// ─────────────────────────────────────────────
// Error Handler Middleware
// ─────────────────────────────────────────────
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isDev = process.env.NODE_ENV !== 'production';

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        requestId: req.requestId,
        message: err.message,
        code: err.code,
        ...(isDev && { stack: err.stack }),
      },
    });
    return;
  }

  // Unhandled / unexpected errors
  console.error({ requestId: req.requestId, error: err });

  res.status(500).json({
    success: false,
    error: {
      requestId: req.requestId,
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
      ...(isDev && err instanceof Error && { stack: err.stack }),
    },
  });
};

// ─────────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────────
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(AppError.notFound(`Route ${req.method} ${req.path}`));
};
