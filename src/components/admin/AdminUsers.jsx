import React, { useEffect, useState } from "react";
import { User, Trash2, Eye, Calendar, Mail, FileText, CheckCircle, Clock } from "lucide-react";
import api from "../../services/api";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null); // For detail view side-panel
    const [userDetails, setUserDetails] = useState(null);   // Data for selected user
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/active-users");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return;

        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            // Close detail view if open for deleted user
            if (selectedUser?.id === userId) {
                setSelectedUser(null);
                setUserDetails(null);
            }
        } catch (err) {
            console.error("Failed to delete user", err);
            alert("Failed to delete user.");
        }
    };

    const handleViewDetails = async (user) => {
        setSelectedUser(user);
        setIsLoadingDetails(true);
        setUserDetails(null); // Reset
        try {
            const res = await api.get(`/admin/users/${user.id}/details`);
            setUserDetails(res.data);
        } catch (err) {
            console.error("Failed to fetch user details", err);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "Never";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Helper to calculate "Active Time" human readable (e.g. "2 hours ago")
    const timeAgo = (dateStr) => {
        if (!dateStr) return "Never";
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className="relative">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        User Management
                    </h2>
                    <p className="text-slate-400 mt-1">Manage active users and monitor activity.</p>
                </div>
                <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-white/5 text-sm text-slate-300 w-full md:w-auto text-center md:text-left">
                    Total Users: <span className="text-white font-bold ml-1">{users.length}</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
                </div>
            ) : (
                <div className="bg-slate-900/50 rounded-xl border border-white/10 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-sm">
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Joined</th>
                                <th className="p-4 font-medium">Last Active</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/10">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-slate-200">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">{user.email}</td>
                                    <td className="p-4 text-slate-400 text-sm">{formatDate(user.created_at)}</td>
                                    <td className="p-4 text-slate-400 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${!user.last_login ? 'bg-slate-500' : 'bg-green-500'}`} />
                                            {user.last_login ? timeAgo(user.last_login) : 'Never'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleViewDetails(user)}
                                                title="View Details"
                                                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                title="Delete User"
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No active users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Slide-over / Modal for User Details */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex justify-end" role="dialog">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedUser(null)}
                    ></div>

                    {/* Panel */}
                    <div className="relative w-full max-w-md bg-slate-900 h-full shadow-2xl border-l border-white/10 transform transition-transform overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{selectedUser.name}</h3>
                                    <p className="text-slate-400 text-sm">User Profile & Activity</p>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>

                            {isLoadingDetails ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                </div>
                            ) : userDetails ? (
                                <div className="space-y-8">
                                    {/* Profile Info */}
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 space-y-3">
                                        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold text-white">
                                                {userDetails.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">{userDetails.user.username}</div>
                                                <div className="text-xs text-slate-400 text-sm">{userDetails.user.email}</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                                            <div>
                                                <span className="text-slate-500 block text-xs uppercase mb-1">Joined</span>
                                                <span className="text-slate-200">{new Date(userDetails.user.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block text-xs uppercase mb-1">Status</span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${userDetails.user.is_verified ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                    {userDetails.user.is_verified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Uploads */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <FileText size={16} />
                                            Posted Content ({userDetails.notes.length})
                                        </h4>

                                        {userDetails.notes.length === 0 ? (
                                            <p className="text-slate-500 text-sm italic">No content uploaded yet.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {userDetails.notes.map(note => (
                                                    <div key={note.id} className="bg-slate-800/30 p-3 rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h5 className="font-medium text-slate-200 line-clamp-1 pr-2">{note.title}</h5>
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold
                                                    ${note.approval_status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                                                    note.approval_status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}
                                                `}>
                                                                {note.approval_status}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-slate-400 flex flex-wrap gap-2">
                                                            <span>{note.university_name}</span>
                                                            <span>•</span>
                                                            <span>{note.subject}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                                                            <div className="flex items-center gap-1">
                                                                <Clock size={12} />
                                                                {timeAgo(note.created_at)}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Eye size={12} />
                                                                {note.view_count || 0}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-red-400 mt-10">Failed to load user details.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
