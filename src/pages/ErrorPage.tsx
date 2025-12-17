import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

export function ErrorPage() {
  return (
    <div className="flex flex-col justify-center items-center px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="mb-2 text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Page not found
        </h2>
        <p className="mx-auto mb-8 max-w-md text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the page you're looking for. The page might have been removed,
          renamed, or is temporarily unavailable.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
          <Link to="/sign-up">
            <Button variant="secondary">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
