import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useSessionStore } from '@/entities/session/store';
import { Button } from '@/shared/ui/Button';

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useSessionStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      variant="secondary"
      size="sm"
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">
      {isLoading ? 'Signing out...' : 'Sign Out'}
      </span>
    </Button>
  );
}

