// src/pages/Notes.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { debounce } from 'lodash';
// Import the dedicated component for University search
import BrowseNotesPage from './BrowseNotesPage'; // Assuming you kept the file name BrowseNotesModal.jsx
import { courseData, subjectData } from '../services/universityData';


// =========================================================================
// 1. HELPER DATA (Simplified local data for OriNotes/Legacy Flow)
// =========================================================================
const contentData = {
  institutionTypes: ["School", "College", "Competitive Exam"],
  fields: {
    College: ["Engineering", "Medical", "Arts", "Commerce"],
    School: ["Class 12", "Class 11", "Class 10"],
    "Competitive Exam": ["UPSC", "SSC", "Banking", "Railways"]
  },
  courses: {
    Engineering: ["B.Tech", "M.Tech", "Diploma"],
    Medical: ["MBBS", "BDS", "BAMS"],
  },
  subjects: {
    "B.Tech": ["Computer Science", "Mechanical", "Civil", "Electronics"],
    "MBBS": ["Anatomy", "Physiology", "Biochemistry"],
    "Class 12": ["Physics", "Chemistry", "Maths", "Biology", "Computer Science"],
  }
};


// =========================================================================
// 2. MAIN COMPONENT LOGIC (Conditional Rendering)
// =========================================================================
function Notes() {
  const [materialType, setMaterialType] = useState(null); // 'OriNotes', 'university', or null
  const [filters, setFilters] = useState({});
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [favouriteIds, setFavouriteIds] = useState(new Set());

  const navigate = useNavigate();
  const { user } = useAuth();

  // Unified fetch function for both search types
  const fetchNotes = useCallback(async (currentFilters) => {
    setLoading(true);
    setError('');
    try {
      const params = { ...currentFilters };
      if (materialType) {
        params.material_type = materialType; // Passes 'OriNotes' or 'university'
      }

      const res = await api.get('/notes/filtered', { params });
      setNotes(res.data);
    } catch (err) {
      setError("Failed to fetch notes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [materialType]);

  const debouncedFetch = useCallback(debounce(fetchNotes, 500), [fetchNotes]);

  // Handle updates from the general search bar
  useEffect(() => {
    if (searchQuery.length > 2) {
      debouncedFetch({ q: searchQuery });
    } else if (searchQuery.length === 0) {
      // Clear search results if query is empty
      setNotes([]);
    }
  }, [searchQuery, debouncedFetch]);

  // Fetch favourites on load
  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const res = await api.get('/notes/favourites/ids');
            setFavouriteIds(new Set(res.data));
        } catch (err) {
            console.error("Could not fetch favourite IDs");
        }
    };
    fetchInitialData();
  }, []);

  const handleToggleFavourite = async (noteId) => {
      // ... (Favorite toggle logic remains the same)
      const isFavourite = favouriteIds.has(noteId);
      const newFavouriteIds = new Set(favouriteIds);
      try {
          if (isFavourite) {
              await api.delete(`/notes/favourites/${noteId}`);
              newFavouriteIds.delete(noteId);
          } else {
              await api.post(`/notes/favourites/${noteId}`);
              newFavouriteIds.add(noteId);
          }
          setFavouriteIds(newFavouriteIds);
      } catch (err) {
          alert("Failed to update favourites.");
      }
  };

  const handleFilterSelect = (key, value) => {
      setFilters(prev => {
          const newFilters = { ...prev };
          // Reset child filters when a parent is changed
          if (key === 'institution_type') {
              delete newFilters.field;
              delete newFilters.course;
              delete newFilters.subject;
          } else if (key === 'field') {
              delete newFilters.course;
              delete newFilters.subject;
          } else if (key === 'course') {
              delete newFilters.subject;
          }
          newFilters[key] = value;
          // Trigger fetch only for OriNotes flow here
          if (materialType === 'OriNotes') {
              debouncedFetch(newFilters);
          }
          return newFilters;
      });
  };

  const resetFlow = () => {
      setMaterialType(null);
      setFilters({});
      setNotes([]);
      setSearchQuery('');
      // We don't need to manually refetch if the flow is reset to the initial screen
  };

  // Logic to determine the next selection step for OriNotes (Legacy)
  const getNextOriNotesStep = () => {
    if (!filters.institution_type) return { step: 'institutionType', options: contentData.institutionTypes.map(i => ({key: i, name: i})) };
    const fieldOptions = contentData.fields[filters.institution_type] || [];
    if (!filters.field && fieldOptions.length > 0) return { step: 'field', options: fieldOptions.map(f => ({key: f, name: f})) };
    const courseOptions = contentData.courses[filters.field] || [];
    if (courseOptions.length > 0 && !filters.course) return { step: 'course', options: courseOptions.map(c => ({key: c, name: c})) };
    // If all filters are selected, show the list
    return { step: 'notesList', options: [] };
  };

  // Determine what to render based on user choice
  let step = null;
  let options = [];
  let stepTitles = {};

  if (!materialType) {
    // Initial State: Prompt for Material Type
    step = 'materialType';
    options = [{key: 'OriNotes', name: 'OriNotes Material (Legacy)'}, {key: 'university', name: 'University Material'}];
    stepTitles = { materialType: "Select Material Type" };
  } else if (materialType === 'OriNotes') {
    // OriNotes Flow: Cascading filters
    const oriNotesStep = getNextOriNotesStep();
    step = oriNotesStep.step;
    options = oriNotesStep.options;
    stepTitles = {
      institutionType: "Select Institution Type",
      field: "Select Field / Class",
      course: "Select Course / Degree",
    };
  } else if (materialType === 'university') {
      // University Flow: Render the dedicated search component
      // No selection grid needed here, the dedicated component handles it.
  }

  const handleSelection = (key, value) => {
    if(key === 'materialType') {
        setMaterialType(value);
        setFilters({}); // Reset filters when changing material type
        setNotes([]);
    } else {
        const stepKey = key.replace('Type', '_type').replace('Name', '_name');
        handleFilterSelect(stepKey, value);
    }
  };


  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h1 className="text-4xl font-bold text-cyan-400">Browse Notes</h1>
            {/* General search always available */}
            <div className="relative w-full sm:w-1/2 md:w-1/3">
                <input type="text" placeholder="Search notes by title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
        </div>

        {materialType && <button onClick={resetFlow} className="mb-8 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg">&larr; Start Over</button>}

        {/* --- 1. Material Type Selection Grid (Initial Screen) --- */}
        {step === 'materialType' && <SelectionGrid title={stepTitles[step]} options={options} onSelect={(val) => handleSelection(step, val)} />}

        {/* --- 2. OriNotes Flow (Cascading Selection Grid) --- */}
        {materialType === 'OriNotes' && step !== 'notesList' && (
            <SelectionGrid title={stepTitles[step]} options={options} onSelect={(val) => handleSelection(step.replace('Type', '_type').replace('Name', '_name'), val)} />
        )}

        {/* --- 3. University Flow (Dedicated Component) --- */}
        {materialType === 'university' && (
             <BrowseNotesPage
                 // This function is called when the user hits 'GET NOTES' in the University UI
                 onSearch={(filters) => fetchNotes({ ...filters, material_type: 'university' })}
                 universityData={courseData} // Passing relevant data from the uploaded file
                 subjectData={subjectData}
             />
        )}

        {/* --- 4. Notes List (Renders results for any flow, including search bar) --- */}
        {(materialType === 'OriNotes' && step === 'notesList') || notes.length > 0 || searchQuery.length > 2 ? (
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-300 mb-4">Available Notes</h2>
                {loading ? <p className="text-center text-gray-400">Loading...</p> : (
                    error ? <p className="text-red-500">{error}</p> :
                    notes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {notes.map(note => <NoteCard key={note.id} note={note} user={user} navigate={navigate} isFavourite={favouriteIds.has(note.id)} onToggleFavourite={handleToggleFavourite} />)}
                        </div>
                    ) : <p className="text-gray-400">No notes found for this selection.</p>
                )}
            </div>
        ) : null}
    </div>
  );
}

// --- HELPER COMPONENTS ---
const SelectionGrid = ({ title, options, onSelect }) => (
    <div className="text-center animate-fadeIn mb-8">
      <h2 className="text-3xl font-bold mb-8 text-cyan-400">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {options.map(option => (
          <div key={option.key} onClick={() => onSelect(option.key)} className="p-6 bg-gray-800 rounded-lg border-2 border-transparent hover:border-cyan-500 cursor-pointer transition-all duration-300 transform hover:scale-105">
            <h3 className="text-xl font-bold">{option.name}</h3>
          </div>
        ))}
      </div>
    </div>
);

const NoteCard = ({ note, user, navigate, isFavourite, onToggleFavourite }) => {
    // ... (NoteCard logic remains the same)
    const isSubscribed = user.subscription_expiry && new Date(user.subscription_expiry) > new Date();
    const hasAccess = note.is_free || isSubscribed || user.role === 'admin';
    const canUseFreeViews = !isSubscribed && user.free_views < 2;

    const handleViewClick = () => {
        navigate(`/notes/view/${note.id}`);
    };

    return (
        <div className={`p-4 bg-gray-800 rounded-lg border ${hasAccess || canUseFreeViews ? 'border-gray-700' : 'border-red-500/50'} flex flex-col justify-between`}>
            <div>
                <h3 className="text-xl font-bold truncate">{note.title}</h3>
                <p className="text-gray-400 text-sm mb-4">Views: {note.view_count}</p>
            </div>
            <div className="flex items-center space-x-2 mt-2">
                {(hasAccess || canUseFreeViews) ? (
                    <button
                      onClick={handleViewClick}
                      className="flex-grow bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      {canUseFreeViews && !hasAccess ? `🔓 View (Free ${user.free_views}/2)` : '🔓 View Note'}
                    </button>
                ) : (
                    user?.is_subscription_enabled ?
                    <button onClick={() => navigate('/subscribe')} className="flex-grow bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">🔒 Subscribe</button>
                    : <p className="text-sm text-yellow-400">Subscriptions disabled</p>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavourite(note.id); }}
                  className={`p-2 rounded ${isFavourite ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                  title={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavourite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                </button>
            </div>
        </div>
    );
};

export default Notes;