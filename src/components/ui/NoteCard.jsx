import React from 'react';
import { Eye, User, Clock, Star } from 'lucide-react';

const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
};

const NoteCard = ({ note, onClick, showProgress = false, progressValue = 0 }) => {
    return (
        <div
            onClick={onClick}
            className="group glass-card relative overflow-hidden cursor-pointer"
        >
            {/* Thumbnail / Preview Area */}
            <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />

                <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-bold text-4xl opacity-20 group-hover:scale-110 transition-transform duration-500 select-none">
                    PDF
                </div>

                {/* Badges / Subject */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/10 shadow-sm">
                        {note.subject || 'General'}
                    </span>
                    {note.isPopular && (
                        <span className="px-2.5 py-1 bg-amber-500/20 backdrop-blur-md rounded-lg text-xs font-medium text-amber-300 border border-amber-500/20 shadow-sm flex items-center gap-1">
                            <Star size={10} fill="currentColor" /> Popular
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="mb-3">
                    <h3 className="text-white font-semibold text-lg line-clamp-1 group-hover:text-green-400 transition-colors">
                        {note.title || 'Untitled Note'}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">{note.university_name || 'University'}</p>
                </div>

                {/* Progress Bar (Optional) */}
                {showProgress && (
                    <div className="mb-4">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 uppercase font-medium tracking-wide">
                            <span>Progress</span>
                            <span>{progressValue}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressValue}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5" title="Views">
                            <Eye size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                            <span>{note.view_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Uploaded">
                            <Clock size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                            <span>{formatTimeAgo(note.created_at)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold border border-white/10 ring-2 ring-slate-900">
                            {note.username ? note.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-xs text-slate-400 max-w-[80px] truncate">{note.username || 'User'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
