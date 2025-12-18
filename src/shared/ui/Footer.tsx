import { format } from 'date-fns';
import { cn } from '@/shared/lib/cn';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        'flex items-center justify-center border-t border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400',
        className
      )}
    >
      <p>© {format(new Date(), 'yyyy')} Bitcoin Prediction Game</p>
    </footer>
  );
}

