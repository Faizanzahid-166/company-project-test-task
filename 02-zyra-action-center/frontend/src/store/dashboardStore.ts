import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TaskStatus } from '@/types';

interface DashboardState {
  // UI Preferences
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Active student
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;

  // Task filters
  taskStatusFilter: TaskStatus | 'all';
  setTaskStatusFilter: (filter: TaskStatus | 'all') => void;

  // Expanded messages panel
  isMessagesPanelOpen: boolean;
  toggleMessagesPanel: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.isDarkMode;
          if (next) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: next };
        }),

      activeStudentId: 'student-001',
      setActiveStudentId: (id) => set({ activeStudentId: id }),

      taskStatusFilter: 'all',
      setTaskStatusFilter: (filter) => set({ taskStatusFilter: filter }),

      isMessagesPanelOpen: false,
      toggleMessagesPanel: () =>
        set((state) => ({ isMessagesPanelOpen: !state.isMessagesPanelOpen })),
    }),
    {
      name: 'zyra-dashboard',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        activeStudentId: state.activeStudentId,
      }),
    }
  )
);
