import React, { useMemo, useState, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, Check, X, Filter } from 'lucide-react';
import { getFilterOptions } from '../services/api';

const FilterBar = ({ currentFilters, onFilterChange, onClearFilters }) => {
    // --- State helpers ---
    const [openDropdown, setOpenDropdown] = useState(null);
    const [filterData, setFilterData] = useState({ states: [], hierarchy: {}, courses: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getFilterOptions();
                setFilterData({
                    states: data.states || [],
                    hierarchy: data.hierarchy || {},
                    courses: data.courses || []
                });
            } catch (error) {
                console.error("Error loading filters:", error);
            }
        };
        fetchData();
    }, []);

    // --- Derived Data for Dropdowns ---
    const states = useMemo(() => filterData.states || [], [filterData.states]);

    // Get universities for the selected state
    const universities = useMemo(() => {
        if (!currentFilters.state) return [];
        // Map hierarchy (State -> [University Names]) to objects Expected by Dropdown logic if needed
        const uniNames = filterData.hierarchy?.[currentFilters.state] || [];
        return uniNames.map(name => ({ name, value: name }));
    }, [currentFilters.state, filterData.hierarchy]);

    // Get courses: Global list OR University Specific if available
    const courses = useMemo(() => {
        if (currentFilters.university_name && filterData.universityCourses?.[currentFilters.university_name]) {
            return filterData.universityCourses[currentFilters.university_name];
        }
        return filterData.courses || [];
    }, [filterData.courses, filterData.universityCourses, currentFilters.university_name]);


    // --- Handlers ---
    const handleSelect = (key, value) => {
        setOpenDropdown(null); // Close menu on select

        // Source Change Logic
        if (key === 'source') {
            // When switching source, clear hierarchy filters
            const resetExtras = { state: null, university_name: null, course: null, date_range: null };
            onFilterChange({ ...currentFilters, [key]: value, ...resetExtras });
            return;
        }

        // Hierarchy Logic: Clearing children on parent change
        let nextFilters = { ...currentFilters, [key]: value };

        if (key === 'state') {
            nextFilters.university_name = null;
            nextFilters.course = null;
        } else if (key === 'university_name') {
            nextFilters.course = null;
        }

        // Toggle off if same value (except sort/source)
        if (currentFilters[key] === value && !['sort', 'source'].includes(key)) {
            const { [key]: _, ...rest } = currentFilters; // Remove key to "toggle off"
            onFilterChange(rest);
        } else {
            onFilterChange(nextFilters);
        }
    };

    const toggleDropdown = (label) => {
        if (openDropdown === label) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(label);
        }
    }


    // --- Filter Configuration ---

    // 1. Source Filter
    const sourceOptions = [
        { value: 'all', label: 'All Notes' },
        { value: 'my_notes', label: 'My Notes' },
        { value: 'admin_notes', label: 'OriNotes (Admin)' },
        { value: 'university', label: 'University Notes' }
    ];

    // 2. Sort Options
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'popular', label: 'Most Popular' },
        { value: 'oldest', label: 'Oldest First' }
    ];

    // 3. Date Range (Only visible if Sort == Newest)
    const dateRangeOptions = [
        { value: '1_day', label: 'Last 24 Hours' },
        { value: '1_week', label: 'Last Week' },
        { value: '2_week', label: 'Last 2 Weeks' },
        { value: '4_week', label: 'Last Month' }
    ];

    // Helper to check if source is University
    const isUniversitySource = currentFilters.source === 'university';


    // --- Reusable Dropdown Component ---
    const Dropdown = ({ label, icon: Icon, activeValue, options, onSelect, className = '' }) => {
        const isOpen = openDropdown === label;

        return (
            <div className={`relative flex-shrink-0 ${className}`}>
                <button
                    onClick={() => toggleDropdown(label)}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200
                        ${activeValue
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                            : 'bg-slate-800/50 border-white/10 text-slate-300 hover:bg-slate-800 hover:border-white/20'
                        }
                    `}
                >
                    {Icon && <Icon size={14} />}
                    <span className="truncate max-w-[150px]">
                        {/* Display Label Logic */}
                        {activeValue
                            ? (options.find(o => (o.value || o) === activeValue)?.label || activeValue)
                            : label
                        }
                    </span>
                    <ChevronDown size={14} className={`opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <>
                        {/* Backdrop to close */}
                        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)}></div>

                        <div className="absolute top-full left-0 mt-2 min-w-[220px] max-h-[300px] overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 custom-scrollbar p-1 animate-in fade-in zoom-in-95 duration-100">
                            {options.length > 0 ? (
                                options.map(option => {
                                    // Handle plain constants vs object options
                                    const val = typeof option === 'object' ? option.value : option;
                                    const lbl = typeof option === 'object' ? option.label || option.name : option; // Handle university object vs string
                                    const isSelected = activeValue === (typeof option === 'object' && option.name ? option.name : val);

                                    // If option is undefined (e.g. data issue), skip
                                    if (!val && !lbl) return null;

                                    return (
                                        <button
                                            key={val || lbl}
                                            onClick={() => onSelect(typeof option === 'object' && option.name ? option.name : val)}
                                            className={`
                                                w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between
                                                ${isSelected ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-800'}
                                            `}
                                        >
                                            <span className="truncate">{lbl}</span>
                                            {isSelected && <Check size={14} className="text-indigo-400" />}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="px-3 py-4 text-center text-xs text-slate-500">No options available</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }


    return (
        <div className="w-full mb-6">
            <div className="flex flex-wrap items-center gap-3">

                {/* Clear All Button */}
                {(Object.keys(currentFilters).some(k => !['sort', 'source'].includes(k)) || (currentFilters.source && currentFilters.source !== 'all') || (currentFilters.sort && currentFilters.sort !== 'newest')) && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                    >
                        <X size={14} /> Clear
                    </button>
                )}

                {/* 1. Source Filter */}
                <Dropdown
                    label="Source"
                    icon={Filter}
                    activeValue={currentFilters.source || 'all'}
                    options={sourceOptions}
                    onSelect={(val) => handleSelect('source', val)}
                />

                {/* 2. Sort Filter - HIDDEN for University Notes */}
                {!isUniversitySource && (
                    <Dropdown
                        label="Sort By"
                        icon={SlidersHorizontal}
                        activeValue={currentFilters.sort || 'newest'}
                        options={sortOptions}
                        onSelect={(val) => handleSelect('sort', val)}
                    />
                )}

                {/* 3. Date Range - HIDDEN for University Notes */}
                {!isUniversitySource && (currentFilters.sort === 'newest' || !currentFilters.sort) && (
                    <Dropdown
                        label="Date Range"
                        activeValue={currentFilters.date_range}
                        options={dateRangeOptions}
                        onSelect={(val) => handleSelect('date_range', val)}
                    />
                )}

                <div className="w-px h-8 bg-white/10 mx-1 hidden md:block"></div>

                {/* 4. University Hierarchy */}
                {/* State: Always visible if Source is University, or generally available */}
                <Dropdown
                    label="State"
                    activeValue={currentFilters.state}
                    options={states}
                    onSelect={(val) => handleSelect('state', val)}
                />

                {currentFilters.state && (
                    <Dropdown
                        label="University"
                        activeValue={currentFilters.university_name}
                        options={universities} // Array of objects {name, courses}
                        onSelect={(val) => handleSelect('university_name', val)}
                    />
                )}

                {currentFilters.university_name && (
                    <Dropdown
                        label="Course"
                        activeValue={currentFilters.course}
                        options={courses}
                        onSelect={(val) => handleSelect('course', val)}
                    />
                )}

            </div>
        </div>
    );
};

export default FilterBar;
