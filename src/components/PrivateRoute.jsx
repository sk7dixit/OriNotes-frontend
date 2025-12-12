import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/notes" replace />;
  }

  return children;
}

export default PrivateRoute;