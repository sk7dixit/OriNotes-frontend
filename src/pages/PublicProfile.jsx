import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, FileText, BadgeCheck, Shield, Lock, Eye, Send } from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const PublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null); // noteId being requested

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    console.log("Fetching profile for ID:", userId);
    try {
      // Using the new endpoint
      const res = await api.get(`/users/public-profile/${userId}`);
      console.log("Profile data received:", res.data);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch public profile", err);
      // Optionally set error state to show message
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (noteId) => {
    if (!confirm("Request access to this note?")) return;
    setRequesting(noteId);
    try {
      await api.post(`/notes/access/request/${noteId}`);
      alert("Access request sent to the owner.");
    } catch (err) {
      console.error("Request failed", err);
      alert("Failed to send request. You might have already requested.");
    } finally {
      setRequesting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center pt-24 text-white">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center text-gray-400 pt-24 relative z-10">
        <User size={48} className="mb-4 text-gray-600" />
        <p>User not found (ID: {userId}).</p>
        <Link to="/browse-notes" className="text-cyan-500 mt-4 hover:underline">Back to Browse</Link>
      </div>
    );
  }

  const { user, notes } = profile;

  return (
    <div className="min-h-screen bg-[#0A0A0C] pt-4 pb-12 px-4 sm:px-6 lg:px-8 font-inter text-gray-100 relative z-0">
      {/* Debug Info (visible if layout is weird) */}
      {/* <div className="text-xs text-gray-600 mb-2">Debug: User {user.id} loaded</div> */}

      <div className="max-w-5xl mx-auto space-y-8">

        {/* Profile Header */}
        <GlassCard className="p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-white/10 flex items-center justify-center shadow-2xl relative group">
            <span className="text-3xl font-bold bg-gradient-to-br from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {user.username?.[0]?.toUpperCase()}
            </span>
            {/* Status Dot */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#0A0A0C] rounded-full"></div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">{user.username}</h1>
            <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start gap-2">
              Privacy Protected
              <Shield size={14} className="text-green-400" />
            </p>

            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
                {user.badges.map((badge, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <BadgeCheck size={12} /> {badge}
                  </span>
                ))}
              </div>
            )}
            {(!user.badges || user.badges.length === 0) && (
              <div className="text-xs text-gray-500 italic mt-2">No badges earned yet.</div>
            )}
          </div>

          <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/5 text-center">
            <div className="text-2xl font-bold text-cyan-400">{notes.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">uploads</div>
          </div>
        </GlassCard>

        {/* Notes Grid */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="text-purple-500" /> Uploaded Notes
          </h2>

          {notes.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">
              No approved notes to display.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map(note => (
                <motion.div
                  key={note.id}
                  whileHover={{ y: -5 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-gray-800 rounded-lg text-cyan-400">
                      <FileText size={24} />
                    </div>
                    <div className="px-2 py-1 rounded bg-gray-800 text-[10px] text-gray-400 font-mono">
                      {note.material_type === 'personal_material' ? 'Private' : 'Public'}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-1 truncate" title={note.title}>{note.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 truncate">{note.subject} • {note.university_name || 'Uni'}</p>

                  <div className="grid grid-cols-1 gap-2 mt-4 pt-4 border-t border-white/5">
                    {/* View Button (if public/standard) */}
                    <Link to={`/notes/view/${note.id}`} className="block w-full">
                      <button className="w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Eye size={16} /> View Preview
                      </button>
                    </Link>

                    {/* Request Access Button */}
                    <button
                      onClick={() => handleRequestAccess(note.id)}
                      disabled={requesting === note.id}
                      className="w-full py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-sm font-medium transition-colors border border-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Lock size={14} />
                      {requesting === note.id ? "Sending..." : "Request Access"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PublicProfile;