import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter, Calendar, User, Download, Eye, Heart, Share2, Grid, List } from 'lucide-react';
import api from '../services/api';

// --- Shared Note Card Component ---
const SharedNoteCard = ({ note, onNavigate }) => {
  const getFileIcon = (type) => {
    return <FileText className="w-5 h-5 text-red-400" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group flex flex-col h-full">
      {/* Thumbnail Area */}
      <div className="h-40 bg-gray-900/50 relative p-4 flex items-center justify-center group-hover:bg-gray-900/70 transition-colors cursor-pointer" onClick={() => onNavigate(`/notes/view/${note.id}`)}>
        <div className="w-16 h-20 bg-white/10 rounded shadow-sm flex items-center justify-center">
          {getFileIcon(note.material_type)}
        </div>

        {/* File Format Badge */}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-300 border border-white/10 flex items-center gap-1">
          <span className="uppercase">PDF</span>
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(`/notes/view/${note.id}`); }}
            className="p-2 bg-white/10 hover:bg-cyan-500 rounded-lg text-white transition-colors"
            title="View Note"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-auto">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors" onClick={() => onNavigate(`/notes/view/${note.id}`)}>{note.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-1 mb-3">{note.subject} • {note.university_name || 'General'}</p>
        </div>

        {/* Shared By Info */}
        <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white uppercase ring-2 ring-gray-800">
              {note.owner_avatar ? <img src={note.owner_avatar} alt={note.owner_username} className="w-full h-full rounded-full object-cover" /> : note.owner_username?.substring(0, 2) || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Shared by</span>
              <span className="text-xs font-medium text-gray-200">{note.owner_username || 'Unknown'}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 flex flex-col items-end">
            <span>{formatDate(note.shared_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Shared Note List Item ---
const SharedNoteListItem = ({ note, onNavigate }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      onClick={() => onNavigate(`/notes/view/${note.id}`)}
      className="group flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl hover:bg-gray-800/60 hover:border-cyan-500/30 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center text-red-400 shrink-0">
          <FileText size={20} />
        </div>
        <div className="min-w-0">
          <h4 className="text-white font-medium truncate group-hover:text-cyan-400 transition-colors">{note.title}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{note.subject}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>{note.university_name || 'General'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-400 mx-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            {note.owner_avatar ? <img src={note.owner_avatar} alt="" className="w-full h-full rounded-full object-cover" /> : note.owner_username?.substring(0, 2) || 'U'}
          </div>
          <span className="text-xs hidden md:block">{note.owner_username}</span>
        </div>
        <span className="w-24 text-right hidden lg:block">{formatDate(note.shared_at)}</span>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pl-2">
        <button className="p-2 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 rounded-lg">
          <Eye size={18} />
        </button>
      </div>
    </div>
  );
};

// --- Empty State Component ---
const EmptyState = ({ onNavigate }) => (
  <div className="flex flex-col items-center justify-center py-20 bg-gray-800/30 border border-dashed border-gray-700 rounded-3xl">
    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-black/20">
      <Share2 className="w-10 h-10 text-cyan-400 opacity-80" />
    </div>
    <h2 className="text-2xl font-bold text-gray-200 mb-2">Nothing has been shared with you yet</h2>
    <p className="text-gray-500 mb-8 max-w-md text-center">Notes shared by other students or professors will appear here securely.</p>
    <button
      onClick={() => onNavigate('/notes')}
      className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
    >
      <Search className="w-4 h-4" />
      Explore Public Notes
    </button>
  </div>
);

function SharedWithMe() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'alpha'
  const [filterUser, setFilterUser] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'

  const navigate = useNavigate();

  useEffect(() => {
    fetchSharedNotes();
  }, []);

  const fetchSharedNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notes/shared-with-me');
      setNotes(response.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load notes shared with you.');
    } finally {
      setLoading(false);
    }
  };

  // --- Filtering & Sorting Logic ---
  const uniqueSharers = useMemo(() => {
    const sharers = notes.map(n => n.owner_username).filter(Boolean);
    return [...new Set(sharers)];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by User
    if (filterUser !== 'all') {
      result = result.filter(n => n.owner_username === filterUser);
    }

    // Local Search
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(lowerQ) ||
        (n.subject && n.subject.toLowerCase().includes(lowerQ)) ||
        (n.owner_username && n.owner_username.toLowerCase().includes(lowerQ))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.shared_at) - new Date(a.shared_at);
      if (sortBy === 'oldest') return new Date(a.shared_at) - new Date(b.shared_at);
      if (sortBy === 'alpha') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [notes, searchQuery, sortBy, filterUser]);


  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center flex-col">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchSharedNotes} className="px-4 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700">Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 p-6 md:p-10 space-y-8">

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Share2 className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Shared With Me</h1>
          </div>
          <p className="text-gray-400 pl-1">Notes and resources other users have shared directly with you.</p>
        </div>
      </div>

      {/* --- Filter & Search Bar --- */}
      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-[#0A0A0C]/95 backdrop-blur-sm py-4 -my-4 px-2 -mx-2">
        {/* Search */}
        <div className="relative w-full xl:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-700 rounded-xl leading-5 bg-gray-900/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-900 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 sm:text-sm transition-all shadow-sm"
            placeholder="Search shared notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Action / Sort Chips */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
          {/* User Filter */}
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="bg-gray-800 text-sm text-gray-300 border-none rounded-xl py-2 px-4 focus:ring-1 focus:ring-cyan-500 cursor-pointer w-full md:w-auto"
          >
            <option value="all">All Sharers</option>
            {uniqueSharers.map(u => <option key={u} value={u}>{u}</option>)}
          </select>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            {/* Sort Dropdown (Simplified as chips for now) */}
            <div className="flex p-1 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${sortBy === 'newest' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy('oldest')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${sortBy === 'oldest' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                Oldest
              </button>
              <button
                onClick={() => setSortBy('alpha')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${sortBy === 'alpha' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                A-Z
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex p-1 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-700 text-cyan-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-700 text-cyan-400 shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Content Grid --- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-gray-800/50 rounded-2xl"></div>
          ))}
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
          {filteredNotes.map(note => (
            viewMode === 'grid' ? (
              <SharedNoteCard
                key={note.id}
                note={note}
                onNavigate={navigate}
              />
            ) : (
              <SharedNoteListItem
                key={note.id}
                note={note}
                onNavigate={navigate}
              />
            )
          ))}
        </div>
      ) : (
        <EmptyState onNavigate={navigate} />
      )}
    </div>
  );
}

export default SharedWithMe;