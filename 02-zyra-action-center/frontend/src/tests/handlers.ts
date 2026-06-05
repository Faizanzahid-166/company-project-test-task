import { http, HttpResponse } from 'msw';
import { ActionCenterData, Task } from '@/types';

const now = new Date();
const yesterday = new Date(now.getTime() - 86400000).toISOString();
const nextWeek = new Date(now.getTime() + 7 * 86400000).toISOString();

export const mockActionCenter: ActionCenterData = {
  student: {
    id: 'student-001',
    firstName: 'Maya',
    lastName: 'Johnson',
    email: 'maya.johnson@school.edu',
    grade: '11th',
    status: 'at_risk',
    counselorId: 'counselor-001',
    counselorName: 'Dr. Sarah Chen',
    enrollmentDate: '2022-09-01',
    gpa: 2.4,
  },
  tasks: [
    {
      id: 'task-001',
      studentId: 'student-001',
      title: 'Submit college application essays',
      description: 'Draft and finalize personal statement.',
      status: 'pending',
      priority: 'critical',
      dueDate: yesterday,
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      id: 'task-002',
      studentId: 'student-001',
      title: 'Schedule tutoring session',
      description: 'Arrange weekly math tutoring.',
      status: 'in_progress',
      priority: 'high',
      dueDate: nextWeek,
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      id: 'task-003',
      studentId: 'student-001',
      title: 'Update IEP documentation',
      description: 'Review and update individualized education plan.',
      status: 'completed',
      priority: 'high',
      dueDate: yesterday,
      createdAt: yesterday,
      updatedAt: yesterday,
      completedAt: yesterday,
    },
  ],
  unreadMessages: [
    {
      id: 'msg-001',
      studentId: 'student-001',
      senderId: 'student-001',
      senderName: 'Maya Johnson',
      content: "I'm really struggling with the essay. Can we meet?",
      isRead: false,
      createdAt: yesterday,
    },
    {
      id: 'msg-002',
      studentId: 'student-001',
      senderId: 'parent-001',
      senderName: 'Linda Johnson (Parent)',
      content: "Please call me about Maya's attendance issues.",
      isRead: false,
      createdAt: yesterday,
    },
  ],
  urgencyLevel: 'high',
  stats: {
    totalTasks: 3,
    completedTasks: 1,
    pendingTasks: 1,
    inProgressTasks: 1,
    overdueTasks: 1,
    unreadMessageCount: 2,
  },
};

export const mockUpdatedTask: Task = {
  ...mockActionCenter.tasks[0],
  status: 'in_progress',
  updatedAt: now.toISOString(),
};

export const handlers = [
  http.get('/api/students/:id/action-center', ({ params }) => {
    if (params.id === 'error-student') {
      return HttpResponse.json(
        { success: false, error: { message: 'Student not found', code: 'NOT_FOUND', requestId: 'test-req' } },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: mockActionCenter });
  }),

  http.patch('/api/tasks/:taskId/status', ({ params }) => {
    if (params.taskId === 'error-task') {
      return HttpResponse.json(
        { success: false, error: { message: 'Task not found', code: 'NOT_FOUND', requestId: 'test-req' } },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: mockUpdatedTask });
  }),
];
