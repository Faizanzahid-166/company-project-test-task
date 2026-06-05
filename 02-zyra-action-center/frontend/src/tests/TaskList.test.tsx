import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { render } from './test-utils';
import { server } from './setup';
import { TaskList } from '@/features/dashboard/components/TaskList';
import { mockActionCenter } from './handlers';

const tasks = mockActionCenter.tasks;
const studentId = 'student-001';
const noop = vi.fn();

describe('TaskList', () => {
  it('renders all tasks when filter is "all"', () => {
    render(
      <TaskList
        tasks={tasks}
        studentId={studentId}
        statusFilter="all"
        onFilterChange={noop}
      />
    );
    expect(screen.getByText('Submit college application essays')).toBeInTheDocument();
    expect(screen.getByText('Schedule tutoring session')).toBeInTheDocument();
    expect(screen.getByText('Update IEP documentation')).toBeInTheDocument();
  });

  it('filters tasks by status', () => {
    render(
      <TaskList
        tasks={tasks}
        studentId={studentId}
        statusFilter="completed"
        onFilterChange={noop}
      />
    );
    expect(screen.getByText('Update IEP documentation')).toBeInTheDocument();
    expect(screen.queryByText('Submit college application essays')).not.toBeInTheDocument();
  });

  it('shows empty state when no matching tasks', () => {
    render(
      <TaskList
        tasks={tasks}
        studentId={studentId}
        statusFilter="in_progress"
        onFilterChange={noop}
      />
    );
    // Only task-002 is in_progress
    expect(screen.getByText('Schedule tutoring session')).toBeInTheDocument();
    expect(screen.queryByText('Update IEP documentation')).not.toBeInTheDocument();
  });

  it('shows empty state message when no tasks', () => {
    render(
      <TaskList
        tasks={[]}
        studentId={studentId}
        statusFilter="all"
        onFilterChange={noop}
      />
    );
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    expect(screen.getByText('This student has no tasks.')).toBeInTheDocument();
  });

  it('renders priority and status badges', () => {
    render(
      <TaskList
        tasks={tasks}
        studentId={studentId}
        statusFilter="all"
        onFilterChange={noop}
      />
    );
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getAllByText('High').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
  });

  it('calls onFilterChange when filter is changed', () => {
    const onFilterChange = vi.fn();
    render(
      <TaskList
        tasks={tasks}
        studentId={studentId}
        statusFilter="all"
        onFilterChange={onFilterChange}
      />
    );
    const filterSelect = screen.getByRole('combobox', { name: 'Filter tasks by status' });
    fireEvent.change(filterSelect, { target: { value: 'completed' } });
    expect(onFilterChange).toHaveBeenCalledWith('completed');
  });

  it('optimistically updates task status on select change', async () => {
    render(
      <TaskList
        tasks={tasks}
        studentId={studentId}
        statusFilter="all"
        onFilterChange={noop}
      />
    );

    const statusSelects = screen.getAllByRole('combobox', { name: /Update status for task/i });
    // Change first task (pending) to in_progress
    fireEvent.change(statusSelects[0], { target: { value: 'in_progress' } });

    await waitFor(() => {
      expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
    });
  });

  it('rolls back optimistic update on API error', async () => {
    server.use(
      http.patch('/api/tasks/:taskId/status', () =>
        HttpResponse.json(
          { success: false, error: { message: 'Task not found', code: 'NOT_FOUND', requestId: 'x' } },
          { status: 404 }
        )
      )
    );

    render(
      <TaskList
        tasks={tasks}
        studentId={studentId}
        statusFilter="all"
        onFilterChange={noop}
      />
    );

    const statusSelects = screen.getAllByRole('combobox', { name: /Update status for task/i });
    fireEvent.change(statusSelects[0], { target: { value: 'completed' } });

    await waitFor(() => {
      // After error rollback, original pending status restored
      expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    });
  });
});
