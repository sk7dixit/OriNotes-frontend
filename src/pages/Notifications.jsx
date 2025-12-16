// src/pages/Notifications.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Bell, Upload, Star, Key, Info, CheckCheck, Trash2, MessageSquare, Filter } from 'lucide-react';

// Helper function for formatting dates
const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// --- VIEW FOR REGULAR USERS ---
function UserNotificationsView() {
    const { fetchUnreadCount } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, system, engagement, requests

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Apply Filters
    useEffect(() => {
        if (filter === 'all') {
            setFilteredNotifications(notifications);
        } else {
            setFilteredNotifications(notifications.filter(n => {
                if (filter === 'requests') return n.type === 'access_request';
                if (filter === 'engagement') return ['rating', 'comment'].includes(n.type);
                if (filter === 'system') return ['welcome', 'system', 'upload'].includes(n.type);
                return true;
            }));
        }
    }, [filter, notifications]);

    const handleMarkAllRead = async () => {
        try {
            await api.post('/notifications/mark-read');
            // Optimistically update local state
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            fetchUnreadCount();
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    };

    const handleClearAll = async () => {
        // Placeholder for Clear/Delete All functionality
        // Assuming API might not exist, we just clear local for now or show alert
        if (window.confirm("Are you sure you want to clear all notifications?")) {
            setNotifications([]);
            // await api.delete('/notifications'); // Future implementation
        }
    };

    const getNotificationStyle = (type) => {
        switch (type) {
            case 'upload': return { icon: Upload, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
            case 'rating':
            case 'rating_admin': return { icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
            case 'access_request': return { icon: Key, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
            case 'comment': return { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
            default: return { icon: Bell, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' };
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
            <div className="animate-pulse text-cyan-500 font-medium">Loading notifications...</div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto min-h-screen pt-4 pb-12 px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Notifications</h1>
                    <p className="text-slate-400">Stay updated with your latest activities</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl transition-all border border-slate-700 shadow-sm"
                        title="Mark all as read"
                    >
                        <CheckCheck size={18} />
                        <span className="hidden sm:inline">Mark Read</span>
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/20 text-slate-200 hover:text-red-400 px-4 py-2 rounded-xl transition-all border border-slate-700 hover:border-red-500/30 shadow-sm"
                        title="Clear all notifications"
                    >
                        <Trash2 size={18} />
                        <span className="hidden sm:inline">Clear</span>
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'requests', label: 'Requests' },
                    { id: 'engagement', label: 'Engagement' },
                    { id: 'system', label: 'System' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === tab.id
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredNotifications.length > 0 ? filteredNotifications.map((n, index) => {
                    const style = getNotificationStyle(n.type);
                    const Icon = style.icon;

                    return (
                        <div
                            key={n.id}
                            className={`relative group flex gap-4 p-4 rounded-xl border transition-all duration-300 animate-slide-up ${style.bg} ${n.is_read ? 'opacity-70 hover:opacity-100' : 'shadow-lg shadow-black/20'}`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className={`mt-1 p-2 rounded-lg bg-slate-900/50 ${style.color} shrink-0 h-fit`}>
                                <Icon size={20} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold text-lg leading-snug ${n.is_read ? 'text-slate-300' : 'text-white'}`}>
                                    {n.title}
                                </h3>
                                <p className="text-slate-400 mt-1 leading-relaxed text-sm truncate md:whitespace-normal md:overflow-visible">{n.message}</p>
                                <div className="flex flex-wrap items-center gap-4 mt-3">
                                    <span className="text-xs text-slate-500 font-medium">
                                        {formatDate(n.created_at)}
                                    </span>
                                    {n.reference_url && (
                                        <Link
                                            to={n.reference_url}
                                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            View Details →
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {!n.is_read && (
                                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                            )}
                        </div>
                    );
                }) : (
                    <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700/50 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Bell size={24} className="text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-300">No notifications found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your filters or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- VIEW FOR ADMINS (BROADCAST TOOL) ---
function AdminBroadcastTool() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendNotification = async (e) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            setFeedback('Title and message cannot be empty.');
            return;
        }
        setLoading(true);
        setFeedback('');
        try {
            await api.post('/notifications', { title, message });
            setTitle('');
            setMessage('');
            setFeedback('✅ Notification sent successfully to all users!');
        } catch (error) {
            setFeedback('❌ Failed to send notification.');
            console.error("Failed to send notification:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-gray-100 mt-12 border-t border-gray-800 pt-12">
            <h1 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2"><Key size={24} /> Admin Broadcast</h1>
            <p className="text-gray-400 mb-8">Send a global notification to all registered users.</p>

            <form onSubmit={handleSendNotification} className="bg-gray-800/50 border border-gray-700 p-8 rounded-2xl shadow-xl">
                <div className="mb-6">
                    <label htmlFor="title" className="block text-gray-300 mb-2 font-semibold">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        placeholder="Enter notification title..."
                    />
                </div>
                <div className="mb-8">
                    <label htmlFor="message" className="block text-gray-300 mb-2 font-semibold">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="6"
                        className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
                        placeholder="Type your message here..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
                >
                    {loading ? 'Broadcasting...' : 'Send to All Users'}
                </button>
                {feedback && <p className={`mt-6 text-center font-medium p-3 rounded-lg ${feedback.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{feedback}</p>}
            </form>
        </div>
    );
}

// --- MAIN COMPONENT ---
function Notifications() {
    const { user } = useAuth(); // Assuming useAuth provides 'user' object

    if (!user) return null;

    return (
        <div>
            {/* Show User Notifications for everyone (including admins) */}
            <UserNotificationsView />

            {/* Show Broadcast Tool only for admins, below the list */}
            {user.role === 'admin' && <AdminBroadcastTool />}
        </div>
    );
}

export default Notifications;