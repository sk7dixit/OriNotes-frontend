// src/pages/BrowseNotesPage.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, X } from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function BrowseNotesPage({ onSearch }) {
  const [availableFilters, setAvailableFilters] = useState({
    courses: [],
    subjects: [],
    fields: [],
    universities: [],
  });

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllFilters = async () => {
      setLoadingFilters(true);
      setError('');
      try {
        const res = await api.get('/notes/available-subjects');
        setAvailableFilters(res.data);
      } catch (err) {
        console.error('Failed to fetch available filters:', err);
        setError('Failed to load browsing filters');
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchAllFilters();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {
      course: selectedCourse || undefined,
      subject: selectedSubject || undefined,
      semester: semester || undefined
    };
    onSearch && onSearch(filters);
  };

  const handleClear = () => {
    setSelectedCourse('');
    setSelectedSubject('');
    setSemester('');
    onSearch && onSearch({});
  };

  if (loadingFilters) {
    return (
      <GlassCard className="p-8 text-center animate-pulse">
        <p className="text-cyan-400 font-medium">Loading browsing options...</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 md:p-8 mb-8">
      <div className="flex items-center space-x-3 mb-6 border-b border-slate-700/50 pb-4">
        <Filter className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Refine by Course / Subject</h2>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Select
            label="Course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            options={availableFilters.courses.map(c => ({ value: c, label: c }))}
            placeholder="Select Course"
          />
        </div>

        <div>
          <Select
            label="Subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            options={availableFilters.subjects.map(s => ({ value: s, label: s }))}
            placeholder="Select Subject"
          />
        </div>

        <div>
          <Input
            label="Semester (Optional)"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="e.g., 1, 2, 3..."
          />
        </div>

        <div className="md:col-span-3 flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-slate-700/50">
          <Button
            type="submit"
            variant="primary"
            icon={Search}
            className="w-full sm:w-auto"
          >
            Get Notes
          </Button>

          <Button
            type="button"
            onClick={handleClear}
            variant="secondary"
            icon={X}
            className="w-full sm:w-auto"
          >
            Clear Filters
          </Button>

          {error && (
            <div className="flex items-center text-red-400 text-sm ml-0 sm:ml-auto mt-2 sm:mt-0 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
              <span>{error}</span>
            </div>
          )}
        </div>
      </form>
    </GlassCard>
  );
}