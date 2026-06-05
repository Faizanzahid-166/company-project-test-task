export type StudentStatus = 'active' | 'at_risk' | 'graduated' | 'inactive';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type UrgencyLevel = 'low' | 'medium' | 'high';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  status: StudentStatus;
  counselorId: string;
  counselorName: string;
  enrollmentDate: string;
  gpa: number;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  studentId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Message {
  id: string;
  studentId: string;
  senderId: string;
  senderName: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActionCenterStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  unreadMessageCount: number;
}

export interface ActionCenterData {
  student: Student;
  tasks: Task[];
  unreadMessages: Message[];
  urgencyLevel: UrgencyLevel;
  stats: ActionCenterStats;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  requestId: string;
  message: string;
  code: string;
}
