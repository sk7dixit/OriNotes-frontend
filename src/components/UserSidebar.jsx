import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Upload, Star, PieChart, Share2, Gem,
  User, Shield, Key, MessageSquare, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import Logo from './ui/Logo';

import { useAuth } from '../context/AuthContext';

const UserSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  // const [isOpen, setIsOpen] = useState(false); // Mobile menu state -> Lifted to Layout
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Browse Notes', icon: FileText, path: '/notes' },
    { name: 'My Notes', icon: FileText, path: '/my-notes' },
    { name: 'Upload Note', icon: Upload, path: '/my-uploads' },
    { name: 'My Stats', icon: PieChart, path: '/my-stats' },
    { name: 'Shared With Me', icon: Share2, path: '/shared-with-me' },
  ];

  const accountItems = [
    { name: 'Note Requests', icon: MessageSquare, path: '/note-requests' },
    { name: 'Feedback', icon: MessageSquare, path: '/suggest' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-white/5 transition-all duration-300`}>
        {!isCollapsed ? (
          <div className="transition-opacity duration-300">
            <Logo size="md" />
          </div>
        ) : (
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/20">
            O
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className={({ isActive }) => `
                            flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative
                            ${isActive
                ? 'bg-indigo-600/10 text-indigo-400'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
          >
            <item.icon size={22} className={`flex-shrink-0 transition-colors duration-200`} />

            {!isCollapsed && (
              <span className="ml-3 font-medium truncate">{item.name}</span>
            )}

            {/* Collapsed Tooltip */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {item.name}
              </div>
            )}

            {/* Active Indicator Bar */}
            {location.pathname === item.path && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>
            )}
          </NavLink>
        ))}

        {/* Subscription Badge */}
        {user?.is_subscription_enabled && (
          <NavLink
            to="/subscribe"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className={({ isActive }) => `
                            flex items-center px-3 py-3 rounded-xl transition-all duration-200 group mt-4 border border-purple-500/20
                            ${isActive ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-200'}
                             ${isCollapsed ? 'justify-center' : ''}
                        `}
          >
            <Gem size={22} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 font-medium">Subscribe</span>}
          </NavLink>
        )}

        <div className="my-4 border-t border-white/5 mx-2"></div>

        {accountItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className={({ isActive }) => `
                            flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative
                            ${isActive
                ? 'bg-indigo-600/10 text-indigo-400'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }
                            ${isCollapsed ? 'justify-center' : ''}
                        `}
          >
            <item.icon size={22} className={`flex-shrink-0 transition-colors duration-200`} />

            {!isCollapsed && (
              <span className="ml-3 font-medium truncate">{item.name}</span>
            )}

            {/* Collapsed Tooltip */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {item.name}
              </div>
            )}

            {/* Active Indicator Bar */}
            {location.pathname === item.path && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>
            )}
          </NavLink>
        ))}

      </div>



      {/* Collapse Toggle (Desktop only) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-lg z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar Container */}
      <aside
        className={`
                    fixed top-0 left-0 bottom-0 z-50 bg-slate-900 border-r border-white/5 shadow-2xl transition-all duration-300 ease-in-out
                    ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'lg:w-[88px]' : 'lg:w-72'}
                `}
      >
        <SidebarContent />

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </aside>
    </>
  );
};

export default UserSidebar;