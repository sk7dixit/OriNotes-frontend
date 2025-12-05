// src/pages/MyNotes.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { X } from "lucide-react";

export default function MyNotes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPdf, setSelectedPdf] = useState(null);

    useEffect(() => {
        fetchMyNotes();
    }, []);

    async function fetchMyNotes() {
        setLoading(true);
        try {
            const res = await api.get("/notes/me");
            setNotes(res.data || []);
        } catch (err) {
            setError("Failed to fetch your notes.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this note?")) return;
        try {
            await api.delete(`/notes/${id}`);
            setNotes(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            alert("Failed to delete note.");
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <h1 className="text-3xl font-bold text-cyan-400 mb-6">My Notes</h1>

            {loading && <p className="text-gray-300">Loading...</p>}
            {error && <p className="text-red-400">{error}</p>}

            {!loading && notes.length === 0 && (
                <p className="text-gray-400">You haven't uploaded any notes yet.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map(note => (
                    <div key={note.id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2 truncate" title={note.title}>{note.title}</h3>
                            <p className="text-sm text-gray-400 mb-4">Uploaded: {new Date(note.created_at).toLocaleDateString()}</p>

                            <div className="mb-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${note.approval_status === 'approved' ? 'bg-green-900 text-green-300' :
                                        note.approval_status === 'rejected' ? 'bg-red-900 text-red-300' :
                                            'bg-yellow-900 text-yellow-300'
                                    }`}>
                                    {note.approval_status}
                                </span>
                                {note.approval_status === 'rejected' && note.rejection_reason && (
                                    <p className="text-red-400 text-xs mt-2">Reason: {note.rejection_reason}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => setSelectedPdf({ id: note.id, title: note.title })}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white text-sm transition"
                            >
                                View
                            </button>
                            <button
                                onClick={() => handleDelete(note.id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded text-white text-sm transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* PDF Modal */}
            {selectedPdf && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
                    <div className="bg-gray-900 w-full h-full sm:w-[90%] sm:h-[90%] rounded-lg overflow-hidden flex flex-col shadow-2xl">
                        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                            <h2 className="text-lg font-bold text-white truncate">{selectedPdf.title}</h2>
                            <button onClick={() => setSelectedPdf(null)} className="p-2 hover:bg-gray-700 rounded text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 bg-black">
                            <iframe
                                src={`/api/notes/${selectedPdf.id}/view`}
                                title={selectedPdf.title}
                                className="w-full h-full border-0"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}