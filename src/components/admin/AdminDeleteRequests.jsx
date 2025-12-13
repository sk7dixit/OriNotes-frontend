
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Trash2, AlertTriangle, CheckCircle, XCircle, RefreshCw, FileText } from 'lucide-react';
import Button from '../ui/Button';

export default function AdminDeleteRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/notes/admin/delete-requests');
            setRequests(response.data);
            setError('');
        } catch (err) {
            console.error("Fetch requests failed", err);
            setError('Failed to load deletion requests.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;

        try {
            await api.put(`/notes/admin/delete-requests/${id}`, { action });
            // Remove from list
            setRequests(prev => prev.filter(r => r.id !== id));
            alert(action === 'approve' ? 'Note deleted.' : 'Request rejected.');
        } catch (err) {
            console.error(`Failed to ${action}`, err);
            alert(`Failed to ${action} request.`);
        }
    };

    if (loading && requests.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mr-3"></div>
                Loading requests...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-400">
                <AlertTriangle size={32} className="mb-2" />
                <p>{error}</p>
                <Button onClick={fetchRequests} variant="secondary" className="mt-4">Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Deletion Requests</h1>
                    <p className="text-gray-400">Review requests from users to delete their notes.</p>
                </div>
                <Button onClick={fetchRequests} variant="secondary" className="flex items-center gap-2">
                    <RefreshCw size={16} /> Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {requests.length === 0 ? (
                    <div className="bg-slate-900/50 rounded-2xl p-12 text-center text-gray-500 border border-white/5">
                        <Trash2 size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No pending deletion requests.</p>
                    </div>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className="bg-slate-900/50 backdrop-blur-md border border-red-500/20 rounded-2xl p-6 transition-all hover:border-red-500/40">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText size={16} className="text-slate-400" />
                                        <span className="font-bold text-white text-lg">{req.title}</span>
                                        <span className="text-xs text-slate-500">ID: {req.id}</span>
                                    </div>
                                    <p className="text-sm text-slate-300 mb-2">
                                        Requested by <span className="text-cyan-400">{req.username}</span> on {new Date(req.created_at).toLocaleDateString()}
                                    </p>
                                    <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/10 text-red-200 text-sm">
                                        <span className="font-semibold text-red-400 block mb-1">Reason:</span>
                                        "{req.deletion_reason || 'No reason provided'}"
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <Button
                                        onClick={() => handleAction(req.id, 'reject')}
                                        variant="secondary"
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-300"
                                    >
                                        <XCircle size={16} className="mr-2" /> Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleAction(req.id, 'approve')}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        <CheckCircle size={16} className="mr-2" /> Approve Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
