import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SecurePdfViewer from '../components/SecurePdfViewer';
import ReportNote from '../components/ReportNote';
import { Rating } from 'react-simple-star-rating';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Flag, Lock, Clock, CheckCircle, XCircle } from 'lucide-react';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

// The RatingSection component remains unchanged
const RatingSection = ({ noteId }) => {
    // ... (All the code for RatingSection stays the same)
    const { user, refreshUser } = useAuth();
    const [ratings, setRatings] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRatings = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/notes/${noteId}/ratings`);
                if (Array.isArray(res.data)) {
                    setRatings(res.data);
                    const myReview = res.data.find(r => r.username === user.username);
                    if (myReview) {
                        setUserRating(myReview.rating);
                        setReviewText(myReview.review_text);
                    }
                } else {
                    setRatings([]);
                }
            } catch (err) {
                console.error("Failed to fetch ratings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRatings();
    }, [noteId, user.username]);

    const handleRating = (rate) => { setUserRating(rate); };

    const handleSubmitReview = async () => {
        if (userRating === 0) {
            alert("Please select a star rating before submitting.");
            return;
        }
        try {
            await api.post(`/notes/${noteId}/rate`, { rating: userRating, review_text: reviewText });
            await refreshUser();
            const res = await api.get(`/notes/${noteId}/ratings`);
            setRatings(res.data);
        } catch (err) {
            alert("Failed to submit review.");
        }
    };

    const averageRating = ratings.length > 0 ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1) : "N/A";

    return (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
            <h2 className="text-3xl font-bold mb-4 text-white">Ratings & Reviews <span className="text-yellow-400">({averageRating} ★)</span></h2>
            <div className="mb-8 p-4 border border-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Your Review</h3>
                <div className="flex items-center gap-2">
                    <Rating
                        onClick={handleRating}
                        initialValue={userRating}
                        size={30}
                        transition
                        allowFraction={false}
                        fillColor='#facc15'
                        emptyColor='#4b5563'
                        SVGstyle={{ display: 'inline' }}
                    />
                    <span className="text-sm text-gray-400 ml-2">
                        {userRating ? `${userRating} Stars` : 'Select a rating'}
                    </span>
                </div>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts on this note..."
                    rows="4"
                    className="w-full p-2 mt-4 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button onClick={handleSubmitReview} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Submit Review
                </button>
            </div>
            <div className="space-y-4">
                {loading ? <p>Loading reviews...</p> : ratings.length > 0 ? ratings.map((r, index) => (
                    <div key={index} className="border-b border-gray-700 pb-4">
                        <div className="flex items-center mb-1">
                            <span className="font-bold text-cyan-400 mr-2">{r.username}</span>
                            <Rating initialValue={r.rating} readonly size={20} />
                        </div>
                        <p className="text-gray-300">{r.review_text}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(r.created_at)}</p>
                    </div>
                )) : <p className="text-gray-400">Be the first to leave a review!</p>}
            </div>
        </div>
    );
};


function NoteViewer() {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Needed to check login status

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await api.get(`/notes/${noteId}`);
                setNote(res.data);
            } catch (err) {
                console.error("Failed to fetch note", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [noteId]);

    const handleRequestAccess = async () => {
        if (!user) {
            alert("Please login to request access.");
            return;
        }
        setRequesting(true);
        try {
            await api.post(`/notes/access/request/${noteId}`);
            // Update local state to reflect pending
            setNote(prev => ({ ...prev, access_status: 'pending' }));
        } catch (err) {
            console.error(err);
            alert("Failed to send request.");
        } finally {
            setRequesting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading note...</div>;
    if (!note) return <div className="p-10 text-center">Note not found.</div>;

    const hasAccess = note.has_access;

    return (
        <div className="w-full">
            {/* Top Control Bar */}
            <div className="mb-6 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    &larr; Back
                </button>

                {/* Report Button */}
                <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                    <Flag className="w-5 h-5" /> Report Note
                </button>
            </div>

            {/* Note Info Header (Visible to all) */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">{note.title}</h1>
                <p className="text-slate-400">By {note.username || 'Unknown'} • {formatDate(note.created_at)}</p>
            </div>

            {/* --- ACCESS CONTROL --- */}
            {hasAccess ? (
                <>
                    {/* PDF VIEWER CONTAINER */}
                    <div className="w-full h-[85vh] bg-gray-800 rounded-lg overflow-hidden shadow-2xl mb-8">
                        <SecurePdfViewer note={note} />
                    </div>
                    {/* Ratings */}
                    <div className="w-full">
                        <RatingSection noteId={noteId} />
                    </div>
                </>
            ) : (
                <div className="w-full h-[50vh] bg-slate-900/50 border border-slate-700 rounded-2xl flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                    <div className="bg-slate-800 p-4 rounded-full mb-4">
                        <Lock size={48} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
                    <p className="text-slate-400 max-w-md mb-8">
                        This is a personal note. You need permission from the owner to view it.
                    </p>

                    {note.access_status === 'pending' ? (
                        <div className="flex items-center gap-2 px-6 py-3 bg-yellow-500/10 text-yellow-400 rounded-xl border border-yellow-500/20 font-medium">
                            <Clock size={20} />
                            Access Request Pending
                        </div>
                    ) : note.access_status === 'rejected' ? (
                        <div className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 font-medium">
                            <XCircle size={20} />
                            Access Request Denied
                        </div>
                    ) : (
                        <button
                            onClick={handleRequestAccess}
                            disabled={requesting}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {requesting ? "Sending..." : "Request Access"}
                        </button>
                    )}
                </div>
            )}

            {/* --- Report Modal --- */}
            {isReportModalOpen && (
                <ReportNote
                    noteId={noteId}
                    noteTitle={note.title}
                    onClose={() => setIsReportModalOpen(false)}
                />
            )}
        </div>
    );
}

export default NoteViewer;