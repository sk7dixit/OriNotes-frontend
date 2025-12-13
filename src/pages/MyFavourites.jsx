// src/pages/MyFavourites.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import NoteCard from '../components/NoteCard'; // Correct standard component
import { Heart } from 'lucide-react';

function MyFavourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchFavourites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/notes/favourites');
      setFavourites(response.data || []);
    } catch (err) {
      setError('Failed to load your favourite notes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  // Handler to remove favourite (passed down to the NoteCardDisplay, if needed)
  const handleToggleFavourite = async (noteId) => {
    try {
      // Since this is the Favourites page, a click means DELETE
      await api.delete(`/notes/favourites/${noteId}`);
      setFavourites(currentFavourites => currentFavourites.filter(note => note.id !== noteId));
    } catch (err) {
      alert('Failed to remove favourite. Please try again.');
    }
  };

  // --- RENDERING ---
  if (loading) {
    return <p className="text-center">Loading your favourites...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Favourites</h1>
          <p className="text-slate-400">Notes you have saved for quick access.</p>
        </div>
        <button
          onClick={fetchFavourites}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
        >
          Refresh List
        </button>
      </div>

      {favourites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favourites.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              isFavourite={true} // Always true on this page
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-purple-400">
            <Heart size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No favourites yet</h2>
          <p className="text-slate-400 mb-6 text-center max-w-md">
            Tap the heart icon on any note to save it here for later access.
          </p>
          <button
            onClick={() => navigate('/notes')}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/20"
          >
            Browse Notes
          </button>
        </div>
      )}
    </div>
  );
}

export default MyFavourites;