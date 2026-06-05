import { MessageSquare, ClipboardList, CheckCheck, Clock, AlertOctagon, Layers } from 'lucide-react';
import { ActionCenterStats } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StatsGridProps {
  stats: ActionCenterStats;
}

interface StatItem {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  highlight?: boolean;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const items: StatItem[] = [
    {
      label: 'Unread Messages',
      value: stats.unreadMessageCount,
      icon: MessageSquare,
      color: 'text-brand-500',
      bgColor: 'bg-brand-50 dark:bg-brand-900/20',
      highlight: stats.unreadMessageCount > 5,
    },
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: Layers,
      color: 'text-slate-500',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      icon: CheckCheck,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'In Progress',
      value: stats.inProgressTasks,
      icon: Clock,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      label: 'Pending',
      value: stats.pendingTasks,
      icon: ClipboardList,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Overdue',
      value: stats.overdueTasks,
      icon: AlertOctagon,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      highlight: stats.overdueTasks > 0,
    },
  ];

  return (
    <section aria-label="Student statistics">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className={cn(item.highlight && 'ring-2 ring-red-200 dark:ring-red-800')}
            >
              <CardBody className="p-4">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', item.bgColor)}>
                  <Icon className={cn('w-4 h-4', item.color)} aria-hidden="true" />
                </div>
                <p
                  className={cn(
                    'font-display font-bold text-2xl',
                    item.highlight ? 'text-red-500' : 'text-primary'
                  )}
                  aria-label={`${item.label}: ${item.value}`}
                >
                  {item.value}
                </p>
                <p className="text-xs text-secondary mt-0.5 leading-tight">{item.label}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
