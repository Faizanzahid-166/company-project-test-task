import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { studentService } from '../services/StudentService';
import { taskService } from '../services/TaskService';
import { AppError } from '../utils/AppError';

const updateTaskStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed']),
});

export const getActionCenter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { id } = req.params;
    if (!id?.trim()) {
      throw AppError.badRequest('Student id is required');
    }
    const data = studentService.getActionCenter(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { taskId } = req.params;
    if (!taskId?.trim()) {
      throw AppError.badRequest('Task id is required');
    }

    const parsed = updateTaskStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      throw AppError.badRequest(
        `Invalid status. Must be one of: pending, in_progress, completed`
      );
    }

    const updated = taskService.updateTaskStatus(taskId, parsed.data.status);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};
