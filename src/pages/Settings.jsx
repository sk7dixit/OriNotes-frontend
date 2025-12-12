import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Lock, Shield, Info, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingLabelInput from '../components/ui/FloatingLabelInput';
import Button from '../components/ui/Button';

// Tab Components
const ProfileSettings = ({ user, refreshUser }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        bio: user?.bio || '',
        university: user?.school_college || '',
        branch: user?.branch || '',
        semester: user?.semester || '',
        gender: user?.gender || '',
        github: user?.social_links?.github || '',
        linkedin: user?.social_links?.linkedin || '',
        website: user?.social_links?.website || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const payload = {
                name: formData.name,
                username: formData.username,
                bio: formData.bio,
                schoolCollege: formData.university,
                branch: formData.branch,
                semester: formData.semester,
                gender: formData.gender,
                social_links: {
                    github: formData.github,
                    linkedin: formData.linkedin,
                    website: formData.website
                }
            };

            await api.put('/users/profile', payload);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            refreshUser();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
            {message && (
                <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingLabelInput label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                <FloatingLabelInput label="Username" name="username" value={formData.username} onChange={handleChange} required />

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-1">Bio</label>
                    <textarea
                        name="bio"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[100px]"
                        placeholder="Tell us a bit about yourself..."
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </div>

                <FloatingLabelInput label="University / College" name="university" value={formData.university} onChange={handleChange} />
                <FloatingLabelInput label="Branch / Stream" name="branch" value={formData.branch} onChange={handleChange} placeholder="e.g. CSE" />
                <FloatingLabelInput label="Semester" name="semester" value={formData.semester} onChange={handleChange} placeholder="e.g. 5th" />

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="pt-6 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FloatingLabelInput label="GitHub URL" name="github" value={formData.github} onChange={handleChange} />
                    <FloatingLabelInput label="LinkedIn URL" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                    <FloatingLabelInput label="Portfolio / Website" name="website" value={formData.website} onChange={handleChange} />
                </div>
            </div>

            <div className="flex justify-end">
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};

const AccountSettings = ({ user }) => {
    return (
        <div className="space-y-6 animate-fade-in-up text-slate-400">
            <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                    <h3 className="text-white font-semibold flex items-center gap-2"><Lock size={16} /> Email Address</h3>
                    <p className="text-sm mt-1">{user.email}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">Verified</span>
            </div>
            <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                    <h3 className="text-white font-semibold flex items-center gap-2"><Lock size={16} /> Password</h3>
                    <p className="text-sm mt-1">Last changed 3 months ago</p>
                </div>
                <Link to="/change-password">
                    <Button variant="outline" className="text-xs">Change Password</Button>
                </Link>
            </div>
        </div>
    );
};

const AboutSettings = () => (
    <div className="space-y-6 animate-fade-in-up text-slate-300">
        <h3 className="text-xl font-bold text-white mb-4">About OriNotes</h3>
        <p className="leading-relaxed">
            Welcome to <strong>OriNotes</strong>, the premier platform for students and educators to share, discover, and organize high-quality study materials.
        </p>
        <p className="leading-relaxed">
            Our mission is to democratize education by making top-tier notes accessible to everyone. Whether you are a university student looking for semester notes or a lifelong learner exploring new subjects, OriNotes is built for you.
        </p>
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mt-4">
            <p className="text-indigo-300 text-sm">
                Built with passion by the OriNotes Team. © 2025
            </p>
        </div>
    </div>
);

const TermsSettings = () => (
    <div className="space-y-6 animate-fade-in-up text-slate-300">
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">1. Acceptance of Terms</h3>
            <p className="text-sm">By accessing or using OriNotes, you agree to comply with and be bound by these Terms and Conditions.</p>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">2. User Conduct</h3>
            <p className="text-sm">You agree not to upload any content that is illegal, offensive, or violates intellectual property rights. We reserve the right to remove any such content.</p>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">3. Content Ownership</h3>
            <p className="text-sm">You retain full ownership of the notes you upload. However, by uploading, you grant OriNotes a non-exclusive license to display and distribute your content on the platform.</p>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">4. Privacy Policy</h3>
            <p className="text-sm">Your privacy is important to us. Please review our Privacy Settings tab to understand how we handle your data.</p>
        </div>
    </div>
);

const ContactSettings = () => (
    <div className="space-y-8 animate-fade-in-up">
        <div>
            <p className="text-slate-300 mb-6">Have questions, feedback, or need assistance? We are here to help!</p>
        </div>

        <div className="bg-slate-900/30 p-6 rounded-2xl border border-white/5">
            <h4 className="text-white font-medium mb-4">Send us a message directly</h4>
            <ContactForm />
        </div>
    </div>
);

const ContactForm = () => {
    const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = React.useState(false);
    const [status, setStatus] = React.useState(null); // success | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting contact form:', formData);
        setLoading(true);
        setStatus(null);
        try {
            console.log('Sending API request to /users/contact...');
            const response = await api.post('/users/contact', formData);
            console.log('API Response:', response);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Contact Form Error:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {status === 'success' && <p className="text-green-400 text-sm">Message sent successfully! We'll be in touch.</p>}
            {status === 'error' && <p className="text-red-400 text-sm">Failed to send message. Please try again.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
                <input
                    type="email"
                    placeholder="Your Email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
            </div>
            <textarea
                placeholder="How can we help?"
                required
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 min-h-[100px]"
            ></textarea>
            <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                </Button>
            </div>
        </form>
    );
}

// Main Page Component
const Settings = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    const refreshUser = () => {
        window.location.reload();
    };

    if (authLoading) return null;

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'account', label: 'Account', icon: Lock },
        { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'about', label: 'About Us', icon: Info },
        { id: 'terms', label: 'Terms & Conditions', icon: FileText },
        { id: 'contact', label: 'Contact Us', icon: Mail },
    ];

    return (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-1">
                <h1 className="text-2xl font-bold text-white mb-6 px-2">Settings</h1>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 md:p-8 min-h-[500px]">
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4 capitalize">
                        {activeTab === 'terms' ? 'Terms & Conditions' : activeTab === 'contact' ? 'Contact Support' : `${activeTab} Settings`}
                    </h2>

                    {activeTab === 'profile' && <ProfileSettings user={user} refreshUser={refreshUser} />}
                    {activeTab === 'account' && <AccountSettings user={user} />}
                    {activeTab === 'privacy' && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                            <Shield size={48} className="mb-4 opacity-50" />
                            <p>Privacy settings are coming soon.</p>
                        </div>
                    )}
                    {activeTab === 'about' && <AboutSettings />}
                    {activeTab === 'terms' && <TermsSettings />}
                    {activeTab === 'contact' && <ContactSettings />}
                </div>
            </div>
        </div>
    );
};

export default Settings;

