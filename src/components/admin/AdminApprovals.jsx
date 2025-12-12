import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List as ListIcon, Check, X, Eye, FileText, Download } from 'lucide-react';
import api from '../../services/api';

const AdminApprovals = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('card');
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending'); // Default to pending

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            // Re-using the generic endpoint but we might want a specific one later
            // For now, filtering client side provided the list isn't huge
            const res = await api.get('/admin/all-notes');
            setNotes(res.data);
        } catch (err) {
            console.error("Failed to fetch notes", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (noteId) => {
        if (!window.confirm("Approve this note?")) return;
        console.log(`Approving note ${noteId}...`);
        try {
            await api.put(`/notes/admin/approve/${noteId}`, { action: 'approve' });
            console.log("Approval success");
            setNotes(prev => prev.map(n => n.id === noteId ? { ...n, approval_status: 'approved' } : n));
        } catch (err) {
            console.error("Approval failed", err);
            const msg = err.response?.data?.error || "Failed to approve note.";
            alert(msg);
        }
    };

    const handleReject = async (noteId) => {
        const reason = window.prompt("Enter rejection reason:");
        if (reason === null) return;
        console.log(`Rejecting note ${noteId} with reason: ${reason}`);
        try {
            // rejectionReason is expected as 'reason' in backend for reviewNote controller
            await api.put(`/notes/admin/reject/${noteId}`, { action: 'reject', reason: reason || "Admin rejected" });
            console.log("Rejection success");
            setNotes(prev => prev.map(n => n.id === noteId ? { ...n, approval_status: 'rejected' } : n));
        } catch (err) {
            console.error("Rejection failed", err);
            const msg = err.response?.data?.error || "Failed to reject note.";
            alert(msg);
        }
    };

    const displayedNotes = notes.filter(n => {
        if (filterStatus === 'all') return true;
        return n.approval_status === filterStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            default: return 'bg-slate-700 text-slate-300';
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Approvals
                </h2>
                <p className="text-slate-400 mt-1">Review and manage note submission requests.</p>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <div className="flex gap-4">
                    {/* Status Filter Toggle */}
                    <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex">
                        {['pending', 'approved', 'rejected', 'all'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-1.5 rounded-lg capitalize text-sm font-medium transition-all ${filterStatus === status ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* View Mode Toggle */}
                    <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex">
                        <button onClick={() => setViewMode('card')} className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>
                            <LayoutGrid size={18} />
                        </button>
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>
                            <ListIcon size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div></div>
            ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedNotes.map(note => (
                        <div key={note.id} className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-purple-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(note.approval_status)} capitalize`}>
                                    {note.approval_status}
                                </span>
                            </div>
                            <div className="h-32 bg-slate-800/50 rounded-xl mb-4 w-full flex flex-col items-center justify-center text-slate-500 gap-2">
                                <FileText size={32} />
                                <span className="text-xs">Preview Unavailable</span>
                            </div>
                            <h3 className="font-bold text-lg text-white mb-1 truncate">{note.title}</h3>
                            <p className="text-sm text-slate-400 mb-4">{note.university_name || 'Unknown Uni'} • {note.username || 'Unknown Author'}</p>

                            <div className="grid grid-cols-3 gap-2 mt-auto">
                                <button
                                    onClick={() => navigate(`/notes/view/${note.id}`)}
                                    className="flex items-center justify-center py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="View"
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    onClick={() => handleApprove(note.id)}
                                    className="flex items-center justify-center py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors" title="Approve">
                                    <Check size={16} />
                                </button>
                                <button
                                    onClick={() => handleReject(note.id)}
                                    className="flex items-center justify-center py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Reject">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {displayedNotes.length === 0 && <div className="col-span-full text-center text-slate-500 py-10">No notes found.</div>}
                </div>
            ) : (
                <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-medium">Title</th>
                                <th className="p-4 font-medium">Author</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {displayedNotes.map(note => (
                                <tr key={note.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{note.title}</td>
                                    <td className="p-4 text-slate-400">{note.username}</td>
                                    <td className="p-4 text-slate-500">{new Date(note.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(note.approval_status)} capitalize`}>
                                            {note.approval_status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/notes/view/${note.id}`)}
                                                className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => handleApprove(note.id)} className="p-1.5 hover:bg-green-500/20 rounded text-green-500/50 hover:text-green-400"><Check size={16} /></button>
                                            <button onClick={() => handleReject(note.id)} className="p-1.5 hover:bg-red-500/20 rounded text-red-500/50 hover:text-red-400"><X size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {displayedNotes.length === 0 && <div className="p-8 text-center text-slate-500">No notes found.</div>}
                </div>
            )}
        </div>
    );
};

export default AdminApprovals;
