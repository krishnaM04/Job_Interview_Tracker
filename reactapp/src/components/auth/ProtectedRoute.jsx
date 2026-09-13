import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth || !auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no role restrictions, allow through
  if (allowedRoles.length === 0) return children;

  // Normalize role check — also allow if user has no role yet (newly registered)
  const userRole = auth.user.role || 'STANDARD_CANDIDATE';
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
