// src/pages/MyNotes.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
    LayoutGrid, List, Search, Filter, MoreVertical, Eye, Trash2,
    FileText, CheckCircle, Clock, XCircle, Share2, Edit2,
    BarChart3, TrendingUp
} from "lucide-react";
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';

// --- Stat Card Component ---
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <GlassCard className="p-5 flex flex-col justify-between border-t-2" style={{ borderColor: color }}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-opacity-10 backdrop-blur-md`} style={{ backgroundColor: color }}>
                <Icon size={24} style={{ color: color }} />
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                <TrendingUp size={14} />
                <span>{trend} this month</span>
            </div>
        )}
    </GlassCard>
);

// --- Note Grid Item ---
const NoteCardGrid = ({ note, onView, onDelete }) => {
    return (
        <GlassCard className="group relative p-0 overflow-hidden hover:shadow-cyan-500/10 transition-all duration-300">
            <div className={`h-40 bg-gray-900 border-b border-gray-700 relative overflow-hidden flex items-center justify-center 
                ${note.approval_status === 'approved' ? 'border-l-4 border-l-green-500' :
                    note.approval_status === 'rejected' ? 'border-l-4 border-l-red-500' :
                        'border-l-4 border-l-yellow-500'}`}>
                <FileText size={48} className="text-gray-700 group-hover:text-cyan-500 transition-colors duration-300" />
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-md border border-white/10 shadow-lg ${note.approval_status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        note.approval_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                        }`}>
                        {note.approval_status}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1 truncate" title={note.title}>{note.title}</h3>
                <p className="text-sm text-gray-400 mb-4 truncate">{note.subject || 'General'}</p>

                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Eye size={12} /> {note.view_count || 0} views</span>
                    <span>Updated: {new Date(note.updated_at || note.created_at).toLocaleDateString()}</span>
                </div>

                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button onClick={() => onView(note)} variant="secondary" className="flex-1 text-xs py-2 h-auto">View</Button>
                    <button onClick={() => onDelete(note.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </GlassCard>
    );
};

// --- Note List Item ---
const NoteListItem = ({ note, onView, onDelete }) => (
    <div className="group flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-cyan-500 shrink-0">
                <FileText size={20} />
            </div>
            <div className="min-w-0">
                <h4 className="text-white font-medium truncate" title={note.title}>{note.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{note.subject}</span>
                    <span>•</span>
                    <span className={`uppercase font-bold ${note.approval_status === 'approved' ? 'text-green-400' :
                        note.approval_status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                        }`}>{note.approval_status}</span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-400 mx-4">
            <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Last Updated</span>
                <span className="w-24 text-right hidden md:block">{new Date(note.updated_at || note.created_at).toLocaleDateString()}</span>
            </div>
            <span className="w-16 hidden sm:flex items-center gap-1"><Eye size={14} /> {note.view_count || 0}</span>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onView(note)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-300">
                <Eye size={18} />
            </button>
            <button onClick={() => onDelete(note.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400">
                <Trash2 size={18} />
            </button>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700/50 mb-6">
            <FileText size={40} className="text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No notes uploaded yet</h3>
        <p className="text-gray-400 max-w-sm mx-auto mb-8">
            Your uploaded notes and their analytics will appear here. Start contributing to help others!
        </p>
        <Link to="/upload-note">
            <Button variant="primary" className="px-8">
                Upload Your First Note
            </Button>
        </Link>
    </div>
);

export default function MyNotes() {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, totalViews: 0 });
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [filterSemester, setFilterSemester] = useState('all');
    const [filterUniversity, setFilterUniversity] = useState('');

    useEffect(() => {
        fetchMyNotes();
    }, []);

    async function fetchMyNotes() {
        setLoading(true);
        try {
            const res = await api.get("/notes/me");
            // Handle both response structures (array or object with stats)
            if (res.data.notes) {
                setNotes(res.data.notes);
                setStats(res.data.stats);
            } else if (Array.isArray(res.data)) {
                // Fallback if backend wasn't updated yet (defensive)
                setNotes(res.data);
                setStats({
                    total: res.data.length,
                    approved: res.data.filter(n => n.approval_status === 'approved').length,
                    pending: res.data.filter(n => n.approval_status === 'pending').length,
                    rejected: res.data.filter(n => n.approval_status === 'rejected').length,
                    totalViews: res.data.reduce((acc, curr) => acc + (curr.view_count || 0), 0)
                });
            }
        } catch (err) {
            console.error("Failed to fetch notes", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(prev => prev.filter(n => n.id !== id));
            // Refetch or adjust stats manually
            setStats(prev => ({
                ...prev,
                total: prev.total - 1,
            }));
        } catch (err) {
            alert("Failed to delete note.");
        }
    }

    // --- Filtering ---
    // --- Filtering ---
    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (note.subject && note.subject.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = filterStatus === 'all' || note.approval_status === filterStatus;
        const matchesSemester = filterSemester === 'all' || (note.semester && note.semester.toString() === filterSemester.toString());
        const matchesUniversity = filterUniversity === '' || (note.university_name && note.university_name.toLowerCase().includes(filterUniversity.toLowerCase()));
        return matchesSearch && matchesStatus && matchesSemester && matchesUniversity;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
                <div className="text-cyan-500 animate-pulse font-medium">Loading Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0A0A0C] text-gray-100 font-inter">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">My Notes</h1>
                        <p className="text-gray-400">Manage your contributions ({user?.email})</p>
                    </div>
                    <Link to="/my-uploads">
                        <Button className="flex items-center gap-2 px-6">
                            <FileText size={18} /> Upload New
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
                    <StatCard title="Total Uploads" value={stats.total} icon={FileText} color="#06b6d4" />
                    <StatCard title="Approved" value={stats.approved} icon={CheckCircle} color="#22c55e" />
                    <StatCard title="Pending" value={stats.pending} icon={Clock} color="#eab308" />
                    <StatCard title="Total Views" value={stats.totalViews} icon={BarChart3} color="#8b5cf6" trend="+12%" />
                </div>

                {/* Filters & Toolbar */}
                <div className="flex flex-col xl:flex-row gap-4 justify-between bg-gray-900/50 p-2 rounded-2xl border border-gray-800">
                    <div className="flex flex-col md:flex-row items-center gap-2 flex-1 w-full">
                        <div className="relative flex-1 w-full md:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search title or subject..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full md:w-auto bg-gray-800 text-sm text-gray-300 border-none rounded-xl py-2 px-4 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {/* Semester Filter (New) */}
                        <select
                            value={filterSemester}
                            onChange={(e) => setFilterSemester(e.target.value)}
                            className="w-full md:w-auto bg-gray-800 text-sm text-gray-300 border-none rounded-xl py-2 px-4 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                        >
                            <option value="all">All Semesters</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => <option key={sem} value={sem}>Sem {sem}</option>)}
                        </select>

                        {/* University Filter (Placeholder for now, could be dynamic) */}
                        <input
                            type="text"
                            placeholder="Filter by Uni..."
                            value={filterUniversity}
                            onChange={(e) => setFilterUniversity(e.target.value)}
                            className="w-full md:w-32 bg-gray-800 text-sm text-gray-300 border-none rounded-xl py-2 px-4 focus:ring-1 focus:ring-cyan-500"
                        />

                    </div>

                    <div className="flex items-center gap-1 bg-gray-800 p-1 rounded-xl self-end md:self-auto">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-700 text-cyan-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-700 text-cyan-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {filteredNotes.length === 0 ? (
                    <div className="mt-12">
                        {notes.length === 0 ? <EmptyState /> : (
                            <div className="text-center py-20 text-gray-500">
                                No notes match your filters.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in" : "space-y-3 animate-fade-in"}>
                        {filteredNotes.map(note => (
                            viewMode === 'grid'
                                ? <NoteCardGrid key={note.id} note={note} onView={() => setSelectedPdf({ id: note.id, title: note.title })} onDelete={handleDelete} />
                                : <NoteListItem key={note.id} note={note} onView={() => setSelectedPdf({ id: note.id, title: note.title })} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>

            {/* PDF Modal */}
            {selectedPdf && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-gray-900 w-full h-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col border border-gray-700 shadow-2xl">
                        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                            <h2 className="text-lg font-bold text-white truncate flex items-center gap-2">
                                <FileText size={18} className="text-cyan-400" />
                                {selectedPdf.title}
                            </h2>
                            <button onClick={() => setSelectedPdf(null)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 bg-black relative">
                            <iframe
                                src={`/api/notes/${selectedPdf.id}/view`}
                                title={selectedPdf.title}
                                className="w-full h-full border-0"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}