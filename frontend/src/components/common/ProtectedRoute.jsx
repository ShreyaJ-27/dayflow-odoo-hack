import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — Guards routes by authentication and role.
 * 
 * Props:
 *   - allowedRoles: array of allowed roles (e.g. ['ADMIN', 'HR'])
 *   - children: the page component to render
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading, roleRoot } = useAuth();
  const location = useLocation();

  // Show nothing while restoring session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400">Restoring session...</span>
        </div>
      </div>
    );
  }

  // Not authenticated → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wrong role → redirect to own dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`${roleRoot}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
