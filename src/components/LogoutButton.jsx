// src/components/LogoutButton.jsx
import React from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

import { LogOut } from 'lucide-react';

function LogoutButton({ className = '', iconOnly = false, children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (iconOnly) {
    return (
      <button onClick={handleLogout} className={className} title="Logout">
        <LogOut size={20} />
      </button>
    );
  }

  return (
    <button onClick={handleLogout} className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center gap-2 ${className}`}>
      <LogOut size={18} />
      {children || 'Logout'}
    </button>
  );
}

export default LogoutButton;