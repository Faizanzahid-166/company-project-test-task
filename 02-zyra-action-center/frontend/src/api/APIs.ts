// src/api/APIs.ts
import Client from "./Client";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { ActionCenterData, ApiResponse, Task, TaskStatus } from '@/types';

export const checkHealth = async (config?: AxiosRequestConfig): Promise<any> => {
    const res = await Client.get("/api/health", config);
    return res.data;
    // 👉 DevTools → Network tab → Refresh page
    // What to check:
    // ✅ Status = 200 → backend connected
    // ❌ 404 → wrong route
    // ❌ 500 → backend error
    // ❌ CORS error → config issue
};

// Response interceptor for uniform error handling
Client.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const message =
      (error.response?.data as { error?: { message?: string } })?.error?.message ??
      error.message ??
      'An unknown error occurred';
    return Promise.reject(new Error(message));
  }
);

export const apiClient = {
  getActionCenter: async (studentId: string): Promise<ActionCenterData> => {
    const { data } = await Client.get<ApiResponse<ActionCenterData>>(
      `/api/students/${studentId}/action-center`
    );
    return data.data;
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<Task> => {
    const { data } = await Client.patch<ApiResponse<Task>>(`/api/tasks/${taskId}/status`, {
      status,
    });
    return data.data;
  },
};
