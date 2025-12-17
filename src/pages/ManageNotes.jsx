// src/pages/ManageNotes.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { X } from "lucide-react";

// ---------------------------------------------------
// PDF VIEW MODAL
// ---------------------------------------------------
// ---------------------------------------------------
// PDF VIEW MODAL
// ---------------------------------------------------
function PdfModal({ noteId, title, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!noteId) return;

    let objectUrl = null;
    const fetchPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/notes/${noteId}/view`, {
          responseType: 'blob'
        });

        // Create a blob URL
        const blob = new Blob([response.data], { type: 'application/pdf' });
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err) {
        console.error("Failed to load PDF", err);
        setError("Failed to load document.");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [noteId]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-gray-900 w-full h-full sm:w-[90%] sm:h-[90%] rounded-xl overflow-hidden flex flex-col shadow-2xl border border-gray-700">

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white truncate max-w-[80%]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PDF */}
        <div className="flex-1 bg-black relative flex items-center justify-center">
          {loading ? (
            <div className="text-cyan-500 animate-pulse font-medium flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
              Loading Document...
            </div>
          ) : error ? (
            <div className="text-red-400 text-center">
              <p>{error}</p>
              <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">Close</button>
            </div>
          ) : (
            <iframe
              src={pdfUrl}
              title={title}
              className="w-full h-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------
// REJECT MODAL
// ---------------------------------------------------
function RejectModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg p-5 w-full max-w-md shadow-xl animate-fadeIn">

        <h3 className="text-xl font-semibold text-red-400 mb-3">
          Reject Note
        </h3>

        <p className="text-gray-300 text-sm mb-3">
          Please provide a rejection reason.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter reason..."
          rows={4}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded text-gray-200 hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            disabled={!reason.trim()}
            onClick={() => onSubmit(reason)}
            className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700 disabled:opacity-40"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------
export default function ManageNotes() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/notes/admin/all");
      setPending(res.data || []);
    } catch (err) {
      setError("Failed to fetch notes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    setActionLoading(true);
    try {
      await api.put(`/notes/admin/review/${id}`, { action: "approve" });
      setPending(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      setError("Approve failed");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setActionLoading(true);
    try {
      await api.delete(`/notes/${id}`);
      setPending(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      setError("Delete failed");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-6">
        Manage All Notes
      </h1>

      {error && (
        <div className="bg-red-800 bg-opacity-30 p-3 rounded text-red-300 mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-gray-300">Loading pending notes...</div>
      )}

      {/* No notes */}
      {!loading && pending.length === 0 && (
        <div className="text-gray-400">No pending notes.</div>
      )}

      {/* Notes list */}
      <div className="space-y-4">
        {pending.map(note => (
          <div
            key={note.id}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            {/* Info */}
            <div>
              <p className="font-semibold text-gray-100">{note.title}</p>
              <p className="text-gray-400 text-sm">
                Uploaded by{" "}
                <span className="text-cyan-300">{note.username}</span>{" "}
                • {new Date(note.created_at).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPdf({ id: note.id, title: note.title })}
                className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-white text-sm"
              >
                View PDF
              </button>

              <button
                disabled={actionLoading}
                onClick={() => handleDelete(note.id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm disabled:opacity-40"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Modal */}
      {selectedPdf && (
        <PdfModal
          noteId={selectedPdf.id}
          title={selectedPdf.title}
          onClose={() => setSelectedPdf(null)}
        />
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <RejectModal
          onClose={() => setRejectTarget(null)}
          onSubmit={(reason) => handleReject(rejectTarget.id, reason)}
        />
      )}
    </div>
  );
}
