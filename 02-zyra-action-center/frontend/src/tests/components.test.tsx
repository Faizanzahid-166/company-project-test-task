import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from './test-utils';
import { UrgencyBanner } from '@/features/dashboard/components/UrgencyBanner';
import { StatsGrid } from '@/features/dashboard/components/StatsGrid';
import { ErrorState } from '@/features/dashboard/components/ErrorState';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import { MessagesPanel } from '@/features/dashboard/components/MessagesPanel';
import { StudentProfileCard } from '@/features/dashboard/components/StudentProfileCard';
import { mockActionCenter } from './handlers';

// ─────────────────────────────────────────────
// UrgencyBanner
// ─────────────────────────────────────────────
describe('UrgencyBanner', () => {
  it('renders HIGH urgency correctly', () => {
    render(<UrgencyBanner level="high" overdueCount={2} unreadCount={6} />);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
    expect(screen.getByText(/overdue task/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders MEDIUM urgency correctly', () => {
    render(<UrgencyBanner level="medium" overdueCount={0} unreadCount={3} />);
    expect(screen.getByText('Needs Attention')).toBeInTheDocument();
  });

  it('renders LOW urgency correctly', () => {
    render(<UrgencyBanner level="low" overdueCount={0} unreadCount={0} />);
    expect(screen.getByText('Low Priority')).toBeInTheDocument();
    expect(screen.getByText('All tasks and messages are up to date.')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<UrgencyBanner level="high" overdueCount={1} unreadCount={0} />);
    expect(screen.getByLabelText('Urgency level: Urgent')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// StatsGrid
// ─────────────────────────────────────────────
describe('StatsGrid', () => {
  const stats = {
    totalTasks: 5,
    completedTasks: 2,
    pendingTasks: 1,
    inProgressTasks: 2,
    overdueTasks: 1,
    unreadMessageCount: 3,
  };

  it('renders all stat values', () => {
    render(<StatsGrid stats={stats} />);
    expect(screen.getByLabelText('Total Tasks: 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Completed: 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Pending: 1')).toBeInTheDocument();
    expect(screen.getByLabelText('In Progress: 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Overdue: 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Unread Messages: 3')).toBeInTheDocument();
  });

  it('has correct section aria-label', () => {
    render(<StatsGrid stats={stats} />);
    expect(screen.getByRole('region', { name: 'Student statistics' })).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// ErrorState
// ─────────────────────────────────────────────
describe('ErrorState', () => {
  it('renders default message', () => {
    render(<ErrorState onRetry={vi.fn()} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to load student data.')).toBeInTheDocument();
  });

  it('renders custom error message', () => {
    render(<ErrorState message="Custom error message" onRetry={vi.fn()} />);
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('calls onRetry when retry button clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: /retry loading data/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('has role="alert"', () => {
    render(<ErrorState onRetry={vi.fn()} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// DashboardSkeleton
// ─────────────────────────────────────────────
describe('DashboardSkeleton', () => {
  it('renders with loading aria attributes', () => {
    render(<DashboardSkeleton />);
    const el = screen.getByLabelText('Loading dashboard');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-busy', 'true');
  });
});

// ─────────────────────────────────────────────
// MessagesPanel
// ─────────────────────────────────────────────
describe('MessagesPanel', () => {
  const messages = mockActionCenter.unreadMessages;

  it('renders message count badge', () => {
    render(<MessagesPanel messages={messages} isOpen={false} onToggle={vi.fn()} />);
    expect(screen.getByLabelText(`${messages.length} unread messages`)).toBeInTheDocument();
  });

  it('hides messages when closed', () => {
    render(<MessagesPanel messages={messages} isOpen={false} onToggle={vi.fn()} />);
    expect(screen.queryByRole('list', { name: 'Unread messages' })).not.toBeInTheDocument();
  });

  it('shows messages when open', () => {
    render(<MessagesPanel messages={messages} isOpen={true} onToggle={vi.fn()} />);
    expect(screen.getByRole('list', { name: 'Unread messages' })).toBeInTheDocument();
    expect(screen.getByText(messages[0].content)).toBeInTheDocument();
  });

  it('calls onToggle when header button clicked', () => {
    const onToggle = vi.fn();
    render(<MessagesPanel messages={messages} isOpen={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button', { name: /unread messages/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('shows empty state when no messages', () => {
    render(<MessagesPanel messages={[]} isOpen={true} onToggle={vi.fn()} />);
    expect(screen.getByText('No unread messages')).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// StudentProfileCard
// ─────────────────────────────────────────────
describe('StudentProfileCard', () => {
  const student = mockActionCenter.student;

  it('renders student full name', () => {
    render(<StudentProfileCard student={student} />);
    expect(screen.getByText('Maya Johnson')).toBeInTheDocument();
  });

  it('renders student email', () => {
    render(<StudentProfileCard student={student} />);
    expect(screen.getByText(student.email)).toBeInTheDocument();
  });

  it('renders grade and counselor', () => {
    render(<StudentProfileCard student={student} />);
    expect(screen.getByText(/Grade 11th/)).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
  });

  it('renders correct status badge', () => {
    render(<StudentProfileCard student={student} />);
    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('renders initials avatar', () => {
    render(<StudentProfileCard student={student} />);
    expect(screen.getByText('MJ')).toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<StudentProfileCard student={student} />);
    expect(
      screen.getByLabelText('Student profile for Maya Johnson')
    ).toBeInTheDocument();
  });
});
