import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-8 w-8 text-neutral-400" />
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { usuario, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoadingScreen />;
  if (!usuario) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { usuario, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoadingScreen />;
  if (!usuario) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (usuario.rol !== 'ADMIN') return <Navigate to="/" replace />;

  return <>{children}</>;
}
