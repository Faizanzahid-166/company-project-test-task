import { Task, TaskStatus } from '../types';
import { tasks } from '../data/mockData';
import { AppError } from '../utils/AppError';

export class TaskService {
  /**
   * Updates the status of a task by ID.
   * Sets completedAt when transitioning to 'completed'.
   * Returns the updated task.
   */
  updateTaskStatus(taskId: string, status: TaskStatus): Task {
    const index = tasks.findIndex((t) => t.id === taskId);

    if (index === -1) {
      throw AppError.notFound(`Task with id "${taskId}"`);
    }

    const existing = tasks[index];
    const now = new Date().toISOString();

    const updated: Task = {
      ...existing,
      status,
      updatedAt: now,
      completedAt: status === 'completed' ? now : existing.completedAt,
    };

    // Mutate the in-memory store (simulates DB update)
    tasks[index] = updated;

    return updated;
  }

  findTaskOrThrow(taskId: string): Task {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
      throw AppError.notFound(`Task with id "${taskId}"`);
    }
    return task;
  }
}

export const taskService = new TaskService();
