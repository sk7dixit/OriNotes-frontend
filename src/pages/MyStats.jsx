import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
    Eye, Download, FileCheck, Clock, XCircle, Award,
    TrendingUp, Calendar, ArrowRight, Share2
} from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, color, onClick, trend }) => (
    <div
        onClick={onClick}
        className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-${color}-500/10 cursor-pointer`}
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-400`}>
            <Icon size={80} />
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
                        <Icon size={20} />
                    </div>
                    <h3 className="text-gray-400 font-medium">{title}</h3>
                </div>
                <div className="text-4xl font-bold text-white tracking-tight">{value}</div>
            </div>

            {trend && (
                <div className="flex items-center gap-1 text-green-400 text-sm mt-4">
                    <TrendingUp size={14} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
    </div>
);

const ActivityHeatmap = ({ activityData }) => {
    // Generate last 365 days (or approx 52 weeks)
    // Simplified for demo: Last 12 weeks
    const weeks = 12;
    const days = 7;
    const today = new Date();

    const getIntensity = (count) => {
        if (!count) return 'bg-gray-800';
        if (count < 2) return 'bg-green-900';
        if (count < 5) return 'bg-green-700';
        if (count < 8) return 'bg-green-500';
        return 'bg-green-400';
    };

    // Mock data generation based on activityData if sparse
    const grid = [];
    for (let w = 0; w < weeks; w++) {
        const week = [];
        for (let d = 0; d < days; d++) {
            const date = new Date();
            date.setDate(today.getDate() - ((weeks - w - 1) * 7 + (6 - d)));
            // Find activity for this date
            const dateStr = date.toISOString().split('T')[0];
            const activity = activityData?.find(a => a.date.startsWith(dateStr));
            week.push({ date: dateStr, count: activity ? parseInt(activity.count) : 0 }); // Mock 0 if missing
        }
        grid.push(week);
    }

    return (
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-xl font-semibold text-white mb-4">Contribution Activity</h2>
            <div className="flex gap-1 min-w-max">
                {grid.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1">
                        {week.map((day, dIdx) => (
                            <div
                                key={dIdx}
                                title={`${day.date}: ${day.count} contributions`}
                                className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} hover:ring-1 ring-white/50 transition-all`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-900 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

const BadgeItem = ({ badge }) => (
    <div className="flex flex-col items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:bg-gray-800/50 transition-colors group">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-yellow-500/30">
            <Award className="text-yellow-400" size={32} />
        </div>
        <span className="text-sm font-medium text-gray-300 text-center capitalize">{badge.replace(/_/g, ' ')}</span>
    </div>
);

function MyStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users/my-stats');
                setStats(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load your contribution stats.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
            <div className="animate-pulse text-cyan-500 font-medium">Loading analytics...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
            <div className="text-red-500">{error}</div>
        </div>
    );

    // Prepare chart data (mock downloads for now as requested, map known activity)
    const chartData = stats.activity?.map(d => ({
        name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        uploads: parseInt(d.count),
        views: parseInt(d.count) * Math.floor(Math.random() * 20) // Mock view correlation for demo
    })) || [];

    // Ensure we have some data even if empty to show chart grid
    if (chartData.length === 0) {
        chartData.push({ name: 'Mon', uploads: 0, views: 0 }, { name: 'Tue', uploads: 0, views: 0 });
    }

    return (
        <div className="min-h-screen bg-[#0A0A0C] text-gray-100 p-6 md:p-10 space-y-8 font-inter">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">My Contributions</h1>
                    <p className="text-gray-400">Track your impact, analytics, and achievements on OriNotes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/upload-notes')}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                    >
                        <Share2 size={18} />
                        Upload Note
                    </button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Views"
                    value={stats.overview?.total_views}
                    icon={Eye}
                    color="purple"
                    trend="+12% this week"
                    onClick={() => { }}
                />
                {/* Mock Downloads Value for Design Completeness */}
                <MetricCard
                    title="Total Downloads"
                    value={Math.floor(stats.overview?.total_views * 0.4)}
                    icon={Download}
                    color="blue"
                    onClick={() => { }}
                />
                <MetricCard
                    title="Approved Notes"
                    value={stats.overview?.approved}
                    icon={FileCheck}
                    color="green"
                    onClick={() => navigate('/my-notes?status=approved')}
                />
                <MetricCard
                    title="Pending Review"
                    value={stats.overview?.pending}
                    icon={Clock}
                    color="yellow"
                    onClick={() => navigate('/my-notes?status=pending')}
                />
            </div>

            {/* Highlights Section (New) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-indigo-300 uppercase text-xs font-bold tracking-wider">
                            <Award size={14} /> Highlights
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Your Best Month</h3>
                        <p className="text-indigo-200 mb-4">{stats.highlightStats?.bestMonth || 'N/A'}</p>
                        <div className="text-4xl font-black text-white">{stats.highlightStats?.bestMonthCount || 0} <span className="text-lg font-medium text-indigo-300">uploads</span></div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                        <Calendar size={180} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-cyan-300 uppercase text-xs font-bold tracking-wider">
                            <TrendingUp size={14} /> Top Performance
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Most Viewed Note</h3>
                        <p className="text-cyan-200 mb-4 truncate w-3/4" title={stats.highlightStats?.mostViewedNoteTitle}>{stats.highlightStats?.mostViewedNoteTitle || 'None'}</p>
                        <div className="text-4xl font-black text-white">{stats.highlightStats?.mostViewedNoteViews?.toLocaleString() || 0} <span className="text-lg font-medium text-cyan-300">views</span></div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                        <Eye size={180} />
                    </div>
                </div>
            </div>

            {/* Heatmap Section */}
            <ActivityHeatmap activityData={stats.activity || []} />

            {/* Main Content Grid: Chart + Top Notes */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Activity Visual */}
                <div className="xl:col-span-2 bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Engagement Overview</h2>
                        <div className="flex bg-gray-700/50 rounded-lg p-1">
                            <button className="px-3 py-1 bg-gray-600 rounded text-xs text-white shadow-sm">Weekly</button>
                            <button className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors">Monthly</button>
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} margin={{ top: 10 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                />
                                <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" name="Views" />
                                <Area type="monotone" dataKey="uploads" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorUploads)" name="Uploads" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Notes */}
                <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 flex flex-col">
                    <h2 className="text-xl font-semibold text-white mb-6">Top Performing Notes</h2>
                    <div className="flex-1 overflow-auto pr-2 custom-scrollbar space-y-4">
                        {stats.topNotes && stats.topNotes.length > 0 ? (
                            stats.topNotes.map((note) => (
                                <div key={note.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors border border-gray-700/30">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <h4 className="font-medium text-white truncate" title={note.title}>{note.title}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                            <span>{new Date(note.created_at).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span className="text-green-400 font-medium">Approved</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-white">{note.view_count}</div>
                                        <div className="text-xs text-gray-500 uppercase">Views</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                No approved notes yet.
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/my-notes')}
                        className="w-full mt-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                        View All Notes <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Badges & Achievements */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Earned Badges</h2>
                    {/* <span className="text-sm text-cyan-400 hover:underline cursor-pointer">View all available</span> */}
                </div>

                {stats.badges && stats.badges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {stats.badges.map((badge, index) => (
                            <BadgeItem key={index} badge={badge} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                        <Award className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">Keep contributing to earn your first badge!</p>
                    </div>
                )}
            </div>

        </div>
    );
}

export default MyStats;