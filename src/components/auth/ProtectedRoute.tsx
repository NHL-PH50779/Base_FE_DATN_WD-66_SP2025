import { Navigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const user = authService.getUser();

  console.log('ProtectedRoute check:', {
    isAuthenticated,
    isAdmin,
    requireAdmin,
    user
  });

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('Admin required but user is not admin, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('Access granted');
  return <>{children}</>;
}