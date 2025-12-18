import { HistoryList } from '@/features/view-history/HistoryList';
import { cn } from '@/shared/lib/cn';

interface HistoryPanelProps {
  className?: string;
}

export function HistoryPanel({ className }: HistoryPanelProps) {
  return (
    <div
      className={cn(
        'mt-6 sm:mt-8 rounded-2xl bg-white p-4 sm:p-6 shadow-lg transition-all duration-300 dark:bg-slate-800',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
          History
        </h2>
      </div>
      <HistoryList />
    </div>
  );
}

