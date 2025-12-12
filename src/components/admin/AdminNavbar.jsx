import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, LogOut, MessageCircle, FileText, Flag, Settings, Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import GlobalSearch from './GlobalSearch';

const NotificationBadge = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/notifications/stats');
                const total = (res.data.pendingApprovals || 0) + (res.data.pendingReports || 0) + (res.data.pendingFeedback || 0);
                setCount(total);
            } catch (err) {
                console.error("Failed to fetch notification stats", err);
            }
        };
        fetchStats();
        // Poll every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (count === 0) return null;

    return (
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-slate-900 shadow-sm animate-pulse"></span>
    );
};

const NotificationList = ({ setActiveTab }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/notifications/stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleNav = (tab) => {
        if (location.pathname === '/admin-dashboard' || location.pathname === '/admin-dashboard/') {
            setActiveTab(tab);
        } else {
            navigate(`/admin-dashboard?tab=${tab}`);
        }
    };

    if (loading) return <div className="p-4 text-center text-xs text-slate-500">Loading updates...</div>;

    if (!stats || (stats.pendingApprovals === 0 && stats.pendingReports === 0 && stats.pendingFeedback === 0)) {
        return <div className="p-4 text-center text-sm text-slate-400">No new notifications.</div>;
    }

    return (
        <div className="py-1">
            {stats.pendingApprovals > 0 && (
                <button
                    onClick={() => handleNav('notes')}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-start gap-3 transition-colors"
                >
                    <div className="mt-0.5 text-orange-400"><FileText size={16} /></div>
                    <div>
                        <p className="text-sm font-medium text-slate-200">{stats.pendingApprovals} Pending Approvals</p>
                        <p className="text-xs text-slate-500 mt-0.5">Notes waiting for review</p>
                    </div>
                </button>
            )}
            {stats.pendingReports > 0 && (
                <button
                    onClick={() => handleNav('approvals')}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-start gap-3 transition-colors"
                >
                    <div className="mt-0.5 text-red-400"><Flag size={16} /></div>
                    <div>
                        <p className="text-sm font-medium text-slate-200">{stats.pendingReports} Reported Notes</p>
                        <p className="text-xs text-slate-500 mt-0.5">User reports requiring attention</p>
                    </div>
                </button>
            )}
            {stats.pendingFeedback > 0 && (
                <button
                    onClick={() => handleNav('feedback')}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-start gap-3 transition-colors"
                >
                    <div className="mt-0.5 text-cyan-400"><MessageCircle size={16} /></div>
                    <div>
                        <p className="text-sm font-medium text-slate-200">{stats.pendingFeedback} New Messages</p>
                        <p className="text-xs text-slate-500 mt-0.5">Contact inquiries from users</p>
                    </div>
                </button>
            )}
        </div>
    );
};

const AdminNavbar = ({ activeTab, setActiveTab }) => {
    const { user, logout } = useAuth();
    const { toggleChat, isOpen } = useChat();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const notiRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notiRef.current && !notiRef.current.contains(event.target)) {
                setIsNotiOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Determine active tab from prop or URL
    const currentTab = activeTab || searchParams.get('tab') || 'overview';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Handle tab navigation wrapper
    const handleNavigation = (tabId) => {
        if (typeof setActiveTab === 'function') {
            setActiveTab(tabId);
            if (location.pathname === '/admin-dashboard' || location.pathname === '/admin-dashboard/') {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('tab', tabId);
                navigate(`/admin-dashboard?${newParams.toString()}`, { replace: true });
            }
        } else {
            // If no setter provided (e.g. from AdminLayout), just navigate
            navigate(`/admin-dashboard?tab=${tabId}`);
        }
    };

    const navItems = [
        { id: 'overview', label: 'Overview' },
        { id: 'notes', label: 'Notes' },
        { id: 'users', label: 'Users' },
        { id: 'approvals', label: 'Approvals' },
        { id: 'upload', label: 'Upload' },
        { id: 'feedback', label: 'Feedback' },
    ];

    // Handle tab navigation
    const handleTabClick = (tabId) => {
        handleNavigation(tabId);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 z-50 px-6 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
                <button
                    className="md:hidden p-2 text-slate-400 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <Logo size="sm" onClick={() => navigate('/admin-dashboard')} />
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
                    Admin
                </span>
            </div>

            {/* Center: Pill Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1 rounded-full border border-white/5">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${currentTab === item.id
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleChat}
                    className={`p-2 transition-colors ${isOpen ? 'text-white bg-white/10 rounded-full' : 'text-slate-400 hover:text-white'}`}
                    title="Global Chat"
                >
                    <MessageCircle size={20} />
                </button>
                <GlobalSearch setActiveTab={handleNavigation} />

                {/* Notification Bell with Dropdown */}
                <div className="relative" ref={notiRef}>
                    <button
                        onClick={() => setIsNotiOpen(!isNotiOpen)}
                        className="relative p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <Bell size={20} />
                        {/* Red Dot (calculated from props or internal fetching if needed) */}
                        <NotificationBadge />
                    </button>

                    {/* Dropdown */}
                    {isNotiOpen && (
                        <div className="absolute right-0 top-full mt-4 w-80 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 z-50">
                            <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-xl">
                                <h3 className="font-bold text-white">Notifications</h3>
                                <span className="text-xs text-slate-500">Updates</span>
                            </div>
                            <NotificationList setActiveTab={(tab) => { handleNavigation(tab); setIsNotiOpen(false); }} />
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-white/10 mx-1"></div>


                {/* Profile Dropdown */}
                <div className="relative group">
                    <button className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-900/20 ring-2 ring-transparent group-hover:ring-purple-500/50 transition-all">
                            {user?.name?.[0] || 'A'}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                        <div className="px-4 py-3 border-b border-slate-800">
                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>

                        <div className="py-1">
                            <button
                                onClick={() => navigate('/admin/profile')}
                                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                            >
                                <User size={16} />
                                My Profile
                            </button>
                            <button
                                onClick={() => navigate('/admin/security')}
                                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                            >
                                <Settings size={16} />
                                Account
                            </button>
                        </div>

                        <div className="border-t border-slate-800 py-1">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-slate-900 border-b border-white/5 p-4 flex flex-col gap-2 md:hidden animate-in slide-in-from-top-2 z-40">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${currentTab === item.id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default AdminNavbar;
