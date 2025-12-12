import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BrowseNotesPage from './BrowseNotesPage';
import FilterBar from '../components/FilterBar';
import { Filter, X, Search, Zap, Clock, TrendingUp } from 'lucide-react';
import NoteCard from '../components/ui/NoteCard';
import Skeleton from '../components/ui/Skeleton';

// Custom debounce
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const INITIAL_SORT = 'newest';
const DEBOUNCE_DELAY = 500;

const groupNotesByInstitution = (notes) => {
  if (!notes) return {};
  return notes.reduce((acc, note) => {
    const institution = note.university_name || note.institution_name || 'Personal / Unclassified';
    if (!acc[institution]) acc[institution] = [];
    acc[institution].push(note);
    return acc;
  }, {});
};

export default function Notes() {
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({ sort: INITIAL_SORT });
  const [overflowVisible, setOverflowVisible] = useState(false);
  const [activeTag, setActiveTag] = useState('All');

  const navigate = useNavigate();
  const { user } = useAuth(); // eslint-disable-line no-unused-vars

  // Overflow handling for filter animation
  useEffect(() => {
    let timer;
    if (showFilters) {
      timer = setTimeout(() => setOverflowVisible(true), 500);
    } else {
      setOverflowVisible(false);
    }
    return () => clearTimeout(timer);
  }, [showFilters]);

  const groupedNotes = groupNotesByInstitution(notes || []);
  const isFilterActive = Object.keys(currentFilters).some(key => key !== 'sort' && currentFilters[key]);

  const fetchNotes = useCallback(async (filters) => {
    setLoading(true);
    setError('');
    setCurrentFilters(filters);

    const params = Object.keys(filters).reduce((acc, key) => {
      if (filters[key]) acc[key] = filters[key];
      return acc;
    }, {});

    try {
      const res = await api.get('/notes/filtered', { params });
      setNotes(res.data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes.');
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(debounce((q) => {
    fetchNotes({ ...currentFilters, q });
  }, DEBOUNCE_DELAY), [currentFilters, fetchNotes]);

  // Initial Load
  useEffect(() => {
    if (notes === null && !loading && !searchQuery) {
      fetchNotes({ sort: INITIAL_SORT });
    }
  }, [fetchNotes, notes, loading, searchQuery]);

  // Search Handler
  useEffect(() => {
    if (searchQuery.length > 2) {
      debouncedFetch(searchQuery);
    } else if (searchQuery.length === 0 && notes !== null) {
      fetchNotes(currentFilters);
    }
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdvancedSearch = (filters) => {
    setShowFilters(false);
    const newFilters = { ...currentFilters, ...filters, material_type: 'university' };
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] === '' || newFilters[key] === null) delete newFilters[key];
    });
    fetchNotes(newFilters);
  };

  const handleResetFlow = () => {
    setShowFilters(false);
    setSearchQuery('');
    setActiveTag('All');
    fetchNotes({ sort: INITIAL_SORT });
  };

  const filterCount = Object.keys(currentFilters).filter(key => key !== 'sort' && currentFilters[key]).length;

  const smartTags = [
    { name: 'All', icon: null },
    { name: 'Most Popular', icon: TrendingUp, sort: 'popular' },
    { name: 'Recently Added', icon: Clock, sort: 'newest' },
    { name: 'Trending', icon: Zap, sort: 'trending' },
  ];

  const handleTagClick = (tag) => {
    setActiveTag(tag.name);
    if (tag.sort) {
      fetchNotes({ ...currentFilters, sort: tag.sort });
    } else {
      fetchNotes({ sort: INITIAL_SORT });
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in-up pb-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Browse Notes</h1>
          <p className="text-slate-400">Discover study materials from top universities.</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur transition-opacity duration-500 ${searchQuery ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></div>
          <input
            type="text"
            placeholder="Search by title, subject, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full glass-input pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        </div>
      </div>

      {/* Smart Tags & Filter Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          {smartTags.map(tag => (
            <button
              key={tag.name}
              onClick={() => handleTagClick(tag)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                        ${activeTag === tag.name
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5'
                }`}
            >
              {tag.icon && <tag.icon size={14} />}
              {tag.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-5 py-2 rounded-xl font-medium transition-all flex items-center gap-2 border whitespace-nowrap
                 ${showFilters
              ? 'bg-slate-700 text-white border-slate-600'
              : 'bg-slate-800/50 text-slate-300 border-white/5 hover:bg-slate-700'}`}
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Hide Filters' : 'Filters'}
          {filterCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] text-white ml-1">{filterCount}</span>}
        </button>
      </div>

      {/* Advanced Filter Panel */}
      <div className={`transition-all duration-500 ease-in-out relative z-30 ${showFilters ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'}`}>
        <div className="glass-panel p-1 rounded-2xl">
          <FilterBar
            currentFilters={currentFilters}
            onFilterChange={handleAdvancedSearch}
            onClearFilters={handleResetFlow}
          />
        </div>
      </div>

      {/* Results Content */}
      <div className="space-y-10 min-h-[400px]">
        {loading ? (
          // Skeleton Loading
          <div className="space-y-8">
            {[1, 2].map(grp => (
              <div key={grp} className="space-y-4">
                <Skeleton className="w-48 h-8" />
                <div className="flex gap-6 overflow-hidden">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="min-w-[280px] h-64 rounded-2xl" />)}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-400 mb-4"><X size={32} /></div>
            <p className="text-slate-300 mb-2">{error}</p>
            <button onClick={() => fetchNotes({ sort: INITIAL_SORT })} className="text-indigo-400 hover:underline">Try Reloading</button>
          </div>
        ) : notes && notes.length > 0 ? (
          Object.entries(groupedNotes).map(([institution, institutionNotes]) => (
            <div key={institution} className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-indigo-500 block"></span>
                  {institution}
                </h3>
                <button className="text-xs font-semibold text-slate-500 hover:text-white uppercase tracking-wider transition-colors">View All</button>
              </div>

              {/* Horizontal Carousel Container */}
              <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x">
                {institutionNotes.map(note => (
                  <div key={note.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                    <NoteCard
                      note={note}
                      onClick={() => { navigate(`/notes/view/${note.id}`) }}
                      user={user} // Pass user/auth info if needed for access checks logic inside card
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 glass-panel border-dashed">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No notes found</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">We couldn't find any notes matching your search. Try adjusting your filters or keywords.</p>
            <button onClick={handleResetFlow} className="btn-primary">Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}