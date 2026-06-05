import { Router } from 'express';
import { getActionCenter, updateTaskStatus } from '../controllers/actionCenter.controller';

const router = Router();

/**
 * @route  GET /students/:id/action-center
 * @desc   Fetch complete action center payload for a student
 */
router.get('/students/:id/action-center', getActionCenter);

/**
 * @route  PATCH /tasks/:taskId/status
 * @desc   Update the status of a task
 */
router.patch('/tasks/:taskId/status', updateTaskStatus);

export default router;
