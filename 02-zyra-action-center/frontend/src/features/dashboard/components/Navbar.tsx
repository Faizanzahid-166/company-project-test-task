import { Moon, Sun, GraduationCap } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';

const STUDENT_OPTIONS = [
  { id: 'student-001', name: 'Maya Johnson' },
  { id: 'student-002', name: 'Ethan Williams' },
  { id: 'student-003', name: 'Priya Patel' },
];

export function Navbar() {
  const { isDarkMode, toggleDarkMode, activeStudentId, setActiveStudentId } = useDashboardStore();

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className="font-display font-bold text-primary text-lg leading-none">Zyra</span>
          <span className="hidden sm:inline text-xs text-secondary font-body ml-1">
            Counselor Action Center
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Student switcher */}
          <select
            value={activeStudentId}
            onChange={(e) => setActiveStudentId(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 border border-subtle bg-card text-primary
              focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            aria-label="Select student"
          >
            {STUDENT_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary
              hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors
              focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode
              ? <Sun className="w-4 h-4" aria-hidden="true" />
              : <Moon className="w-4 h-4" aria-hidden="true" />
            }
          </button>
        </div>
      </div>
    </header>
  );
}
