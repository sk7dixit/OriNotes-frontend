import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Shield, Key, LogOut, ChevronDown, Menu, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Logo from './ui/Logo';

const UserHeader = ({ toggleSidebar, isSidebarCollapsed, toggleMobileNav }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // SEARCH LOGIC
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const searchRef = useRef(null);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                setIsSearching(true);
                try {
                    const response = await api.get(`/users/search?q=${searchQuery}`);
                    setSearchResults(response.data);
                    setShowSearchDropdown(true);
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Close search dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUserSelect = (userId) => {
        navigate(`/profile/${userId}`);
        setShowSearchDropdown(false);
        setSearchQuery('');
    };

    return (
        <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/5 h-16 md:h-20 px-4 md:px-6 flex items-center justify-between">
            {/* Left Side: Logo & Toggle (Only visible if sidebar is hidden or on mobile) */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleMobileNav}
                    className="p-2 text-slate-400 hover:text-white lg:hidden"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Right Side: Search, Notifications, Profile */}
            <div className="flex items-center gap-4 md:gap-6 ml-auto">
                {/* Search Bar - Hidden on small mobile */}
                {/* Search Bar - Hidden on small mobile */}
                <div className="relative hidden md:block w-64 lg:w-80 group" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                    {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader size={16} className="text-indigo-400 animate-spin" />
                        </div>
                    )}

                    {/* Search Results Dropdown */}
                    {showSearchDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                            {searchResults.length > 0 ? (
                                <ul className="max-h-64 overflow-y-auto">
                                    {searchResults.map(result => (
                                        <li key={result.id}>
                                            <button
                                                onClick={() => handleUserSelect(result.id)}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                    {result.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{result.name}</p>
                                                    <p className="text-xs text-slate-400 truncate">@{result.username}</p>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                    No users found
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Notification Bell */}
                <Link to="/notifications" className="relative p-2.5 bg-slate-800/50 border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all group">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-slate-900"></span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-white/5 bg-slate-800/50 hover:bg-slate-800 transition-all group"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-inner">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="hidden md:flex flex-col items-start mr-2">
                            <span className="text-sm font-semibold text-white/90 leading-tight">{user?.name?.split(' ')[0]}</span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-3 border-b border-white/5 mb-1">
                                <p className="text-sm font-semibold text-white">{user?.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>

                            <Link
                                to="/profile"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <User size={16} /> My Profile
                            </Link>
                            <Link
                                to="/my-badges"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <Shield size={16} /> My Badges
                            </Link>
                            <Link
                                to="/settings"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <Key size={16} /> Settings
                            </Link>

                            <div className="my-1 border-t border-white/5"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default UserHeader;
