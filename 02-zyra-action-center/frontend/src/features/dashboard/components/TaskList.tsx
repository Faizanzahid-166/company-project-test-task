import { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Loader2, AlertTriangle } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import {
  cn,
  formatDate,
  isOverdue,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/lib/utils';
import { useUpdateTaskStatus } from '../hooks/useActionCenter';

interface TaskListProps {
  tasks: Task[];
  studentId: string;
  statusFilter: TaskStatus | 'all';
  onFilterChange: (f: TaskStatus | 'all') => void;
}

const STATUS_OPTIONS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const UPDATE_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

function TaskRow({ task, studentId }: { task: Task; studentId: string }) {
  const { mutate, isPending } = useUpdateTaskStatus(studentId);
  const [localStatus, setLocalStatus] = useState<TaskStatus>(task.status);
  const overdue = isOverdue(task.dueDate, task.status);

  const handleStatusChange = (value: string) => {
    const status = value as TaskStatus;
    setLocalStatus(status);
    mutate({ taskId: task.id, status });
  };

  const StatusIcon = task.status === 'completed' ? CheckCircle2 : Circle;

  return (
    <div
      role="listitem"
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border transition-colors',
        'hover:bg-surface-1 dark:hover:bg-surface-dark-2',
        overdue ? 'border-red-200 dark:border-red-900' : 'border-subtle',
      )}
    >
      <StatusIcon
        className={cn(
          'w-4 h-4 mt-0.5 flex-shrink-0',
          task.status === 'completed' ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'
        )}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium text-primary leading-snug',
            task.status === 'completed' && 'line-through text-secondary'
          )}
        >
          {task.title}
        </p>
        <p className="text-xs text-secondary mt-0.5 line-clamp-1">{task.description}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span
            className={cn(
              'flex items-center gap-1 text-xs',
              overdue ? 'text-red-500 font-medium' : 'text-secondary'
            )}
          >
            {overdue && <AlertTriangle className="w-3 h-3" aria-label="Overdue" />}
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {overdue ? `Overdue · ` : 'Due '}{formatDate(task.dueDate)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge className={PRIORITY_COLORS[task.priority]}>
          {PRIORITY_LABELS[task.priority]}
        </Badge>
        <Badge className={STATUS_COLORS[localStatus]}>
          {STATUS_LABELS[localStatus]}
        </Badge>
        <div className="relative">
          {isPending && (
            <Loader2
              className="w-3 h-3 absolute -top-1 -right-1 text-brand-500 animate-spin"
              aria-hidden="true"
            />
          )}
          <Select
            value={localStatus}
            onChange={handleStatusChange}
            options={UPDATE_OPTIONS}
            disabled={isPending}
            aria-label={`Update status for task: ${task.title}`}
          />
        </div>
      </div>
    </div>
  );
}

export function TaskList({ tasks, studentId, statusFilter, onFilterChange }: TaskListProps) {
  const filtered = statusFilter === 'all' ? tasks : tasks.filter((t) => t.status === statusFilter);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-display font-semibold text-primary">
            Tasks
            <span className="ml-2 text-sm font-body font-normal text-secondary">
              ({filtered.length})
            </span>
          </h3>
          <Select
            value={statusFilter}
            onChange={(v) => onFilterChange(v as TaskStatus | 'all')}
            options={STATUS_OPTIONS}
            aria-label="Filter tasks by status"
          />
        </div>
      </CardHeader>

      <CardBody>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" aria-hidden="true" />
            <p className="text-sm font-medium text-primary">No tasks found</p>
            <p className="text-xs text-secondary mt-0.5">
              {statusFilter === 'all' ? 'This student has no tasks.' : `No ${STATUS_LABELS[statusFilter as TaskStatus].toLowerCase()} tasks.`}
            </p>
          </div>
        ) : (
          <div role="list" className="space-y-2">
            {filtered.map((task) => (
              <TaskRow key={task.id} task={task} studentId={studentId} />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
