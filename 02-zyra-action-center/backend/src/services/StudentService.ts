import { Student, ActionCenterResponse, ActionCenterStats } from '../types';
import { students, tasks, messages } from '../data/mockData';
import { urgencyService } from './UrgencyService';
import { AppError } from '../utils/AppError';

export class StudentService {
  /**
   * Retrieves the full action center payload for a given student.
   * Aggregates student info, tasks, unread messages, urgency, and stats.
   */
  getActionCenter(studentId: string): ActionCenterResponse {
    const student = this.findStudentOrThrow(studentId);

    const studentTasks = tasks.filter((t) => t.studentId === studentId);
    const studentMessages = messages.filter((m) => m.studentId === studentId);
    const unreadMessages = studentMessages.filter((m) => !m.isRead);

    const urgencyLevel = urgencyService.calculateUrgency(studentTasks, studentMessages);
    const stats = this.computeStats(studentTasks, unreadMessages.length);

    return {
      student,
      tasks: studentTasks,
      unreadMessages,
      urgencyLevel,
      stats,
    };
  }

  findStudentOrThrow(studentId: string): Student {
    const student = students.find((s) => s.id === studentId);
    if (!student) {
      throw AppError.notFound(`Student with id "${studentId}"`);
    }
    return student;
  }

  private computeStats(studentTasks: typeof tasks, unreadCount: number): ActionCenterStats {
    const now = new Date();
    return {
      totalTasks: studentTasks.length,
      completedTasks: studentTasks.filter((t) => t.status === 'completed').length,
      pendingTasks: studentTasks.filter((t) => t.status === 'pending').length,
      inProgressTasks: studentTasks.filter((t) => t.status === 'in_progress').length,
      overdueTasks: studentTasks.filter(
        (t) => t.status !== 'completed' && new Date(t.dueDate) < now
      ).length,
      unreadMessageCount: unreadCount,
    };
  }
}

export const studentService = new StudentService();
