import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
  'aria-label'?: string;
}

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-subtle shadow-sm',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-5 pt-5 pb-4 border-b border-subtle', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>;
}
