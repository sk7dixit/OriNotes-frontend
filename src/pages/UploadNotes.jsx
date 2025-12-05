// src/pages/UploadNotes.jsx
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { X, FileText, UploadCloud, CheckCircle, AlertCircle, BookOpen, GraduationCap, Layers } from "lucide-react";
import { pdfjs } from "react-pdf";
import { universityData, courseData, subjectData } from '../services/universityData';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

// --- Helper Components ---

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
  const institutionOptions = uniState.state && uniState.institutionType ? universityData[uniState.state][uniState.institutionType] : [];
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
  const [feedback, setFeedback] = useState({ message: '', error: '' });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [materialType, setMaterialType] = useState("personal_material");
  const [formData, setFormData] = useState({ field: "", course: "", subject: "" });
  const [uniState, setUniState] = useState({
    state: "", institutionType: "", institution: "", otherInstitution: "",
    course: "", semester: "", subject: "", otherSubject: ""
  });

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

        <X size={18} />
                      </button >
                    </div >
                  ))
}
                </div >

  <div className="mt-6 pt-4 border-t border-slate-700/50">
    <Button
      onClick={handleUpload}
      disabled={uploading || files.length === 0 || !isMetadataComplete()}
      isLoading={uploading}
      className="w-full"
    >
      {uploading ? 'Uploading...' : 'Upload All Notes'}
    </Button>
  </div>
              </GlassCard >
            )}
          </div >
        </div >
      </div >
    </div >
  );
}