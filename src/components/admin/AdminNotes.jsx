import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List as ListIcon, MoreHorizontal, Eye, Trash2, FileText } from 'lucide-react';
import api from '../../services/api';

const AdminNotes = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('table'); // Default to table for library
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/all-notes');
            setNotes(res.data);
        } catch (err) {
            console.error("Failed to fetch notes", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (noteId) => {
        if (!confirm("Permanently delete this note?")) return;
        try {
            await api.delete(`/notes/${noteId}`);
            setNotes(prev => prev.filter(n => n.id !== noteId));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete note. It may have been already deleted or you don't have permission.");
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.university_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Notes Library
                </h2>
                <p className="text-slate-400 mt-1">Browse and manage the entire notes repository.</p>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search library..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                </div>

                <div className="flex gap-4">
                    {/* View Mode Toggle */}
                    <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex">
                        <button onClick={() => setViewMode('card')} className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
                            <LayoutGrid size={18} />
                        </button>
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
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
                    {filteredNotes.map(note => (
                        <div key={note.id} className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-purple-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-slate-800 rounded-lg text-purple-400">
                                    <FileText size={20} />
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide
                                    ${note.approval_status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-slate-700/50 text-slate-400'}
                                `}>
                                    {note.approval_status}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg text-white mb-1 truncate">{note.title}</h3>
                            <p className="text-sm text-slate-400 mb-4">{note.university_name || 'Unknown Uni'} • {note.username}</p>

                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <button
                                    onClick={() => navigate(`/notes/view/${note.id}`)}
                                    className="flex items-center justify-center py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="View"
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="flex items-center justify-center py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 font-medium">Title</th>
                                <th className="p-4 font-medium">Author</th>
                                <th className="p-4 font-medium">University</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredNotes.map(note => (
                                <tr key={note.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className="text-purple-400" />
                                            {note.title}
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-400">{note.username}</td>
                                    <td className="p-4 text-slate-400">{note.university_name}</td>
                                    <td className="p-4 text-slate-500">{new Date(note.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-xs capitalize ${note.approval_status === 'approved' ? 'text-green-400 bg-green-500/10' : 'text-slate-400 bg-slate-800'
                                            }`}>
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
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="p-1.5 hover:bg-red-500/20 rounded text-red-500/50 hover:text-red-400">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredNotes.length === 0 && <div className="p-8 text-center text-slate-500">No notes found matching your search.</div>}
                </div>
            )}
        </div>
    );
};

export default AdminNotes;
