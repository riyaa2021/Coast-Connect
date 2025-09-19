// src/components/common/PublicRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuthContext();

  console.log('PublicRoute - user:', user, 'isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the public component (login/signup)
  return <>{children}</>;
};
