import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { tasks } from '../data/mockData';

describe('GET /api/students/:id/action-center', () => {
  it('returns 200 with full action center payload for a valid student', async () => {
    const res = await request(app).get('/api/students/student-001/action-center');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const { data } = res.body;
    expect(data).toHaveProperty('student');
    expect(data).toHaveProperty('tasks');
    expect(data).toHaveProperty('unreadMessages');
    expect(data).toHaveProperty('urgencyLevel');
    expect(data).toHaveProperty('stats');

    expect(data.student.id).toBe('student-001');
    expect(Array.isArray(data.tasks)).toBe(true);
    expect(Array.isArray(data.unreadMessages)).toBe(true);
    expect(['low', 'medium', 'high']).toContain(data.urgencyLevel);
  });

  it('returns 404 for a non-existent student', async () => {
    const res = await request(app).get('/api/students/nonexistent-id/action-center');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error).toHaveProperty('requestId');
  });

  it('returns only unread messages', async () => {
    const res = await request(app).get('/api/students/student-001/action-center');
    const { unreadMessages } = res.body.data;

    expect(unreadMessages.every((m: { isRead: boolean }) => !m.isRead)).toBe(true);
  });

  it('returns correct stats shape', async () => {
    const res = await request(app).get('/api/students/student-001/action-center');
    const { stats } = res.body.data;

    expect(stats).toHaveProperty('totalTasks');
    expect(stats).toHaveProperty('completedTasks');
    expect(stats).toHaveProperty('pendingTasks');
    expect(stats).toHaveProperty('inProgressTasks');
    expect(stats).toHaveProperty('overdueTasks');
    expect(stats).toHaveProperty('unreadMessageCount');
  });
});

describe('PATCH /api/tasks/:taskId/status', () => {
  it('updates task status to in_progress', async () => {
    const res = await request(app)
      .patch('/api/tasks/task-003/status')
      .send({ status: 'in_progress' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('in_progress');
    expect(res.body.data.id).toBe('task-003');
  });

  it('updates task status to completed and sets completedAt', async () => {
    const res = await request(app)
      .patch('/api/tasks/task-002/status')
      .send({ status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('completed');
    expect(res.body.data.completedAt).toBeTruthy();
  });

  it('returns 400 for invalid status value', async () => {
    const res = await request(app)
      .patch('/api/tasks/task-001/status')
      .send({ status: 'invalid_status' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('returns 400 for missing status field', async () => {
    const res = await request(app)
      .patch('/api/tasks/task-001/status')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 for non-existent task', async () => {
    const res = await request(app)
      .patch('/api/tasks/nonexistent-task/status')
      .send({ status: 'completed' });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
