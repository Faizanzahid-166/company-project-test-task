import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { render } from './test-utils';
import { server } from './setup';
import { Dashboard } from '@/features/dashboard/Dashboard';

const mockStore = {
  activeStudentId: 'student-001',
  taskStatusFilter: 'all' as const,
  setTaskStatusFilter: vi.fn(),
  isMessagesPanelOpen: true,
  toggleMessagesPanel: vi.fn(),
};

vi.mock('@/store/dashboardStore', () => ({
  useDashboardStore: () => mockStore,
}));

describe('Dashboard', () => {
  it('shows skeleton loader while fetching', () => {
    render(<Dashboard />);
    expect(screen.getByLabelText('Loading dashboard')).toBeInTheDocument();
  });

  it('renders student profile after successful fetch', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      // Query specifically for the profile heading
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
    expect(screen.getByText('maya.johnson@school.edu')).toBeInTheDocument();
    expect(screen.getAllByText('Maya Johnson').length).toBeGreaterThan(0);
  });

  it('renders urgency banner with correct level', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });

  it('renders stats grid with correct values', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByLabelText('Total Tasks: 3')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Completed: 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Overdue: 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Unread Messages: 2')).toBeInTheDocument();
  });

  it('renders all tasks', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Submit college application essays')).toBeInTheDocument();
    });
    expect(screen.getByText('Schedule tutoring session')).toBeInTheDocument();
    expect(screen.getByText('Update IEP documentation')).toBeInTheDocument();
  });

  it('renders unread messages panel when open', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getAllByText('Maya Johnson').length).toBeGreaterThan(0);
    });
    expect(
      screen.getByText("I'm really struggling with the essay. Can we meet?")
    ).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    server.use(
      http.get('/api/students/:id/action-center', () =>
        HttpResponse.json(
          { success: false, error: { message: 'Student not found', code: 'NOT_FOUND', requestId: 'x' } },
          { status: 404 }
        )
      )
    );

    render(<Dashboard />);
    await waitFor(
      () => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
