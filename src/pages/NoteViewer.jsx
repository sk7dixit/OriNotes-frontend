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
    const { user, refreshUser } = useAuth();
    const [ratings, setRatings] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(true);
    const [avgRating, setAvgRating] = useState("N/A");

    // UX States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        const fetchRatings = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/notes/${noteId}/ratings`);
                // Backend returns { average, ratings: [...] }
                if (res.data.ratings && Array.isArray(res.data.ratings)) {
                    setRatings(res.data.ratings);
                    setAvgRating(res.data.average || "N/A");

                    // Pre-fill user's existing review
                    const myReview = res.data.ratings.find(r => r.username === user?.username);
                    if (myReview) {
                        setUserRating(myReview.rating);
                        setReviewText(myReview.review_text);
                        // If they already reviewed, maybe we don't show success message immediately, 
                        // but we just show the form populated. 
                        // But user asked to "disappear that review from the below notes" (likely meaning hide form).
                        // Let's confusingly keep the form but make it look like an "Edit" mode or hide it?
                        // "once user give the review then diappear that review from the below notes" 
                        // --> likely means: Don't show the input form if I've already reviewed?
                        // Let's implement: If has review -> 'Edit Review' button reveals form?
                        // For now, let's just show success message after SUBMIT actions.
                    }
                } else if (Array.isArray(res.data)) {
                    setRatings(res.data);
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
    }, [noteId, user?.username]);

    const handleRating = (rate) => { setUserRating(rate); };

    const handleSubmitReview = async () => {
        if (userRating === 0) {
            alert("Please select a star rating before submitting.");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post(`/notes/${noteId}/rate`, { rating: userRating, review_text: reviewText });
            await refreshUser(); // Update user stats if needed

            // Re-fetch ratings to update list
            const res = await api.get(`/notes/${noteId}/ratings`);
            if (res.data.ratings) {
                setRatings(res.data.ratings);
                setAvgRating(res.data.average || "N/A");
            } else {
                setRatings(res.data);
            }

            setSubmitSuccess(true);
            // Hide success message after 3s
            setTimeout(() => setSubmitSuccess(false), 3000);

        } catch (err) {
            alert("Failed to submit review. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if user has already reviewed
    const hasReviewed = ratings.some(r => r.username === user?.username);

    return (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                Ratings & Reviews
                <span className="text-yellow-400 text-2xl bg-yellow-400/10 px-3 py-1 rounded-lg border border-yellow-400/20">
                    {avgRating} ★
                </span>
            </h2>

            {/* Review Form Area */}
            <div className="mb-8 p-6 bg-gray-900/50 border border-gray-700 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">
                        {hasReviewed ? "Edit Your Review" : "Write a Review"}
                    </h3>
                    {submitSuccess && (
                        <span className="text-green-400 flex items-center gap-2 text-sm font-medium animate-pulse">
                            <CheckCircle size={16} /> Review Submitted!
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <Rating
                        onClick={handleRating}
                        initialValue={userRating}
                        size={32}
                        transition
                        allowFraction={false}
                        fillColor='#facc15'
                        emptyColor='#374151'
                        SVGstyle={{ display: 'inline' }}
                    />
                    <span className={`text-sm font-medium ${userRating > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {userRating ? `${userRating} Stars` : 'Tap stars to rate'}
                    </span>
                </div>

                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts on this note (optional)..."
                    rows="3"
                    className="w-full p-4 rounded-xl bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none resize-none"
                />

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting || userRating === 0}
                        className={`
                            px-6 py-2.5 rounded-xl font-bold text-white transition-all flex items-center gap-2
                            ${isSubmitting || userRating === 0
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95'}
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            hasReviewed ? "Update Review" : "Submit Review"
                        )}
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading reviews...</div>
                ) : ratings.length > 0 ? (
                    ratings.map((r, index) => (
                        <div key={index} className="p-4 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700/50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                        {r.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-200 block text-sm leading-tight">{r.username}</span>
                                        <span className="text-[10px] text-gray-500">{formatDate(r.created_at)}</span>
                                    </div>
                                </div>
                                <div className="flex bg-gray-900 px-2 py-1 rounded-lg">
                                    <Rating initialValue={r.rating} readonly size={16} fillColor='#facc15' emptyColor='#374151' />
                                </div>
                            </div>
                            {r.review_text && (
                                <p className="text-gray-300 text-sm pl-11">{r.review_text}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                        <p className="text-gray-400">No reviews yet.</p>
                        <p className="text-sm text-gray-500 mt-1">Be the first to rate this note!</p>
                    </div>
                )}
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
        <div className="w-full min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0A0A0C] text-white font-inter">
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