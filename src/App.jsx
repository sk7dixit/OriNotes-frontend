// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import './App.css';

// --- Import all pages ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminProfile from './pages/AdminProfile';
import Notes from './pages/Notes';
import NoteViewer from './pages/NoteViewer';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import AdminSecurity from './pages/AdminSecurity';
import ActiveUsers from './pages/ActiveUsers';
import UploadNotes from './pages/UploadNotes';
import EditNote from './pages/EditNote';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Notifications from './pages/Notifications';
import RateUs from './pages/RateUs';
import Share from './pages/Share';
import SuggestImprovement from './pages/SuggestImprovement';
import ForgotPassword from './pages/ForgotPassword';
import FreeNote from './pages/FreeNote';
import Subscribe from './pages/Subscribe';
import ChangePassword from './pages/ChangePassword';
import MyFavourites from './pages/MyFavourites';
import MyUploads from './pages/MyUploads';
import MyStats from './pages/MyStats';
import ApprovalRequests from './pages/ApprovalRequests';
import PublicProfile from './pages/PublicProfile';
import NoteRequests from './pages/NoteRequests';
import MyNotes from './pages/MyNotes';
import UserSubmissions from './pages/UserSubmissions';
import SharedWithMe from './pages/SharedWithMe';
import MyBadges from './pages/MyBadges';
import AdminBadges from './pages/AdminBadges';
import ManageNotes from './pages/ManageNotes';
import Settings from './pages/Settings';
import AdminUpload from './components/admin/AdminUpload'; // Correct Import

// --- Import layout components ---
import PrivateRoute from './components/PrivateRoute';
// import AdminSidebar from './components/AdminSidebar';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import GlobalChat from './components/GlobalChat';

function MainLayout() {
  const { user } = useAuth();
  const location = useLocation();

  // Define routes where the sidebar/layout should NOT appear (e.g. Admin Dashboard has its own layout or none)
  // For now, assume Admin Dashboard handles its own layout or we add AdminLayout later.
  // We apply UserLayout to all authenticated user routes.

  const isPublicRoute = ['/', '/login', '/register', '/forgot-password', '/free-note'].includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/admin-dashboard';

  // Show Chat Launcher for non-admin users on non-public routes
  const showChatLauncher = user && !isAdminRoute && !isPublicRoute;

  const content = (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/free-note" element={<FreeNote />} />

      {/* Private Routes (Wrapped in UserLayout) */}
      <Route path="/dashboard" element={<PrivateRoute><UserLayout><Dashboard /></UserLayout></PrivateRoute>} />
      <Route path="/profile/:userId" element={<PrivateRoute><UserLayout><PublicProfile /></UserLayout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><UserLayout><Profile /></UserLayout></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><UserLayout><Settings /></UserLayout></PrivateRoute>} />
      <Route path="/notes" element={<PrivateRoute><UserLayout><Notes /></UserLayout></PrivateRoute>} />
      <Route path="/change-password" element={<PrivateRoute><UserLayout><ChangePassword /></UserLayout></PrivateRoute>} />
      <Route path="/note-requests" element={<PrivateRoute><UserLayout><NoteRequests /></UserLayout></PrivateRoute>} />
      <Route path="/notes/view/:noteId" element={<PrivateRoute><UserLayout><NoteViewer /></UserLayout></PrivateRoute>} />
      <Route path="/subscribe" element={<PrivateRoute><UserLayout><Subscribe /></UserLayout></PrivateRoute>} />
      <Route path="/privacy" element={<PrivateRoute><UserLayout><PrivacyPolicy /></UserLayout></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><UserLayout><Notifications /></UserLayout></PrivateRoute>} />
      <Route path="/rate-us" element={<PrivateRoute><UserLayout><RateUs /></UserLayout></PrivateRoute>} />
      <Route path="/share" element={<PrivateRoute><UserLayout><Share /></UserLayout></PrivateRoute>} />
      <Route path="/suggest" element={<PrivateRoute><UserLayout><SuggestImprovement /></UserLayout></PrivateRoute>} />
      <Route path="/my-favourites" element={<PrivateRoute><UserLayout><MyFavourites /></UserLayout></PrivateRoute>} />
      <Route path="/my-uploads" element={<PrivateRoute><UserLayout><MyUploads /></UserLayout></PrivateRoute>} />
      <Route path="/my-stats" element={<PrivateRoute><UserLayout><MyStats /></UserLayout></PrivateRoute>} />
      <Route path="/my-notes" element={<PrivateRoute><UserLayout><MyNotes /></UserLayout></PrivateRoute>} />
      <Route path="/my-badges" element={<PrivateRoute><UserLayout><MyBadges /></UserLayout></PrivateRoute>} />
      <Route path="/shared-with-me" element={<PrivateRoute><UserLayout><SharedWithMe /></UserLayout></PrivateRoute>} />
      {/* Compatibility Route for legacy links */}
      <Route path="/upload-note" element={<PrivateRoute><UserLayout><MyUploads /></UserLayout></PrivateRoute>} />

      {/* Admin-Only Routes (Wrapped in AdminLayout) */}
      <Route path="/admin/profile" element={<PrivateRoute requiredRole="admin"><AdminLayout><AdminProfile /></AdminLayout></PrivateRoute>} />
      <Route path="/admin-dashboard" element={<PrivateRoute requiredRole="admin"><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>} />
      <Route path="/admin-settings" element={<PrivateRoute requiredRole="admin"><AdminLayout><AdminSettings /></AdminLayout></PrivateRoute>} />
      <Route path="/admin/security" element={<PrivateRoute requiredRole="admin"><AdminLayout><AdminSecurity /></AdminLayout></PrivateRoute>} />
      <Route path="/active-users" element={<PrivateRoute requiredRole="admin"><AdminLayout><ActiveUsers /></AdminLayout></PrivateRoute>} />
      <Route path="/upload-notes" element={<PrivateRoute requiredRole="admin"><AdminLayout><UploadNotes /></AdminLayout></PrivateRoute>} />
      <Route path="/edit-note/:id" element={<PrivateRoute requiredRole="admin"><AdminLayout><EditNote /></AdminLayout></PrivateRoute>} />
      <Route path="/approval-requests" element={<PrivateRoute requiredRole="admin"><AdminLayout><ApprovalRequests /></AdminLayout></PrivateRoute>} />
      <Route path="/user-submissions" element={<PrivateRoute requiredRole="admin"><AdminLayout><UserSubmissions /></AdminLayout></PrivateRoute>} />
      <Route path="/admin/badges" element={<PrivateRoute requiredRole="admin"><AdminLayout><AdminBadges /></AdminLayout></PrivateRoute>} />
      <Route path="/manage-notes" element={<PrivateRoute requiredRole="admin"><AdminLayout><ManageNotes /></AdminLayout></PrivateRoute>} />
      <Route path="/admin/upload" element={<PrivateRoute requiredRole="admin"><AdminLayout><AdminUpload /></AdminLayout></PrivateRoute>} />
    </Routes>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {content}
      {user && <GlobalChat showLauncher={showChatLauncher} />}
    </div>
  );
}

function AppController() {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white font-inter">
        <img src="/logo.png" alt="OriNotes Logo" className="h-16 w-16 animate-pulse mr-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
        <div className="text-xl font-semibold tracking-wide text-slate-200">Initializing OriNotes...</div>
      </div>
    );
  }
  return <MainLayout />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <AppController />
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}