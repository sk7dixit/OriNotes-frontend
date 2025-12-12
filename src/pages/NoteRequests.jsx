import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Check, X, Eye, User, Calendar, FileText, Inbox } from 'lucide-react';

const RequestCard = ({ request, onAction }) => (
  <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 transition-all hover:bg-gray-800/60 hover:border-gray-600 group">
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

      {/* User & Note Info */}
      <div className="flex items-start gap-4 flex-1">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
          {request.requester_name ? request.requester_name.charAt(0) : <User size={20} />}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white text-lg">{request.requester_name || request.requester_username}</h3>
            <span className="text-gray-500 text-sm">@{request.requester_username}</span>
          </div>

          <div className="text-gray-300 text-sm mb-3">
            Requested access to <span className="text-cyan-400 font-medium font-mono bg-cyan-900/20 px-1.5 py-0.5 rounded">{request.note_title}</span>
            <span className="mx-2 text-gray-600">•</span>
            <span className="text-gray-500">{request.note_subject}</span>
          </div>

          {/* Message if available */}
          <div className="bg-gray-900/50 p-3 rounded-xl text-gray-400 text-sm italic border-l-2 border-gray-700">
            "Hi, I'd love to check out your notes for my upcoming exam. Thanks!"
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(request.created_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><FileText size={12} /> {request.file_type || 'Note'}</span>
          </div>
        </div>
      </div>

      {/* Actions or Status */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {request.status === 'pending' ? (
          <>
            <button
              onClick={() => onAction(request.id, 'approved')}
              className="flex-1 md:flex-none bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} /> Approve
            </button>
            <button
              onClick={() => onAction(request.id, 'rejected')}
              className="flex-1 md:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} /> Reject
            </button>
          </>
        ) : (
          <div className={`px-4 py-2 rounded-xl border font-medium flex items-center gap-2 ${request.status === 'approved'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
            {request.status === 'approved' ? <Check size={18} /> : <X size={18} />}
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </div>
        )}
        <button className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" title="View Note Profile">
          <Eye size={20} />
        </button>
      </div>

    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="bg-gray-800/50 p-6 rounded-full mb-6 border border-dashed border-gray-700">
      <Inbox size={48} className="text-gray-500" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">No access requests right now</h3>
    <p className="text-gray-400 max-w-sm mx-auto">
      When other students request access to your private notes, they will appear here.
    </p>
  </div>
);

function NoteRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, history

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notes/access/requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, action) => {
    try {
      // Optimistic UI update - Update status instead of removing
      setRequests(current => current.map(req =>
        req.id === requestId ? { ...req, status: action } : req
      ));

      await api.put(`/notes/access/respond/${requestId}`, { status: action });
    } catch (err) {
      alert(`Failed to ${action} request.`);
      fetchRequests(); // Revert on failure
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
      <div className="animate-pulse text-cyan-500 font-medium">Loading requests...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 font-inter p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Access Requests</h1>
            <p className="text-gray-400">Manage permissions for your private notes.</p>
          </div>

          <div className="flex items-center gap-2 bg-gray-800/50 p-1 rounded-xl border border-gray-700">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'pending' ? 'bg-cyan-500/20 text-cyan-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'history' ? 'bg-cyan-500/20 text-cyan-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              History
            </button>
          </div>
        </header>

        {requests.filter(req => filter === 'pending' ? req.status === 'pending' : req.status !== 'pending').length > 0 ? (
          <div className="space-y-4">
            {requests.filter(req => filter === 'pending' ? req.status === 'pending' : req.status !== 'pending').map(req => (
              <RequestCard key={req.id} request={req} onAction={handleResponse} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export default NoteRequests;