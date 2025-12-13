import React from 'react';
import { Eye, Calendar, Download, Heart, Users, FileText, School, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoteCard = ({ note, isFavourite, onToggleFavourite, user }) => {
    // Format date relative or short
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    };

    // Determine badge color based on type
    const getTypeColor = (type) => {
        if (type === 'university_material') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    };

    return (
        <div className="group relative bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full animate-fade-in-up">

            {/* Thumbnail Area */}
            <div className="relative h-48 bg-slate-900 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />

                {/* Random or Category-based Placeholder Pattern */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-slate-900" />

                {/* University/Course content centered */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0">
                    <School className="text-white/10 mb-2" size={48} />
                    <span className="text-white/20 font-bold text-xl uppercase tracking-widest">{note.course || 'General'}</span>
                </div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 z-20 flex gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md uppercase tracking-wider ${getTypeColor(note.material_type)}`}>
                        {note.material_type === 'university_material' ? 'University' : 'Personal'}
                    </span>
                    {note.is_free && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md bg-emerald-500/20 text-emerald-300 border-emerald-500/30 uppercase tracking-wider">
                            Free
                        </span>
                    )}
                </div>

                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleFavourite(note.id);
                    }}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${isFavourite
                        ? 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30'
                        : 'bg-black/30 text-white/70 hover:bg-black/50 hover:text-white'
                        }`}
                >
                    <Heart size={18} fill={isFavourite ? "currentColor" : "none"} />
                </button>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col relative z-20 -mt-10">
                {/* Card Main Info */}
                <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg mb-auto">
                    <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight mb-2 group-hover:text-indigo-400 transition-colors">
                        {note.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <BookOpen size={14} className="text-indigo-400" />
                        <span className="truncate max-w-[150px]">{note.subject || 'Uncategorized'}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                                {note.username ? note.username.substring(0, 2).toUpperCase() : 'U'}
                            </div>
                            <span className="text-xs text-slate-300 font-medium truncate max-w-[80px]">
                                {note.username || 'Unknown'}
                            </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{formatDate(note.created_at)}</span>
                    </div>
                </div>

                {/* Stats Footer */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-1">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5" title="Views">
                            <Eye size={14} className="text-sky-400" />
                            <span>{note.view_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Views">
                            <Eye size={14} className="text-sky-400" />
                            <span>{note.view_count || 0}</span>
                        </div>
                    </div>

                    <Link
                        to={`/notes/view/${note.id}`}
                        className="flex items-center gap-1.5 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                    >
                        View Note →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
