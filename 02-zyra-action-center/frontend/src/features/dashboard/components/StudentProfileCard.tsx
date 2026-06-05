import { GraduationCap, Mail, User } from 'lucide-react';
import { Student } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getInitials, STUDENT_STATUS_LABELS, STUDENT_STATUS_COLORS } from '@/lib/utils';

interface StudentProfileCardProps {
  student: Student;
}

export function StudentProfileCard({ student }: StudentProfileCardProps) {
  const initials = getInitials(student.firstName, student.lastName);
  const fullName = `${student.firstName} ${student.lastName}`;

  return (
    <Card aria-label={`Student profile for ${fullName}`}>
      <CardBody>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700
              flex items-center justify-center text-white font-display font-bold text-xl flex-shrink-0"
            aria-hidden="true"
          >
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="font-display font-bold text-xl text-primary leading-tight">
                  {fullName}
                </h2>
                <p className="text-sm text-secondary mt-0.5">{student.email}</p>
              </div>
              <Badge className={STUDENT_STATUS_COLORS[student.status]}>
                {STUDENT_STATUS_LABELS[student.status]}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-sm text-secondary">
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
                Grade {student.grade}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-secondary">
                <User className="w-4 h-4" aria-hidden="true" />
                {student.counselorName}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-secondary">
                <Mail className="w-4 h-4" aria-hidden="true" />
                GPA: <span className="font-semibold text-primary">{student.gpa.toFixed(1)}</span>
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
