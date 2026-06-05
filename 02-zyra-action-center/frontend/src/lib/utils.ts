import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TaskPriority, TaskStatus, StudentStatus, UrgencyLevel } from '@/types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isOverdue(dueDate: string, status: TaskStatus): boolean {
  return status !== 'completed' && new Date(dueDate) < new Date();
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

// ─── Label Maps ────────────────────────────────

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  active: 'Active',
  at_risk: 'At Risk',
  graduated: 'Graduated',
  inactive: 'Inactive',
};

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  low: 'Low Priority',
  medium: 'Needs Attention',
  high: 'Urgent',
};

// ─── Color Maps ────────────────────────────────

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  pending: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  in_progress: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

export const STUDENT_STATUS_COLORS: Record<StudentStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  at_risk: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  graduated: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  inactive: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

export const URGENCY_STYLES: Record<
  UrgencyLevel,
  { banner: string; dot: string; icon: string }
> = {
  high: {
    banner: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900',
    dot: 'bg-red-500',
    icon: 'text-red-500',
  },
  medium: {
    banner: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900',
    dot: 'bg-amber-500',
    icon: 'text-amber-500',
  },
  low: {
    banner: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900',
    dot: 'bg-emerald-500',
    icon: 'text-emerald-500',
  },
};
