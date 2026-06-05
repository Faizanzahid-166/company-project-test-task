import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export function DashboardSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in" aria-label="Loading dashboard" aria-busy="true">
      {/* Profile card */}
      <Card>
        <CardBody className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </CardBody>
      </Card>

      {/* Urgency banner */}
      <Skeleton className="h-14 w-full rounded-xl" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardBody className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-12" />
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Task list */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardBody className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-subtle">
              <Skeleton className="h-4 w-4 rounded" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
