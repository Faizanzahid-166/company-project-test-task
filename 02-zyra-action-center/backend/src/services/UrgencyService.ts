import { Task, Message, UrgencyLevel } from '../types';

interface UrgencyFactors {
  hasOverdueTasks: boolean;
  overdueCount: number;
  hasManyUnreadMessages: boolean;
  unreadCount: number;
  hasPendingTasks: boolean;
  hasCriticalPendingTasks: boolean;
}

const UNREAD_MESSAGE_HIGH_THRESHOLD = 5;
const UNREAD_MESSAGE_MEDIUM_THRESHOLD = 2;

export class UrgencyService {
  /**
   * Calculates urgency level for a student's action center.
   *
   * HIGH:   overdue tasks exist OR unread messages > 5
   * MEDIUM: pending/in_progress tasks exist OR unread messages > 2
   * LOW:    no outstanding tasks or messages
   */
  calculateUrgency(tasks: Task[], messages: Message[]): UrgencyLevel {
    const factors = this.extractFactors(tasks, messages);
    return this.applyRules(factors);
  }

  private extractFactors(tasks: Task[], messages: Message[]): UrgencyFactors {
    const now = new Date();

    const overdueTasks = tasks.filter(
      (t) =>
        t.status !== 'completed' && new Date(t.dueDate) < now
    );

    const pendingTasks = tasks.filter(
      (t) => t.status === 'pending' || t.status === 'in_progress'
    );

    const criticalPending = pendingTasks.filter((t) => t.priority === 'critical' || t.priority === 'high');

    const unreadMessages = messages.filter((m) => !m.isRead);

    return {
      hasOverdueTasks: overdueTasks.length > 0,
      overdueCount: overdueTasks.length,
      hasManyUnreadMessages: unreadMessages.length > UNREAD_MESSAGE_HIGH_THRESHOLD,
      unreadCount: unreadMessages.length,
      hasPendingTasks: pendingTasks.length > 0,
      hasCriticalPendingTasks: criticalPending.length > 0,
    };
  }

  private applyRules(factors: UrgencyFactors): UrgencyLevel {
    if (
      factors.hasOverdueTasks ||
      factors.hasManyUnreadMessages ||
      factors.hasCriticalPendingTasks
    ) {
      return 'high';
    }

    if (
      factors.hasPendingTasks ||
      factors.unreadCount > UNREAD_MESSAGE_MEDIUM_THRESHOLD
    ) {
      return 'medium';
    }

    return 'low';
  }
}

export const urgencyService = new UrgencyService();
