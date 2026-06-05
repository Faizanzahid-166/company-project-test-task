import { useDashboardStore } from '@/store/dashboardStore';
import { useActionCenter } from './hooks/useActionCenter';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { ErrorState } from './components/ErrorState';
import { StudentProfileCard } from './components/StudentProfileCard';
import { UrgencyBanner } from './components/UrgencyBanner';
import { StatsGrid } from './components/StatsGrid';
import { TaskList } from './components/TaskList';
import { MessagesPanel } from './components/MessagesPanel';

export function Dashboard() {
  const { activeStudentId, taskStatusFilter, setTaskStatusFilter, isMessagesPanelOpen, toggleMessagesPanel } =
    useDashboardStore();

  const { data, isLoading, isError, error, refetch } = useActionCenter(activeStudentId);

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Failed to load student data.'}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <main
      className="space-y-5 animate-slide-up"
      aria-label={`Action center for ${data.student.firstName} ${data.student.lastName}`}
    >
      <StudentProfileCard student={data.student} />

      <UrgencyBanner
        level={data.urgencyLevel}
        overdueCount={data.stats.overdueTasks}
        unreadCount={data.stats.unreadMessageCount}
      />

      <StatsGrid stats={data.stats} />

      <TaskList
        tasks={data.tasks}
        studentId={activeStudentId}
        statusFilter={taskStatusFilter}
        onFilterChange={setTaskStatusFilter}
      />

      <MessagesPanel
        messages={data.unreadMessages}
        isOpen={isMessagesPanelOpen}
        onToggle={toggleMessagesPanel}
      />
    </main>
  );
}
