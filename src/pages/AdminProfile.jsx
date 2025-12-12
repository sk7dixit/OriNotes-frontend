import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Shield, User, Mail, Hash, Briefcase, ArrowLeft } from 'lucide-react';

export default function AdminProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-300 font-sans selection:bg-purple-500/30">
            <main className="max-w-4xl mx-auto pt-24 pb-12 px-6 lg:px-8">

                {/* Page Header (Minimal) */}
                <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-4">
                    <button
                        onClick={() => navigate('/admin-dashboard')}
                        className="p-2 -ml-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-white tracking-tight">My Profile</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Manage your personal information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 items-start">

                    {/* Identity Card */}
                    <div className="bg-[#111625] rounded-xl border border-white/5 p-6 flex flex-col items-center text-center">
                        <div className="relative group mb-4">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                                {user?.name?.[0] || 'A'}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shadow-lg" title="Change Photo">
                                <Camera size={14} />
                            </button>
                        </div>

                        <h2 className="text-lg font-bold text-white">{user?.name}</h2>
                        <p className="text-sm text-slate-400 mb-3">@{user?.username}</p>

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-6">
                            <Shield size={10} /> Admin
                        </span>

                        <div className="w-full max-w-xs border-t border-white/5 pt-4 flex justify-between items-center text-sm">
                            <span className="text-slate-500">Status</span>
                            <span className="flex items-center gap-1.5 text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Active
                            </span>
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="bg-[#111625] rounded-xl border border-white/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Personal Information</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 uppercase">Full Name</label>
                                <div className="flex items-center gap-3 text-slate-200 bg-black/20 px-3 py-2.5 rounded-lg border border-white/5">
                                    <User size={16} className="text-slate-500" />
                                    <span>{user?.name}</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 uppercase">Username</label>
                                <div className="flex items-center gap-3 text-slate-200 bg-black/20 px-3 py-2.5 rounded-lg border border-white/5">
                                    <Hash size={16} className="text-slate-500" />
                                    <span>{user?.username}</span>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 uppercase">Email Address</label>
                                <div className="flex items-center gap-3 text-slate-200 bg-black/20 px-3 py-2.5 rounded-lg border border-white/5">
                                    <Mail size={16} className="text-slate-500" />
                                    <span>{user?.email}</span>
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 uppercase">Bio</label>
                                <textarea
                                    readOnly={!isEditing}
                                    rows="3"
                                    className="w-full bg-black/20 text-slate-200 px-3 py-2.5 rounded-lg border border-white/5 focus:outline-none focus:border-blue-500/50 resize-none text-sm"
                                    defaultValue={user?.bio || "No bio added yet."}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Admin Info */}
                    <div className="bg-[#111625] rounded-xl border border-white/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Admin Role & Permissions</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                <Shield className="text-blue-400 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-blue-100">Admin</h4>
                                    <p className="text-xs text-blue-300/70 mt-1">You have full access to all system resources, including user management, content approval, and system settings.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Assigned Categories</label>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-white/5">Engineering</span>
                                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-white/5">Computer Science</span>
                                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-white/5">Medical</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-500 uppercase">Approval Level</label>
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Briefcase size={14} className="text-slate-500" />
                                        <span>Level 3 (Final Approval)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

