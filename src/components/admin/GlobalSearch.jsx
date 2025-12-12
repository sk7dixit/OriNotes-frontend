import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, FileText, Flag, Settings, ChevronRight, Hash, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function GlobalSearch({ setActiveTab }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ users: [], notes: [], reports: [], settings: [] });
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    // Command Palette "Settings" Shortcuts (Static)
    const settingsCommands = [
        { id: 'security', label: 'Security & 2FA', keywords: ['2fa', 'security', 'password'], tab: 'settings' },
        { id: 'roles', label: 'Manage Roles', keywords: ['role', 'admin', 'user'], tab: 'users' },
        { id: 'payments', label: 'Subscriptions & Payments', keywords: ['payment', 'subscription', 'plan', 'revenue'], tab: 'overview' }, // Could be its own tab if we had one
        { id: 'notifications', label: 'Notification Settings', keywords: ['email', 'notify', 'template'], tab: 'settings' },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length < 2) {
                setResults({ users: [], notes: [], reports: [], settings: [] });
                return;
            }

            setLoading(true);
            try {
                // Parallel search: 1. API for data, 2. Local filter for settings
                const settingsMatches = settingsCommands.filter(cmd =>
                    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
                    cmd.keywords.some(k => k.includes(query.toLowerCase()))
                );

                const res = await api.get(`/admin/search?q=${query}`);

                setResults({
                    users: res.data.users,
                    notes: res.data.notes,
                    reports: res.data.reports,
                    settings: settingsMatches
                });
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelect = (type, item) => {
        setIsOpen(false);
        setQuery('');

        if (type === 'user') {
            // Navigate to public profile
            navigate(`/profile/${item.id}`);
        } else if (type === 'note') {
            // In future, open note details modal or page
            setActiveTab('notes');
        } else if (type === 'report') {
            setActiveTab('approvals');
        } else if (type === 'setting') {
            setActiveTab(item.tab);
            if (item.tab === 'settings') {
                navigate('/admin-settings'); // If it's a separate page
            }
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md hidden md:block group z-50">
            {/* Search Input */}
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300 border ${isOpen ? 'bg-slate-800 border-purple-500/50 shadow-lg shadow-purple-900/20' : 'bg-slate-800/50 border-white/5 hover:bg-slate-800 hover:border-white/10'}`}>
                <Search size={18} className={`${isOpen ? 'text-purple-400' : 'text-slate-400'}`} />
                <input
                    type="text"
                    placeholder="Search users, notes, commands..."
                    className="bg-transparent border-none outline-none text-sm text-slate-200 w-full placeholder:text-slate-500"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isOpen && e.target.value.length > 0) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                {query && (
                    <button onClick={() => { setQuery(''); setResults({ users: [], notes: [], reports: [], settings: [] }); }} className="text-slate-500 hover:text-white">
                        <X size={14} />
                    </button>
                )}
                {/* Visual Hint */}
                <span className="hidden lg:block text-[10px] items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-slate-500 font-mono">
                    ⌘K
                </span>
            </div>

            {/* Dropdown Results Panel */}
            {isOpen && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-[#0F131E] border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                    {loading && (
                        <div className="p-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
                            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            Searching...
                        </div>
                    )}

                    {!loading &&
                        results.users.length === 0 &&
                        results.notes.length === 0 &&
                        results.reports.length === 0 &&
                        results.settings.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-slate-500 text-sm">No results found for "{query}"</p>
                            </div>
                        )}

                    <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

                        {/* 1. Settings / Commands */}
                        {results.settings.length > 0 && (
                            <div className="py-2">
                                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                    <Settings size={10} /> Commands & Settings
                                </div>
                                {results.settings.map(item => (
                                    <button key={item.id} onClick={() => handleSelect('setting', item)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center justify-between group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700">
                                                <Hash size={14} />
                                            </div>
                                            <span className="text-sm text-slate-300 group-hover:text-white font-medium">{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">Jump to</span>
                                            <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* 2. Users */}
                        {results.users.length > 0 && (
                            <div className="py-2 border-t border-white/5">
                                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                    <User size={10} /> Users
                                </div>
                                {results.users.map(user => (
                                    <button key={user.id} onClick={() => handleSelect('user', user)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center justify-between group transition-colors">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar or Initials */}
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                                {user.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm text-slate-200 font-medium group-hover:text-white">{user.name || user.username}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                            {user.role}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* 3. Notes */}
                        {results.notes.length > 0 && (
                            <div className="py-2 border-t border-white/5">
                                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                    <FileText size={10} /> Notes & Materials
                                </div>
                                {results.notes.map(note => (
                                    <button key={note.id} onClick={() => handleSelect('note', note)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center justify-between group transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 shrink-0">
                                                <FileText size={14} />
                                            </div>
                                            <div className="text-left min-w-0">
                                                <p className="text-sm text-slate-200 font-medium truncate group-hover:text-white">{note.title}</p>
                                                <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                                                    <Building size={10} /> {note.university_name || 'Personal'} • {note.subject || 'General'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border ${note.approval_status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            note.approval_status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            {note.approval_status}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* 4. Reports */}
                        {results.reports.length > 0 && (
                            <div className="py-2 border-t border-white/5">
                                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                    <Flag size={10} /> Reports & Violations
                                </div>
                                {results.reports.map(report => (
                                    <button key={report.id} onClick={() => handleSelect('report', report)} className="w-full px-4 py-2.5 hover:bg-white/5 flex items-center justify-between group transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-1.5 rounded-md bg-red-500/10 text-red-400 shrink-0">
                                                <Flag size={14} />
                                            </div>
                                            <div className="text-left min-w-0">
                                                <p className="text-sm text-red-300 font-medium truncate group-hover:text-red-200">{report.reason}</p>
                                                <p className="text-[10px] text-slate-500 truncate">On note: {report.note_title}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-500">Go to Review</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Enter to Select Hint */}
                    <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                        <span>Type 2+ chars to search</span>
                        <span>ESC to close</span>
                    </div>

                </div>
            )}
        </div>
    );
}
