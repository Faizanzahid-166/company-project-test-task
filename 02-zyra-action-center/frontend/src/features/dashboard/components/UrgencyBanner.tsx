import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { UrgencyLevel } from '@/types';
import { URGENCY_LABELS, URGENCY_STYLES } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface UrgencyBannerProps {
  level: UrgencyLevel;
  overdueCount: number;
  unreadCount: number;
}

const URGENCY_ICONS = {
  high: AlertTriangle,
  medium: AlertCircle,
  low: CheckCircle,
};

const URGENCY_DESCRIPTIONS: Record<UrgencyLevel, (o: number, u: number) => string> = {
  high: (o, u) => {
    const parts: string[] = [];
    if (o > 0) parts.push(`${o} overdue task${o > 1 ? 's' : ''}`);
    if (u > 5) parts.push(`${u} unread messages`);
    return parts.length ? `Immediate attention required — ${parts.join(' and ')}.` : 'Immediate attention required.';
  },
  medium: (_, u) =>
    u > 0
      ? `Open tasks pending and ${u} unread message${u > 1 ? 's' : ''} awaiting response.`
      : 'Open tasks require follow-up.',
  low: () => 'All tasks and messages are up to date.',
};

export function UrgencyBanner({ level, overdueCount, unreadCount }: UrgencyBannerProps) {
  const styles = URGENCY_STYLES[level];
  const Icon = URGENCY_ICONS[level];
  const description = URGENCY_DESCRIPTIONS[level](overdueCount, unreadCount);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Urgency level: ${URGENCY_LABELS[level]}`}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border',
        styles.banner
      )}
    >
      <span className={cn('flex-shrink-0', styles.icon)} aria-hidden="true">
        <Icon className="w-5 h-5" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full flex-shrink-0', styles.dot)} aria-hidden="true" />
          <span className="font-display font-semibold text-sm text-primary">
            {URGENCY_LABELS[level]}
          </span>
        </div>
        <p className="text-xs text-secondary mt-0.5 truncate">{description}</p>
      </div>
      <span
        className={cn(
          'text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border flex-shrink-0',
          level === 'high' && 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
          level === 'medium' && 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
          level === 'low' && 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        )}
      >
        {level}
      </span>
    </div>
  );
}
