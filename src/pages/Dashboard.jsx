import React, { useState, useEffect } from 'react';
import { Search, Upload, BookOpen, Clock, Zap, ArrowRight, TrendingUp, Shield, Plus, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NoteCard from '../components/ui/NoteCard';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/users/stats');
                setDashboardData(res.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Derived Stats from Backend
    const realStats = dashboardData?.realStats || {};

    // Map Backend Data for Recommendations
    const recommendedNotes = (dashboardData?.recommendedNotes || []).map(note => ({
        id: note.id,
        title: note.title,
        subject: note.subject,
        university: note.university_name,
        views: parseInt(note.view_count) || 0,
        author: note.author_name || 'User',
        isPopular: true
    }));

    // Map Backend Data for "My Top Notes" (replacing mock recent)
    const recentNotes = (dashboardData?.topNotes || []).map(note => ({
        id: note.id,
        title: note.title,
        subject: note.subject,
        university: note.university_name,
        views: parseInt(note.view_count) || 0,
        author: 'You', // It's my note
        progress: 0, // Not tracking progress yet
        isPopular: parseInt(note.view_count) > 50
    }));

    const stats = [
        { label: 'My Uploads', value: realStats.totalUploads || 0, icon: Upload, color: 'text-blue-400', bg: 'bg-blue-500/10', path: '/my-uploads', trend: 'Live' },
        { label: 'Favourites', value: realStats.favouritesCount || 0, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', path: '/my-favourites', trend: 'Saved' },
        { label: 'Total Views (Impact)', value: realStats.totalViewsReceived || 0, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10', path: '/my-stats', trend: 'Received' },
    ];

    const quickActions = [
        { name: 'Upload Note', icon: Upload, path: '/my-uploads', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
        { name: 'Browse Notes', icon: Search, path: '/notes', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        { name: 'My Stats', icon: TrendingUp, path: '/my-stats', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
        { name: 'Request Access', icon: Shield, path: '/note-requests', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    ];

    // Placeholder for recommended notes (Phase 2: Use AI or recent views to populate real recs)
    // const recommendedNotes = ... (Moved to derived stats above)

    if (loading) {
        return (
            <div className="space-y-8 animate-fade-in-up">
                <div className="h-20 flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="w-48 h-8 rounded-lg" />
                        <Skeleton className="w-64 h-4 rounded-lg" />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12 animate-fade-in-up">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">{user?.name?.split(' ')[0] || 'Student'}</span>! 👋
                    </h1>
                    <p className="text-slate-400">Here's what's happening with your learning today.</p>
                </div>
                <Link to="/upload-note">
                    <Button variant="primary" className="hidden md:flex items-center gap-2">
                        <Plus size={18} /> Upload New
                    </Button>
                </Link>
            </header>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, idx) => (
                    <Link to={action.path} key={idx} className={`flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border transition-all hover:-translate-y-1 hover:shadow-lg ${action.color} bg-opacity-50 border-white/5`}>
                        <div className={`p-2 rounded-lg bg-white/10`}>
                            <action.icon size={20} />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm md:text-base text-slate-200 text-center sm:text-left">{action.name}</span>
                    </Link>
                ))}
            </div>

            {/* Global Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-panel p-6 relative overflow-hidden group">
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:blur-3xl transition-all opacity-50`}></div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{stat.trend}</span>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-4xl font-bold text-white mb-1 tracking-tight">{stat.value}</h3>
                            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                        </div>
                        <div className="mt-4 text-xs text-slate-500 flex items-center gap-1">
                            <TrendingUp size={12} /> vs last week
                        </div>
                    </div>
                ))}
            </div>

            {/* Recommended Notes (New Section) */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Shield size={20} className="text-amber-400" /> Recommended For You
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Top picks based on your learning history.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedNotes.map(note => (
                        <NoteCard key={note.id} note={note} onClick={() => { }} />
                    ))}
                </div>
            </section>

            {/* Continue Reading Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock size={20} className="text-blue-400" /> Continue Reading
                        </h2>
                    </div>
                    <Link to="/notes">
                        <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">View All</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentNotes.map(note => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onClick={() => { }}
                            showProgress={true}
                            progressValue={note.progress}
                        />
                    ))}

                    {/* Browse More Card */}
                    <Link to="/notes" className="group flex flex-col items-center justify-center min-h-[220px] rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-800/60 transition-all cursor-pointer">
                        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all mb-4 shadow-lg">
                            <Search size={24} />
                        </div>
                        <span className="font-medium text-slate-400 group-hover:text-white transition-colors">Browse More Notes</span>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
