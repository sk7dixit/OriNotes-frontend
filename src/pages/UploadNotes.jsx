// src/pages/UploadNotes.jsx
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { X, FileText, UploadCloud, CheckCircle, AlertCircle, BookOpen, GraduationCap, Layers, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { pdfjs } from "react-pdf";
import { universityData, courseData, subjectData } from '../services/universityData';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

// --- Helper Components ---

const StepIndicator = ({ currentStep, steps }) => (
  <div className="flex items-center justify-center mb-12">
    {steps.map((step, index) => {
      const isCompleted = currentStep > index + 1;
      const isCurrent = currentStep === index + 1;

      return (
        <div key={index} className="flex items-center">
          <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300
                    ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-gray-800 text-gray-500 border border-gray-700'}
                `}>
            {isCompleted ? <Check size={20} /> : index + 1}
          </div>
          <div className={`ml-3 mr-3 ${isCurrent ? 'text-white font-medium' : 'text-gray-500'} hidden md:block`}>
            {step}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-1 mx-2 rounded-full ${currentStep > index + 1 ? 'bg-green-500/50' : 'bg-gray-800'}`} />
          )}
        </div>
      );
    })}
  </div>
);

const PersonalNoteForm = ({ formData, handleChange }) => {
  const legacyContent = {
    fields: ["Engineering", "Medical", "Arts", "Commerce", "Class 12", "Class 11", "Class 10"],
    courses: {
      Engineering: ["B.Tech", "M.Tech", "Diploma"],
      Medical: ["MBBS", "BDS", "BAMS"]
    },
    subjects: {
      "B.Tech": ["Computer Science", "Mechanical", "Civil", "Electronics"],
      "MBBS": ["Anatomy", "Physiology", "Biochemistry"],
      "Class 12": ["Physics", "Chemistry", "Maths", "Biology", "Computer Science"]
    }
  };

  const courseOptions = formData.field ? legacyContent.courses[formData.field] || [] : [];
  const subjectOptions = formData.course ? legacyContent.subjects[formData.course] || [] : [];

  return (
    <div className="space-y-4 animate-fade-in-up">
      <Select
        label="Field / Class"
        name="field"
        value={formData.field}
        onChange={handleChange}
        options={legacyContent.fields}
        placeholder="Select Field"
        required
      />

      {courseOptions.length > 0 && (
        <Select
          label="Course / Degree"
          name="course"
          value={formData.course}
          onChange={handleChange}
          options={courseOptions}
          placeholder="Select Course"
          required
        />
      )}

      {subjectOptions.length > 0 && (
        <Select
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          options={subjectOptions}
          placeholder="Select Subject"
          required
        />
      )}
    </div>
  );
};

const UniversityNoteForm = ({ uniState, handleUniChange }) => {
  const stateOptions = Object.keys(universityData);
  const institutionTypeOptions = uniState.state ? Object.keys(universityData[uniState.state]) : [];

  // FIX: Map to .name to ensure we have an array of strings
  const institutionOptions = uniState.state && uniState.institutionType && universityData[uniState.state] && universityData[uniState.state][uniState.institutionType]
    ? universityData[uniState.state][uniState.institutionType].map(u => u.name)
    : [];

  const courseOptions = Object.keys(courseData);
  const semesterOptions = uniState.course
    ? Array.from({ length: courseData[uniState.course]?.semesters || 0 }, (_, i) => i + 1)
    : [];
  const subjectOptions = uniState.course && uniState.semester && subjectData[uniState.course]
    ? subjectData[uniState.course][uniState.semester] || []
    : [];

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="State"
          name="state"
          value={uniState.state}
          onChange={handleUniChange}
          options={stateOptions}
          placeholder="Select State"
          required
        />

        {uniState.state && (
          <Select
            label="Institution Type"
            name="institutionType"
            value={uniState.institutionType}
            onChange={handleUniChange}
            options={institutionTypeOptions}
            placeholder="Select Type"
            required
          />
        )}
      </div>

      {uniState.institutionType && (
        <Select
          label="Institution Name"
          name="institution"
          value={uniState.institution}
          onChange={handleUniChange}
          options={[...institutionOptions, "Other"]}
          placeholder="Select Institution"
          required
        />
      )}

      {uniState.institution === "Other" && (
        <Input
          label="Specify Institution"
          name="otherInstitution"
          value={uniState.otherInstitution}
          onChange={handleUniChange}
          placeholder="Enter institution name"
          required
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Course"
          name="course"
          value={uniState.course}
          onChange={handleUniChange}
          options={courseOptions}
          placeholder="Select Course"
          required
        />

        {uniState.course && (
          <Select
            label="Semester"
            name="semester"
            value={uniState.semester}
            onChange={handleUniChange}
            options={semesterOptions}
            placeholder="Select Semester"
            required
          />
        )}
      </div>

      {uniState.semester && (
        <Select
          label="Subject"
          name="subject"
          value={uniState.subject}
          onChange={handleUniChange}
          options={[...subjectOptions, "Other"]}
          placeholder="Select Subject"
          required
        />
      )}

      {uniState.subject === "Other" && (
        <Input
          label="Specify Subject"
          name="otherSubject"
          value={uniState.otherSubject}
          onChange={handleUniChange}
          placeholder="Enter subject name"
          required
        />
      )}
    </div>
  );
};

export default function UploadNotes() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [feedback, setFeedback] = useState({ message: '', error: '' });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [materialType, setMaterialType] = useState(null); // Initially null to force selection

  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({ field: "", course: "", subject: "" });
  const [uniState, setUniState] = useState({
    state: "", institutionType: "", institution: "", otherInstitution: "",
    course: "", semester: "", subject: "", otherSubject: ""
  });

  const steps = ["Material Type", "Note Details", "Upload Files"];

  const playSuccessSound = () => {
    // Placeholder for audio feedback
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'); // Example success chime
    audio.volume = 0.5;
    audio.play().catch(() => { });
  };

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
      if (name === "state") { newState.institutionType = ""; newState.institution = ""; newState.otherInstitution = ""; }
      if (name === "institutionType") { newState.institution = ""; newState.otherInstitution = ""; }
      if (name === "course") { newState.semester = ""; newState.subject = ""; newState.otherSubject = ""; }
      if (name === "semester") { newState.subject = ""; newState.otherSubject = ""; }
      if (name === "institution" && value !== "Other") { newState.otherInstitution = ""; }
      if (name === "subject" && value !== "Other") { newState.otherSubject = ""; }
      return newState;
    });
  };

  const generateThumbnail = async (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        try {
          const typedArray = new Uint8Array(this.result);
          const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 0.3 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: ctx, viewport }).promise;
          resolve(canvas.toDataURL());
        } catch (e) {
          resolve(null);
        }
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (files.length + acceptedFiles.length > 10) {
        setFeedback(prev => ({ ...prev, error: "❌ Maximum 10 PDFs allowed per upload." }));
        return;
      }

      const processedFiles = [];
      setFeedback({ message: '', error: '' });

      for (const file of acceptedFiles) {
        if (file.type !== "application/pdf") {
          setFeedback(prev => ({ ...prev, error: `❌ ${file.name} is not a PDF` }));
          continue;
        }
        const preview = await generateThumbnail(file);
        processedFiles.push({
          file,
          preview,
          title: file.name.replace('.pdf', '').replace(/[_-]/g, ' '),
          isFree: false,
          isPrivate: false
        });
      }

      setFiles(prev => [...prev, ...processedFiles]);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (index, field, value) => {
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, [field]: value } : f));
  };

  const isMetadataComplete = () => {
    if (materialType === 'personal_material') {
      return formData.field && formData.course && formData.subject;
    } else {
      return uniState.state && uniState.institutionType && uniState.institution && uniState.course && uniState.semester && uniState.subject;
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !materialType) {
      setFeedback({ error: 'Please select a material type.', message: '' });
      return;
    }
    if (currentStep === 2 && !isMetadataComplete()) {
      setFeedback({ error: 'Please fill in all details.', message: '' });
      return;
    }
    setFeedback({ message: '', error: '' });
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setFeedback({ message: '', error: '' });
    setCurrentStep(prev => prev - 1);
  };


  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setFeedback({ message: '', error: '' });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 400);

    const data = new FormData();

    // Append Global Metadata
    data.append('material_type', materialType);
    if (materialType === 'personal_material') {
      data.append('field', formData.field);
      data.append('course', formData.course);
      data.append('subject', formData.subject);
    } else {
      data.append('university_name', uniState.institution === 'Other' ? uniState.otherInstitution : uniState.institution);
      data.append('course', uniState.course);
      data.append('subject', uniState.subject === 'Other' ? uniState.otherSubject : uniState.subject);
    }

    // Append Files and Per-File Metadata
    files.forEach((f) => {
      data.append('files', f.file);
      data.append('titles', f.title);
      data.append('is_free', f.isFree);
      data.append('is_private', f.isPrivate);
    });

    try {
      const res = await api.post("/notes/multi-upload", data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      playSuccessSound();

      setFeedback({ message: `✅ ${res.data.message}`, error: '' });
      setFiles([]);
      // Maybe navigate to dashboard or reset
      setTimeout(() => {
        setCurrentStep(1);
        setMaterialType(null);
        setFeedback({ message: '', error: '' });
        setUploadProgress(0);
      }, 3000);

    } catch (err) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      console.error(err);
      setFeedback({ error: err.response?.data?.error || "❌ Upload failed", message: '' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0A0A0C] text-gray-100 font-inter">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Upload New Notes
          </h1>
          <p className="text-gray-400">Share your resources with the community in 3 simple steps.</p>
        </div>

        {/* Wizard Progress */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        {/* Main Content Card */}
        <GlassCard className="p-8 md:p-12 relative overflow-hidden min-h-[500px] flex flex-col">

          {/* Feedback Messages */}
          {feedback.error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 animate-fade-in">
              <AlertCircle size={20} />
              {feedback.error}
            </div>
          )}
          {feedback.message && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3 animate-fade-in">
              <CheckCircle size={20} />
              {feedback.message}
            </div>
          )}

          {/* STEP 1: Material Type */}
          {currentStep === 1 && (
            <div className="animate-fade-in flex-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">What kind of material is this?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
                <button
                  onClick={() => setMaterialType("personal_material")}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 text-center group hover:shadow-lg hover:shadow-cyan-500/10
                                ${materialType === "personal_material" ? "bg-cyan-500/10 border-cyan-500" : "bg-gray-800/50 border-gray-700 hover:border-cyan-500/50"}
                            `}
                >
                  <div className={`p-4 rounded-full ${materialType === "personal_material" ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-400 group-hover:text-cyan-400"} transition-colors`}>
                    <Layers size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400">Personal / School</h3>
                    <p className="text-sm text-gray-400 mt-2">Notes for Class 10, 11, 12 or general study material.</p>
                  </div>
                </button>

                <button
                  onClick={() => setMaterialType("university_material")}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 text-center group hover:shadow-lg hover:shadow-blue-500/10
                                ${materialType === "university_material" ? "bg-blue-500/10 border-blue-500" : "bg-gray-800/50 border-gray-700 hover:border-blue-500/50"}
                            `}
                >
                  <div className={`p-4 rounded-full ${materialType === "university_material" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-400 group-hover:text-blue-400"} transition-colors`}>
                    <GraduationCap size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400">University</h3>
                    <p className="text-sm text-gray-400 mt-2">Specific to colleges, degrees, and semesters.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {currentStep === 2 && (
            <div className="animate-fade-in flex-1">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Add Note Details</h2>
              <div className="max-w-xl mx-auto">
                {materialType === "personal_material" ? (
                  <PersonalNoteForm formData={formData} handleChange={handlePersonalChange} />
                ) : (
                  <UniversityNoteForm uniState={uniState} handleUniChange={handleUniChange} />
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Upload */}
          {currentStep === 3 && (
            <div className="animate-fade-in flex-1">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Upload Your Files</h2>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 cursor-pointer text-center overflow-hidden mb-8 ${isDragActive
                  ? "border-cyan-400 bg-cyan-400/10 scale-[1.02]"
                  : "border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/50"
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-gray-800 text-cyan-400">
                    <UploadCloud size={48} />
                  </div>
                  <div>
                    <p className="text-xl font-medium text-white">
                      {isDragActive ? "Drop files now" : "Click or Drag PDFs here"}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Max 10 files, 20MB each</p>
                  </div>
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div className="w-12 h-14 bg-gray-900 rounded border border-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                        {file.preview ? <img src={file.preview} alt="" className="w-full h-full object-cover opacity-80" /> : <FileText className="text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Input
                          value={file.title}
                          onChange={(e) => handleFileChange(index, 'title', e.target.value)}
                          placeholder="Note Title"
                          className="h-9 text-sm bg-transparent border-none focus:ring-0 px-0 text-white font-medium placeholder-gray-600"
                        />
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>{Math.round(file.file.size / 1024)} KB</span>
                          <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-300 transition-colors">
                            <input
                              type="checkbox"
                              checked={file.isFree}
                              onChange={(e) => handleFileChange(index, 'isFree', e.target.checked)}
                              disabled={file.isPrivate}
                              className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-offset-gray-900"
                            />
                            Free Access
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-300 transition-colors">
                            <input
                              type="checkbox"
                              checked={file.isPrivate}
                              onChange={(e) => handleFileChange(index, 'isPrivate', e.target.checked)}
                              className="rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-offset-gray-900"
                            />
                            Private
                          </label>
                        </div>
                      </div>
                      <button onClick={() => removeFile(index)} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* Navigation Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all flex items-center gap-2 font-medium"
              >
                <ArrowLeft size={18} /> Back
              </button>
            ) : <div></div>}

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-8 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 font-medium"
              >
                Next Step <ArrowRight size={18} />
              </button>
            ) : (
              <Button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                isLoading={uploading}
                className="px-8"
              >
                {uploading ? 'Uploading...' : 'Confirm Upload'}
              </Button>
            )}
          </div>

          {/* Animated Progress Bar */}
          {uploading && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

        </GlassCard>
      </div>
    </div>
  );
}