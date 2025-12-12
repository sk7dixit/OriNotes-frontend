import React from 'react';
import { Users, CreditCard, DollarSign, Eye, ArrowUpRight, ArrowDownRight, FileText, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const COLORS = ['#22c55e', '#3b82f6', '#ec4899', '#f59e0b', '#10b981'];

function StatCard({ title, value, change, icon: Icon, color }) {
    const isPositive = change?.startsWith('+');
    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 ${color.replace('text-', 'bg-')} opacity-5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-10`}></div>

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-')}/10 ${color}`}>
                    <Icon size={22} />
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {change}
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-3xl font-bold text-white tracking-tight mb-1">{value}</h3>
                <p className="text-sm text-slate-400">{title}</p>
            </div>
        </div>
    );
}

const AdminOverview = ({ data: initialData }) => { // Rename prop to avoid confusion if we fetch locally here
    const navigate = useNavigate();
    const [data, setData] = React.useState(initialData || {});
    const [timeRange, setTimeRange] = React.useState('all'); // 'today', '7d', '30d', 'all'
    const [loading, setLoading] = React.useState(false);

    // Update local data when prop changes (initial load)
    React.useEffect(() => {
        if (initialData) setData(initialData);
    }, [initialData]);

    const fetchFilteredData = async (range) => {
        try {
            setLoading(true);
            setTimeRange(range);
            // Assuming the parent component passes a setter or we fetch here. 
            // Since AdminDashboard fetches, we should ideally trigger a refetch there.
            // BUT, for encapsulation, we can fetch here just for the overview stats if the parent allows re-fetching or if we move logic here.
            // Let's assume we can fetch directly here for the specific filtered stats.

            // However, AdminDashboard seems to hold the master 'data'. 
            // A better pattern is to fetch here since this component controls the filter.

            // Re-fetching logic:
            const token = localStorage.getItem('token'); // Rough access, better via context or api service
            const response = await api.get(`/admin/dashboard?range=${range}`);
            setData(response.data);

        } catch (err) {
            console.error("Failed to fetch filtered stats", err);
        } finally {
            setLoading(false);
        }
    };

    const popularNotes = data?.popularNotes || [];
    const planDistribution = data?.planDistribution || [];
    const totalUsers = data?.totalUsers ?? 0;
    const activeSubscriptions = data?.activeSubscriptions ?? 0;
    const totalRevenue = data?.totalRevenue ?? 0;
    const totalNotesViews = data?.totalNotesViews ?? 0;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Time Range Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                <div className="bg-slate-900/50 p-1 rounded-lg border border-white/5 flex text-xs font-medium w-full md:w-auto overflow-x-auto">
                    {[
                        { label: 'All Time', value: 'all' },
                        { label: 'Today', value: 'today' },
                        { label: '7 Days', value: '7d' },
                        { label: '30 Days', value: '30d' }
                    ].map((range) => (
                        <button
                            key={range.value}
                            onClick={() => fetchFilteredData(range.value)}
                            className={`flex-1 md:flex-none px-4 py-1.5 rounded-md transition-colors whitespace-nowrap ${timeRange === range.value ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={totalUsers} change="+12%" icon={Users} color="text-blue-500" />
                <StatCard title="Active Notes" value={data?.activeNotes || 0} change={null} icon={FileText} color="text-purple-500" />
                <StatCard title="Pending Approvals" value={data?.pendingApprovals || 0} change="-2%" icon={CheckCircle} color="text-orange-500" />
                <StatCard title="Total Views" value={totalNotesViews} change="+28%" icon={Eye} color="text-green-500" />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Popular Notes Chart */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">Most Popular Notes</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-full bg-slate-800 text-xs text-white">Views</button>
                            <button className="px-3 py-1 rounded-full hover:bg-slate-800 text-xs text-slate-400">Downloads</button>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={popularNotes}>
                                <XAxis dataKey="title" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="view_count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Detailed Stats / Top Contributors */}
                <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-lg font-bold mb-6">Subscription Distribution</h3>
                    <div className="h-64 w-full flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={planDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {planDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {planDistribution.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[index % COLORS.length] }}></span>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions (Bottom) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => navigate('/admin-dashboard?tab=approvals')}
                    className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 hover:border-yellow-500/40 transition-all text-left group"
                >
                    <h4 className="text-yellow-400 font-bold text-lg mb-1 group-hover:translate-x-1 transition-transform">Review Pending</h4>
                    <p className="text-slate-400 text-sm">You have {data?.pendingApprovals || 0} items waiting.</p>
                </button>
                <button
                    onClick={() => navigate('/admin-dashboard?tab=users')}
                    className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all text-left group"
                >
                    <h4 className="text-blue-400 font-bold text-lg mb-1 group-hover:translate-x-1 transition-transform">Manage Users</h4>
                    <p className="text-slate-400 text-sm">View and manage system users.</p>
                </button>
                <button
                    onClick={() => navigate('/admin-settings')}
                    className="p-6 rounded-2xl bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-700 hover:border-slate-600 transition-all text-left group"
                >
                    <h4 className="text-white font-bold text-lg mb-1 group-hover:translate-x-1 transition-transform">System Settings</h4>
                    <p className="text-slate-400 text-sm">Configure platform defaults.</p>
                </button>
            </div>
        </div>
    );
};

export default AdminOverview;
