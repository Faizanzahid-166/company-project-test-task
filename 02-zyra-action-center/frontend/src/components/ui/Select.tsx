import { cn } from '@/lib/utils';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function Select({ value, onChange, options, disabled, className, 'aria-label': ariaLabel }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'text-xs font-medium rounded-md px-2 py-1.5 border border-subtle',
        'bg-card text-primary cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors hover:border-brand-500',
        className
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
