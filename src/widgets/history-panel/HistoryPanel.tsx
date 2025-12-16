import { History } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { HistoryList } from '@/features/view-history/HistoryList';
import { cn } from '@/shared/lib/cn';

interface HistoryPanelProps {
  className?: string;
}

export function HistoryPanel({ className }: HistoryPanelProps) {
  return (
    <Card className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-700">
        <History className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          History
        </h2>
      </div>
      <HistoryList />
    </Card>
  );
}

