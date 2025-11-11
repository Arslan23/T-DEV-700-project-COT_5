import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import type { UserRole } from 'types/user.types';

export const useAuth = () => {
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  
  const hasRole = (allowedRoles: UserRole[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };
  
  const isAdmin = () => user?.role === 'company_admin';
  const isManager = () => user?.role === 'manager' || user?.role === 'company_admin';
  
  return {
    user,
    isAuthenticated,
    token,
    hasRole,
    isAdmin,
    isManager
  };
};