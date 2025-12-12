import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, Clock, CheckCircle, AlertCircle, Sparkles, HelpCircle, FileText, ChevronRight, Hash } from 'lucide-react';
import Button from '../components/ui/Button';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const CATEGORIES = [
    { id: 'feature', label: 'Feature Request', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'bug', label: 'Bug Report', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    { id: 'improvement', label: 'Improvement', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'ui', label: 'UI/UX Suggestion', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' }
];

export default function SuggestImprovement() {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('feature');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [showRightPanel, setShowRightPanel] = useState(true);

    const fetchHistory = useCallback(async () => {
        try {
            const response = await api.get('/suggestions/my-history');
            setHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch suggestion history:", error);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        setFeedback('');
        try {
            await api.post('/suggestions', { message: `[${CATEGORIES.find(c => c.id === category)?.label}] ${message}` });
            setMessage('');
            setCategory('feature');
            setFeedback('success');
            setTimeout(() => setFeedback(''), 3000);
            fetchHistory();
        } catch (error) {
            setFeedback('error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'replied': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'reviewed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-inter p-6 lg:p-12 animate-fade-in relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Main Content */}
                <div className="flex-1 space-y-8">

                    {/* Header */}
                    <div className="relative">
                        <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-teal-400 to-purple-500 rounded-full opacity-50"></div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                            Suggest an <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">Improvement</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl">
                            We value your feedback. Tell us how we can make OriNotes better for everyone.
                        </p>
                    </div>

                    {/* Feedback Input Card */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">

                            <form onSubmit={handleSubmit}>
                                {/* Tag Selector */}
                                <div className="mb-6 flex flex-wrap gap-3">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setCategory(cat.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 flex items-center gap-2
                                                ${category === cat.id
                                                    ? `${cat.color} shadow-lg shadow-purple-500/10 ring-1 ring-white/20`
                                                    : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
                                                }`}
                                        >
                                            <Hash size={14} />
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Input Area */}
                                <div className="relative mb-6">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                                        placeholder="Share your idea, bug report, or feature request..."
                                        className="w-full h-48 bg-slate-950/50 border border-white/5 rounded-xl p-5 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all resize-none custom-scrollbar"
                                    />
                                    <div className="absolute bottom-3 right-4 text-xs font-medium text-slate-500">
                                        <span className={message.length > 450 ? 'text-orange-400' : ''}>{message.length}</span>/500
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        {feedback === 'success' && <span className="text-green-400 flex items-center gap-1 animate-fadeIn"><CheckCircle size={16} /> Sent successfully!</span>}
                                        {feedback === 'error' && <span className="text-red-400 flex items-center gap-1 animate-fadeIn"><AlertCircle size={16} /> Failed to send.</span>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || !message.trim()}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-purple-600/20 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-purple-600/40 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {loading ? <span className="animate-spin">⌛</span> : <Send size={18} />}
                                        Send Feedback
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* History Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Clock size={24} className="text-teal-400" />
                            Your Previous Suggestions
                        </h2>

                        <div className="space-y-4">
                            {history.length > 0 ? (
                                history.map(item => (
                                    <div key={item.id} className="group bg-slate-900/50 border border-white/5 rounded-xl p-5 hover:bg-slate-800/50 hover:border-white/10 transition-all duration-300">
                                        <div className="flex justify-between items-start gap-4 mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-slate-800 rounded-lg text-teal-400 group-hover:text-white group-hover:bg-teal-500 transition-colors">
                                                    <MessageSquare size={18} />
                                                </div>
                                                <span className="text-sm text-slate-500">{formatDate(item.created_at)}</span>
                                            </div>
                                            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(item.status || 'pending')}`}>
                                                {item.status === 'replied' ? 'Replied' : 'Pending'}
                                            </div>
                                        </div>

                                        <p className="text-slate-300 text-base leading-relaxed mb-4 group-hover:text-white transition-colors">
                                            {item.message}
                                        </p>

                                        {item.admin_reply && (
                                            <div className="mt-4 pl-4 border-l-2 border-purple-500/50 bg-purple-500/5 rounded-r-lg p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Sparkles size={14} className="text-purple-400" />
                                                    <span className="text-xs font-bold text-purple-300 uppercase">Admin Reply</span>
                                                </div>
                                                <p className="text-slate-300 text-sm">{item.admin_reply}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                                        <FileText size={32} />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-1">No suggestions yet</h3>
                                    <p className="text-slate-500">Your feedback history will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel (Optional Enhancement) */}
                {showRightPanel && (
                    <div className="hidden xl:block w-80 space-y-6 shrink-0">
                        {/* Box 1: Info */}
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <HelpCircle size={18} className="text-cyan-400" />
                                How it works
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-slate-400">
                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white shrink-0">1</div>
                                    <p>Submit your bug report, idea, or feedback.</p>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-400">
                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white shrink-0">2</div>
                                    <p>Our team reviews every suggestion daily.</p>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-400">
                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white shrink-0">3</div>
                                    <p>You get an update if we plan to implement it.</p>
                                </li>
                            </ul>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
