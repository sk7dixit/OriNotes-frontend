import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Shield, Key, Smartphone, AlertTriangle, Activity, FileText, ArrowLeft, X, Save, Loader } from 'lucide-react';

export default function AdminSecurity() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
    const [passLoading, setPassLoading] = useState(false);
    const [passMsg, setPassMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await api.get('/users/sessions');
            setSessions(res.data);
        } catch (err) {
            console.error("Failed to fetch sessions", err);
        } finally {
            setLoadingSessions(false);
        }
    };

    const handleRevokeAll = async () => {
        if (!window.confirm("Are you sure you want to log out of all devices?")) return;
        try {
            await api.delete('/users/sessions');
            setSessions([]);
            // Optionally redirect to login if current session is also revoked, 
            // but for better UX usually we keep the current one or warn user.
            // Backend implementation revokes ALL, so frontend will unauthorized on next request.
            // We should probably redirect to login.
            navigate('/login');
        } catch (err) {
            console.error("Failed to revoke sessions", err);
        }
    };

    const handlePassChange = (e) => {
        setPassData({ ...passData, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        setPassLoading(true);
        setPassMsg({ type: '', text: '' });

        try {
            await api.put('/users/change-password', passData);
            setPassMsg({ type: 'success', text: 'Password changed successfully!' });
            setPassData({ oldPassword: '', newPassword: '' });
            setTimeout(() => setShowPasswordForm(false), 2000);
        } catch (err) {
            setPassMsg({ type: 'error', text: err.response?.data?.error || 'Failed to change password' });
        } finally {
            setPassLoading(false);
        }
    };

    // Helper to format User Agent
    const parseUserAgent = (ua) => {
        if (!ua) return 'Unknown Device';
        if (ua.includes('Windows')) return 'Windows PC';
        if (ua.includes('Mac')) return 'Mac';
        if (ua.includes('iPhone')) return 'iPhone';
        if (ua.includes('Android')) return 'Android';
        return 'Other Device';
    };

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
                        <h1 className="text-2xl font-semibold text-white tracking-tight">Security & Account</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Manage your security preferences and active sessions</p>
                    </div>
                </div>

                <div className="space-y-6">

                    {/* Security Settings */}
                    <section className="bg-[#111625] rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5">
                            <h3 className="text-sm font-semibold text-white">Security</h3>
                        </div>
                        <div className="p-4 space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-200">Two-Factor Auth</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Extra layer of security</p>
                                </div>
                                {/* Mock Toggle */}
                                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${user?.is_two_factor_enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${user?.is_two_factor_enabled ? 'left-6' : 'left-1'}`}></div>
                                </div>
                            </div>
                            <div className="w-full h-px bg-white/5"></div>

                            <div className="w-full h-px bg-white/5"></div>

                            {/* Change Password Section */}
                            {!showPasswordForm ? (
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-colors"
                                >
                                    <span className="flex items-center gap-2"><Key size={14} /> Change Password</span>
                                    <span className="text-slate-500 text-xs">Last change: 30d</span>
                                </button>
                            ) : (
                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-medium text-white flex items-center gap-2"><Key size={14} /> Change Password</h4>
                                        <button onClick={() => setShowPasswordForm(false)} className="text-slate-400 hover:text-white"><X size={14} /></button>
                                    </div>
                                    <form onSubmit={submitPasswordChange} className="space-y-3">
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Old Password</label>
                                            <input
                                                type="password"
                                                name="oldPassword"
                                                value={passData.oldPassword}
                                                onChange={handlePassChange}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                                                placeholder="Enter current password"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passData.newPassword}
                                                onChange={handlePassChange}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                                                placeholder="Enter new password"
                                                required
                                            />
                                        </div>

                                        {passMsg.text && (
                                            <p className={`text-xs ${passMsg.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {passMsg.text}
                                            </p>
                                        )}

                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="submit"
                                                disabled={passLoading}
                                                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {passLoading ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
                                                Update Password
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <button className="w-full flex items-center justify-between px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-colors">
                                <span className="flex items-center gap-2"><Smartphone size={14} /> Recovery Codes</span>
                            </button>
                        </div>
                    </section>

                    <section className="bg-[#111625] rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white">Active Sessions</h3>
                            <button onClick={handleRevokeAll} className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke All</button>
                        </div>
                        <div className="divide-y divide-white/5">
                            {loadingSessions ? (
                                <div className="p-8 flex justify-center text-slate-500">
                                    <Loader size={20} className="animate-spin" />
                                </div>
                            ) : sessions.length === 0 ? (
                                <div className="p-4 text-center text-xs text-slate-500">No active sessions found (weird)</div>
                            ) : (
                                sessions.map(session => (
                                    <div key={session.id} className="p-4 flex items-start gap-3">
                                        <div className={`mt-1 p-1.5 rounded-full ${session.isCurrent ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                                            <Activity size={12} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-slate-300 truncate">
                                                {parseUserAgent(session.device)}
                                                {session.isCurrent && <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">Current</span>}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5 truncate" title={session.device}>
                                                {session.ip} • Started {new Date(session.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>


                </div>
            </main>
        </div>
    );
}
