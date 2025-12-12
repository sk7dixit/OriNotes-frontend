import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../services/api";
import {
    UploadCloud, X, FileText, CheckCircle, AlertCircle,
    BookOpen, Layers, GraduationCap, Save, Send
} from "lucide-react";
import { pdfjs } from "react-pdf";
import { universityData, courseData, subjectData } from '../../services/universityData';
import Input from '../ui/Input';
import Select from '../ui/Select';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

export default function AdminUpload() {
    // --- State ---
    const [materialType, setMaterialType] = useState("personal_material");
    const [formData, setFormData] = useState({
        field: "", course: "", subject: "",
        title: "", description: "", category: "", difficulty: "Medium"
    });
    const [uniState, setUniState] = useState({
        state: "", institutionType: "", institution: "", otherInstitution: "",
        course: "", semester: "", subject: "", otherSubject: ""
    });
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', error: '' });

    // --- Hardcoded Options for specific fields requested ---
    const difficulties = ["Easy", "Medium", "Hard"];
    const categories = ["Lecture Notes", "Assignment", "Question Bank", "Syllabus", "Book Summary"];

    // --- Handlers ---
    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "field") { updated.course = ""; updated.subject = ""; }
            if (name === "course") { updated.subject = ""; }
            return updated;
        });
    };

    const handleUniChange = (e) => {
        const { name, value } = e.target;
        setUniState((prev) => {
            const newState = { ...prev, [name]: value };
            // Reset dependent fields logic similar to UploadNotes
            if (name === "state") { newState.institutionType = ""; newState.institution = ""; newState.otherInstitution = ""; }
            if (name === "institutionType") { newState.institution = ""; newState.otherInstitution = ""; }
            if (name === "course") { newState.semester = ""; newState.subject = ""; newState.otherSubject = ""; }
            if (name === "semester") { newState.subject = ""; newState.otherSubject = ""; }
            if (name === "institution" && value !== "Other") { newState.otherInstitution = ""; }
            if (name === "subject" && value !== "Other") { newState.otherSubject = ""; }
            return newState;
        });
    };

    const handleMetaChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- File Handling (Dropzone) ---
    const onDrop = useCallback(async (acceptedFiles) => {
        if (files.length + acceptedFiles.length > 10) {
            setFeedback({ error: "Max 10 files allowed.", message: '' });
            return;
        }
        const newFiles = acceptedFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            title: file.name.replace('.pdf', ''), // Default title from filename
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        }));
        setFiles(prev => [...prev, ...newFiles]);
        setFeedback({ message: '', error: '' });
    }, [files]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: 20 * 1024 * 1024
    });

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const updateFileTitle = (id, newTitle) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, title: newTitle } : f));
    };

    // --- Validation ---
    const isMetadataComplete = () => {
        if (materialType === 'personal_material') {
            return formData.field && formData.course && formData.subject;
        } else {
            return uniState.state && uniState.institutionType && uniState.institution && uniState.course && uniState.semester && uniState.subject;
        }
    };

    // --- Upload Action ---
    const handleUpload = async (status = 'pending') => {
        if (files.length === 0) {
            setFeedback({ error: "Please add at least one file.", message: '' });
            return;
        }
        if (!isMetadataComplete()) {
            setFeedback({ error: "Please complete the mandatory selection fields.", message: '' });
            return;
        }

        setUploading(true);
        setFeedback({ message: '', error: '' });

        const data = new FormData();
        data.append('material_type', materialType);
        data.append('approval_status', status); // Send status (approved or pending)

        if (materialType === 'personal_material') {
            data.append('field', formData.field);
            data.append('course', formData.course);
            data.append('subject', formData.subject);
        } else {
            data.append('university_name', uniState.institution === 'Other' ? uniState.otherInstitution : uniState.institution);
            data.append('state', uniState.state); // Added state
            data.append('course', uniState.course);
            data.append('subject', uniState.subject === 'Other' ? uniState.otherSubject : uniState.subject);
        }

        // Add files
        files.forEach((f) => {
            data.append('files', f.file);
            data.append('titles', f.title || f.file.name); // Use the edited title
            data.append('is_free', 'false'); // Admin uploads usually paid? Or free? Default false logic.
        });

        try {
            // Fix: Explicitly set Content-Type to multipart/form-data to override axios default application/json
            await api.post("/notes/multi-upload", data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFeedback({ message: `✅ Successfully ${status === 'approved' ? 'published' : 'saved as draft'}!`, error: '' });
            setFiles([]);
            setFormData(prev => ({ ...prev, title: "", description: "" })); // Reset specific fields
        } catch (err) {
            console.error(err);
            setFeedback({ error: err.response?.data?.error || "Upload failed", message: '' });
        } finally {
            setUploading(false);
        }
    };

    // --- Dependent Options Helpers (Reusing logic) ---
    const legacyContent = {
        fields: ["Engineering", "Medical", "Arts", "Commerce", "Class 12", "Class 11", "Class 10"],
        courses: { Engineering: ["B.Tech", "M.Tech", "Diploma"], Medical: ["MBBS", "BDS"] },
        subjects: { "B.Tech": ["CSE", "ME", "CE"], "MBBS": ["Anatomy"], "Class 12": ["Physics", "Maths"] }
    };
    const getPersonalCourses = () => formData.field ? legacyContent.courses[formData.field] || [] : [];
    const getPersonalSubjects = () => formData.course ? legacyContent.subjects[formData.course] || [] : [];

    // University options
    const getUniStates = () => Object.keys(universityData);
    const getUniTypes = () => uniState.state ? Object.keys(universityData[uniState.state]) : [];

    // Map objects to names for the Select component
    const getUniInsts = () => {
        if (uniState.state && uniState.institutionType && universityData[uniState.state][uniState.institutionType]) {
            return universityData[uniState.state][uniState.institutionType].map(u => u.name);
        }
        return [];
    };

    // Get courses for selected University
    const getUniCourses = () => {
        if (uniState.state && uniState.institution) {
            const stateData = universityData[uniState.state];
            // Find the university object (search across types or specific type if selected)
            // We can search all types in state because names should be unique
            let targetUni = null;
            if (stateData) {
                Object.values(stateData).flat().forEach(u => {
                    if (u.name === uniState.institution) targetUni = u;
                });
            }
            if (targetUni && targetUni.courses) return targetUni.courses;
        }
        // Fallback if no specific uni selected or no courses found: return nothing or generic?
        // Let's return generic list if available or empty to force manual entry? 
        // Better to return empty so user can maybe type? Not supporting typing for Course yet in UI, but `Select` supports it?
        // Wait, Select is likely strict options.
        // Let's return a default list if nothing found? Or just empty.
        return [];
    };

    const getUniSems = () => uniState.course ? [1, 2, 3, 4, 5, 6, 7, 8] : []; // Generic 8 sems

    // Fetched Subject Data
    const getUniSubjects = () => {
        if (uniState.course && uniState.semester && subjectData[uniState.course]) {
            return subjectData[uniState.course][uniState.semester] || [];
        }
        return [];
    };


    return (
        <div className="animate-fade-in min-h-[calc(100vh-120px)]">
            <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Upload Notes
                </h2>
                <p className="text-slate-400 mt-1">Add new content to the platform.</p>
            </div>

            <div className="grid grid-cols-12 gap-6 h-full">

                {/* STEP 1: Left Panel - Note Info */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 h-full">
                        <div className="flex items-center gap-2 mb-4 text-purple-400">
                            <Layers size={20} />
                            <h3 className="font-semibold text-white">Step 1: Note Info</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Material Type Toggle */}
                            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
                                <button
                                    onClick={() => setMaterialType("personal_material")}
                                    className={`py-2 text-xs font-medium rounded-md transition-all ${materialType === "personal_material" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"}`}
                                >
                                    Personal
                                </button>
                                <button
                                    onClick={() => setMaterialType("university_material")}
                                    className={`py-2 text-xs font-medium rounded-md transition-all ${materialType === "university_material" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-white"}`}
                                >
                                    University
                                </button>
                            </div>

                            {/* Dynamic Fields */}
                            {materialType === "personal_material" ? (
                                <>
                                    <Select label="Field" name="field" value={formData.field} onChange={handlePersonalChange} options={legacyContent.fields} placeholder="Select Field" />
                                    <Select label="Course" name="course" value={formData.course} onChange={handlePersonalChange} options={getPersonalCourses()} placeholder="Select Course" />
                                    <Select label="Subject" name="subject" value={formData.subject} onChange={handlePersonalChange} options={getPersonalSubjects()} placeholder="Select Subject" />
                                </>
                            ) : (
                                <>
                                    <Select label="State" name="state" value={uniState.state} onChange={handleUniChange} options={getUniStates()} placeholder="Select State" />
                                    <Select label="Type" name="institutionType" value={uniState.institutionType} onChange={handleUniChange} options={getUniTypes()} placeholder="Select Type" />
                                    <Select label="Institution" name="institution" value={uniState.institution} onChange={handleUniChange} options={[...getUniInsts(), "Other"]} placeholder="Select Institution" />
                                    {uniState.institution === "Other" && (
                                        <Input label="Specify Inst." name="otherInstitution" value={uniState.otherInstitution} onChange={handleUniChange} placeholder="Name" />
                                    )}
                                    <Select label="Course" name="course" value={uniState.course} onChange={handleUniChange} options={getUniCourses()} placeholder="Course" />
                                    <Select label="Semester" name="semester" value={uniState.semester} onChange={handleUniChange} options={getUniSems()} placeholder="Sem" />
                                    <Select label="Subject" name="subject" value={uniState.subject} onChange={handleUniChange} options={[...getUniSubjects(), "Other"]} placeholder="Subject" />
                                    {uniState.subject === "Other" && (
                                        <Input label="Specify Subj." name="otherSubject" value={uniState.otherSubject} onChange={handleUniChange} placeholder="Subject Name" />
                                    )}
                                </>
                            )}

                            <div className="h-px bg-white/5 my-2"></div>

                            {/* Additional Metadata Requested */}
                            <Input label="Category" name="category" value={formData.category} onChange={handleMetaChange} placeholder="e.g. Lecture Notes" />
                            <Select label="Difficulty" name="difficulty" value={formData.difficulty} onChange={handleMetaChange} options={difficulties} />
                            <Input label="Note Title" name="title" value={formData.title} onChange={handleMetaChange} placeholder="Title for all files (optional)" />
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Short Description</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleMetaChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:border-purple-500/50 outline-none"
                                    placeholder="Brief summary..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 2: Center Panel - Upload Files */}
                <div className="col-span-12 lg:col-span-6">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-6 text-cyan-400">
                            <UploadCloud size={24} />
                            <h3 className="font-semibold text-white text-lg">Step 2: Upload Files</h3>
                        </div>

                        {/* Drag and Drop Area */}
                        <div
                            {...getRootProps()}
                            className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-10 transition-all cursor-pointer min-h-[200px] mb-6
                                ${isDragActive ? 'border-cyan-400 bg-cyan-400/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/30'}
                            `}
                        >
                            <input {...getInputProps()} />
                            <div className="p-4 bg-slate-800 rounded-full mb-4">
                                <UploadCloud size={40} className="text-slate-400" />
                            </div>
                            <p className="text-xl text-slate-300 font-medium">Drag & drop PDF files here</p>
                            <p className="text-sm text-slate-500 mt-2">or click to browse</p>
                            <div className="mt-6 flex gap-4 text-xs text-slate-600">
                                <span>Max 20MB per file</span>
                                <span>•</span>
                                <span>Up to 10 files</span>
                            </div>
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                <h4 className="text-sm font-medium text-slate-400 sticky top-0 bg-slate-900/90 py-1 z-10 backdrop-blur-md">Selected Files ({files.length})</h4>
                                {files.map(file => (
                                    <div key={file.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors">
                                        <div className="p-2 bg-red-500/10 rounded text-red-400 flex-shrink-0">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {/* Editable Title Input */}
                                            <div className="mb-1">
                                                <input
                                                    type="text"
                                                    value={file.title}
                                                    onChange={(e) => updateFileTitle(file.id, e.target.value)}
                                                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
                                                    placeholder="Enter Note Title"
                                                />
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500 truncate max-w-[200px]">{file.file.name}</span>
                                                <span className="text-xs text-slate-600">{file.size}</span>
                                            </div>

                                            {/* Upload Progress Simulation */}
                                            {uploading && (
                                                <div className="w-full bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                                                    <div className="bg-cyan-400 h-full animate-pulse w-3/4"></div>
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => removeFile(file.id)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Feedback */}
                        {feedback.error && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2 text-sm">
                                <AlertCircle size={16} /> {feedback.error}
                            </div>
                        )}
                        {feedback.message && (
                            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg flex items-center gap-2 text-sm">
                                <CheckCircle size={16} /> {feedback.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* STEP 3: Right Panel - Review & Submit */}
                <div className="col-span-12 lg:col-span-3">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 h-full flex flex-col sticky top-24">
                        <div className="flex items-center gap-2 mb-6 text-green-400">
                            <CheckCircle size={20} />
                            <h3 className="font-semibold text-white">Step 3: Review</h3>
                        </div>

                        <div className="flex-1 space-y-6">
                            {/* Summary Card */}
                            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold">Subject / Title</label>
                                    <p className="text-white font-medium truncate">{formData.subject || uniState.subject || "Not Selected"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase font-bold">Course</label>
                                        <p className="text-sm text-slate-300 truncate">{formData.course || uniState.course || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase font-bold">Files</label>
                                        <p className="text-sm text-slate-300">{files.length}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold">University</label>
                                    <p className="text-sm text-slate-300 truncate">{materialType === 'university_material' ? (uniState.institution || "-") : "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold">Category</label>
                                    <p className="text-sm text-slate-300">{formData.category || "General"}</p>
                                </div>
                                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                                    <span className="text-slate-500">Visibility</span>
                                    <span className="text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded">Public</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto space-y-3 pt-6">
                            <button
                                onClick={() => handleUpload('approved')}
                                disabled={uploading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Send size={18} />}
                                Publish Note
                            </button>
                            <button
                                onClick={() => handleUpload('pending')} // Draft = Pending
                                disabled={uploading}
                                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Save size={18} />
                                Save as Draft
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
