import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home, BookOpen, Upload, Star, Clock, Settings, LogOut,
    ChevronLeft, ChevronRight, GraduationCap, Shield
} from 'lucide-react';
import Logo from '../ui/Logo';

const Sidebar = ({ isOpen, setIsOpen, userRole = 'student' }) => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { name: 'Browse Notes', icon: BookOpen, path: '/notes' },
        { name: 'Upload Note', icon: Upload, path: '/upload-notes' },
        { name: 'My Notes', icon: GraduationCap, path: '/my-notes' },
        { name: 'Favorites', icon: Star, path: '/favorites' },
        { name: 'History', icon: Clock, path: '/history' },
    ];

    const adminItems = [
        { name: 'Admin Panel', icon: Shield, path: '/admin-dashboard' },
        { name: 'Approvals', icon: Shield, path: '/approval-requests' }, // Using Shield for simplicity
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900/90 backdrop-blur-xl border-r border-white/5 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 lg:hover:w-64 group'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="h-16 flex items-center px-6 border-b border-white/5">
                        <div className="lg:group-hover:block lg:hidden w-full transition-all duration-300 overflow-hidden whitespace-nowrap">
                            <Logo size="sm" />
                        </div>
                        {/* Show icon only when collapsed on desktop */}
                        <div className="hidden lg:block lg:group-hover:hidden w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white">
                            O
                        </div>

                        {/* Mobile close */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden ml-auto text-slate-400 hover:text-white"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group/item ${isActive
                                            ? 'bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-400 border border-green-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon size={22} className={`${isActive ? 'text-green-400' : 'text-slate-400 group-hover/item:text-white'}`} />
                                    <span className={`ml-4 font-medium whitespace-nowrap transition-opacity duration-300 ${'lg:opacity-0 lg:group-hover:opacity-100 lg:w-0 lg:group-hover:w-auto overflow-hidden'
                                        } block`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}

                        {userRole === 'admin' && (
                            <>
                                <div className="my-4 border-t border-white/5 mx-3" />
                                <p className={`px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 lg:hidden lg:group-hover:block`}>
                                    Admin
                                </p>
                                {adminItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="flex items-center px-3 py-3 rounded-xl text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-200"
                                    >
                                        <item.icon size={22} />
                                        <span className="ml-4 font-medium whitespace-nowrap lg:opacity-0 lg:group-hover:opacity-100 overflow-hidden block">
                                            {item.name}
                                        </span>
                                    </Link>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5">
                        <button className="flex items-center w-full px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
                            <LogOut size={22} />
                            <span className="ml-4 font-medium whitespace-nowrap lg:opacity-0 lg:group-hover:opacity-100 overflow-hidden block">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
