import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { MessageSquare, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

// Helper function
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

export default function AdminFeedback() {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAllSuggestions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/feedback');
            setSuggestions(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load feedback.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllSuggestions();
    }, [fetchAllSuggestions]);

    const handleMarkRead = async (id) => {
        try {
            await api.put(`/admin/feedback/${id}/read`);
            fetchAllSuggestions();
        } catch (error) {
            alert('Failed to mark as read.');
        }
    };

    if (loading && suggestions.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mr-3"></div>
                Loading feedback...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-400">
                <AlertCircle size={32} className="mb-2" />
                <p>{error}</p>
                <Button onClick={fetchAllSuggestions} variant="secondary" className="mt-4">Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Contact Messages</h1>
                    <p className="text-gray-400">Review messages from users.</p>
                </div>
                <Button onClick={fetchAllSuggestions} variant="secondary" className="flex items-center gap-2">
                    <RefreshCw size={16} /> Refresh
                </Button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {suggestions.length === 0 ? (
                    <div className="bg-slate-900/50 rounded-2xl p-12 text-center text-gray-500 border border-white/5">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No messages received yet.</p>
                    </div>
                ) : (
                    suggestions.map(s => (
                        <div key={s.id} className={`bg-slate-900/50 backdrop-blur-md border rounded-2xl p-6 transition-all hover:border-white/10 ${s.status === 'new' ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-white/5'}`}>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-white">{s.name}</span>
                                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{s.email}</span>
                                        <span className="text-xs text-slate-600">• {formatDate(s.created_at)}</span>
                                        {s.status === 'new' && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">New</span>}
                                    </div>
                                    <p className="text-slate-300 text-lg leading-relaxed mb-4">"{s.message}"</p>
                                </div>

                                {s.status === 'new' && (
                                    <Button
                                        onClick={() => handleMarkRead(s.id)}
                                        variant="outline"
                                        className="shrink-0 flex items-center gap-2 text-xs"
                                    >
                                        <CheckCircle size={14} /> Mark Read
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
