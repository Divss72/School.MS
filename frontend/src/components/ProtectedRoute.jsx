import React, { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to custom unauthorized event to trigger logout cleanly
    const handleUnauthorized = () => {
      logout();
      navigate('/login');
    };
    document.addEventListener('unauthorized', handleUnauthorized);
    return () => document.removeEventListener('unauthorized', handleUnauthorized);
  }, [logout, navigate]);

  if (loading) return null; // Can return a spinner here

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
