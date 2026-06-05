import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiClient } from '@/api/APIs';
import { ActionCenterData, Task, TaskStatus } from '@/types';

// ─────────────────────────────────────────────
// Query Keys
// ─────────────────────────────────────────────
export const queryKeys = {
  actionCenter: (studentId: string) => ['actionCenter', studentId] as const,
};

// ─────────────────────────────────────────────
// useActionCenter — fetch student action center
// ─────────────────────────────────────────────
export const useActionCenter = (studentId: string) =>
  useQuery({
    queryKey: queryKeys.actionCenter(studentId),
    queryFn: () => apiClient.getActionCenter(studentId),
    staleTime: 30_000, // 30s
    retry: 2,
  });

// ─────────────────────────────────────────────
// useUpdateTaskStatus — optimistic mutation
// ─────────────────────────────────────────────
export const useUpdateTaskStatus = (studentId: string) => {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.actionCenter(studentId);

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      apiClient.updateTaskStatus(taskId, status),

    // Optimistic update
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<ActionCenterData>(queryKey);

      if (previous) {
        queryClient.setQueryData<ActionCenterData>(queryKey, {
          ...previous,
          tasks: previous.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status, updatedAt: new Date().toISOString() }
              : t
          ),
        });
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.error('Failed to update task status. Please try again.');
    },

    onSuccess: (updatedTask: Task) => {
      // Reconcile optimistic update with server response
      queryClient.setQueryData<ActionCenterData>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
        };
      });
      toast.success('Task updated successfully');
    },
  });
};
