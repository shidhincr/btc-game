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
      variant="outline"
      size="sm"
    >
      <LogOut className="w-4 h-4 mr-2" />
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}

