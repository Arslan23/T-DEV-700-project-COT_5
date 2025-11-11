import { useAuth } from "~/hooks/useAuth";
import { Navigate } from "react-router";
import type { UserRole } from "types/user.types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, hasRole } = useAuth();

  if (!user) {
    return <Navigate to="/landingpage" replace />;
  }

  if (!hasRole(allowedRoles)) {
    return fallback ? <>{fallback}</> : <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}