import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Calendar, Upload, BookOpen, Download, Trophy, Edit3, Share2, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Flame, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, fetchUnreadCount } = useAuth();
    const [stats, setStats] = useState({ approved: 0, pending: 0, rejected: 0, total_views: 0, total_downloads: 0 });
    const [recentUploads, setRecentUploads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                setLoading(true);
                // 1. Fetch Stats
                const statsPromise = api.get('/users/stats');
                // 2. Fetch Recent Uploads
                const uploadsPromise = api.get('/notes/my-notes');

                const [statsRes, uploadsRes] = await Promise.all([statsPromise, uploadsPromise]);

                setStats(statsRes.data);
                setRecentUploads(uploadsRes.data.slice(0, 4));
            } catch (error) {
                console.error("Failed to load profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProfileData();
    }, []);

    const handleShareProfile = () => {
        const link = `${window.location.origin}/profile/${user?.username}`;
        navigator.clipboard.writeText(link);
        alert("Profile link copied to clipboard!");
    };

    const handleAddSkill = async () => {
        const skill = prompt("Enter a new skill:");
        if (!skill) return;

        try {
            const currentSkills = user.skills || [];
            // Basic validation
            if (currentSkills.includes(skill)) {
                alert("Skill already exists!");
                return;
            }

            // Backend update
            await api.put('/users/profile', { skills: [...currentSkills, skill] });
            // Reload to refresh user context
            window.location.reload();
        } catch (error) {
            console.error("Failed to add skill:", error);
            alert("Failed to save skill.");
        }
    };

    const calculateLevel = (approvedNotes) => {
        if (approvedNotes >= 50) return { name: 'Expert Contributor', color: 'text-purple-400', bg: 'bg-purple-500/10' };
        if (approvedNotes >= 20) return { name: 'Pro Contributor', color: 'text-indigo-400', bg: 'bg-indigo-500/10' };
        if (approvedNotes >= 5) return { name: 'Active Learner', color: 'text-teal-400', bg: 'bg-teal-500/10' };
        return { name: 'Beginner', color: 'text-slate-400', bg: 'bg-slate-800' };
    };

    const contributorLevel = calculateLevel(stats.realStats?.totalUploads || 0);

    if (loading) return (
        <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
            <div className="animate-pulse text-cyan-500 font-medium">Loading profile...</div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-12 p-6 md:p-0">

            {/* 1. Identity Header */}
            <div className="relative bg-slate-900/50 border border-white/5 rounded-3xl p-8 overflow-hidden z-0 shadow-2xl">
                {/* Animated Blur Background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-cyan-600/30 z-0 animate-pulse"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end gap-6 mt-12">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-4xl font-bold text-white shadow-xl relative group">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 to-purple-400">
                                {user?.name?.charAt(0)}
                            </span>
                        )}
                        <Link to="/settings" className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            <Edit3 size={16} />
                        </Link>
                    </div>

                    {/* Info */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3 flex-wrap">
                                    {user?.name}
                                    <span className={`text-xs px-3 py-1 rounded-full border border-white/5 ${contributorLevel.bg} ${contributorLevel.color} flex items-center gap-1`}>
                                        <Award size={12} />
                                        {contributorLevel.name}
                                    </span>
                                </h1>
                                <p className="text-slate-400">@{user?.username} • Joined {new Date(user?.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-3">
                                <Link to="/settings" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-white/5">
                                    Edit Profile
                                </Link>
                                <button onClick={handleShareProfile} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-white/5 hover:text-white transition-colors" title="Share Profile">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Quick User Details Row */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                            {user?.university && <div className="flex items-center gap-1"><GraduationCap size={14} /> {user.university}</div>}
                            {user?.branch && <div className="flex items-center gap-1"><BookOpen size={14} /> {user.branch}</div>}
                            {user?.location && <div className="flex items-center gap-1"><MapPin size={14} /> {user.location || 'India'}</div>}

                            {/* Social Links */}
                            <div className="flex gap-3 ml-auto">
                                {user?.social_links?.github && <a href={user.social_links.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Github size={16} /></a>}
                                {user?.social_links?.linkedin && <a href={user.social_links.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Linkedin size={16} /></a>}
                                {user?.social_links?.website && <a href={user.social_links.website} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Globe size={16} /></a>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                {user?.bio && (
                    <p className="mt-6 text-slate-300 max-w-2xl leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-white/5">
                        {user.bio}
                    </p>
                )}
            </div>

            {/* 2. Stats Grid with Streak */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-3xl hover:bg-slate-800/50 transition-colors group">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                            <Upload size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Uploads</p>
                            <h3 className="text-2xl font-bold text-white">{stats.realStats?.totalUploads || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-3xl hover:bg-slate-800/50 transition-colors group">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Reads</p>
                            <h3 className="text-2xl font-bold text-white">{stats.realStats?.readsCount || 0}</h3>
                        </div>
                    </div>
                </div>

                {/* Streak Card */}
                <div className="p-6 bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-3xl hover:border-orange-500/40 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Flame size={64} />
                    </div>
                    <div className="flex items-center gap-4 mb-2 relative z-10">
                        <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl group-hover:scale-110 transition-transform">
                            <Flame size={24} />
                        </div>
                        <div>
                            <p className="text-orange-300/70 text-xs uppercase tracking-wider font-semibold">Streak</p>
                            <h3 className="text-2xl font-bold text-white">{stats.realStats?.streak || 0} Days</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Skills & Badges (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Badges & Skills */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Skills / Interests */}
                    <div className="p-6 bg-slate-900/50 border border-white/5 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Top Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {user?.skills && user.skills.length > 0 ? (
                                user.skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-slate-500 text-xs italic">No skills added yet.</span>
                            )}
                            <button
                                onClick={handleAddSkill}
                                className="px-3 py-1 bg-slate-800/50 text-slate-500 text-xs rounded-lg border border-dashed border-slate-700 hover:text-white hover:border-slate-500 transition-colors"
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900/50 border border-white/5 rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Earned Badges</h3>
                            <Link to="/my-badges" className="text-xs text-indigo-400 hover:text-indigo-300">View All</Link>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="aspect-square bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-white/5 hover:border-indigo-500/30 transition-colors cursor-help group/badge">
                                <Trophy size={24} className="text-yellow-500 mb-2 group-hover/badge:scale-110 transition-transform" />
                                <span className="text-[10px] text-slate-400">Early Bird</span>
                            </div>
                            <div className="aspect-square bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-white/5 hover:border-indigo-500/30 transition-colors opacity-50 grayscale">
                                <Trophy size={24} className="text-slate-500 mb-2" />
                                <span className="text-[10px] text-slate-500">Udder</span>
                            </div>
                            <div className="aspect-square bg-slate-800 rounded-2xl flex flex-col items-center justify-center border border-white/5 hover:border-indigo-500/30 transition-colors opacity-50 grayscale">
                                <Trophy size={24} className="text-slate-500 mb-2" />
                                <span className="text-[10px] text-slate-500">Writer</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Uploads</h2>
                        <Link to="/my-uploads" className="text-sm text-indigo-400 hover:text-indigo-300">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {recentUploads.length > 0 ? recentUploads.map(note => (
                            <div key={note.id} className="group p-4 bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 rounded-2xl flex items-center gap-4 transition-all">
                                <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                                    <BookOpen size={20} className="text-slate-400 group-hover:text-indigo-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-semibold truncate">{note.title}</h4>
                                    <p className="text-xs text-slate-400">{note.subject} • {new Date(note.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 text-sm">
                                    <span className="flex items-center gap-1"><BookOpen size={14} /> {note.view_count || 0}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 bg-slate-900/30 rounded-3xl border border-white/5 border-dashed">
                                <p className="text-slate-400 mb-4">You haven't uploaded any notes yet.</p>
                                <Link to="/my-uploads">
                                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors">
                                        Upload your first note
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;