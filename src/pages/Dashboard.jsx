import React, { useState } from 'react';
import { LogOut, User, Menu, Search, Upload } from 'lucide-react';
// ⚠️ BROWSE NOTES MODAL IS REMOVED HERE because it should be its own page component

// Mock data and user name for demonstration
const userName = "Shashwat";
const userProfile = {
    notesViewed: 0,
    approvedUploads: 0,
    viewsOnNotes: 0,
    subscriptionStatus: "Free Tier"
};

const Dashboard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // ⚠️ Modal state removed: [showBrowseModal, setShowBrowseModal]

    const handleLogout = () => {
        // Implement your logout logic here
        console.log("Logging out...");
        setIsMenuOpen(false);
    };

    // ➡️ New handler to simulate navigation (You MUST use useNavigate() here in your actual code)
    const handleRedirectToBrowse = () => {
        // ⚠️ In a real app, you would use: navigate('/browse-notes');
        console.log("Redirecting to /browse-notes route...");
        // You must implement React Router's useNavigate() for this to work
    };

    // --- Dashboard Content (JSX) ---
    return (
        <div className="min-h-screen bg-[#070e17] text-white font-inter">

            {/* 1. HEADER (Fixed for mobile visibility) */}
            <header className="p-4 bg-[#121a28] shadow-lg sticky top-0 z-20">
                <div className="flex items-center justify-between">

                    {/* Left: Menu Button and Welcome Text (Unchanged) */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-full bg-cyan-700 hover:bg-cyan-600 transition"
                            aria-label="Toggle navigation menu"
                        >
                            <Menu className="w-6 h-6 text-white" />
                        </button>

                        {/* Welcome Text (Fixed to prevent wrapping/cutting off) */}
                        <div className="md:block">
                             <h1 className="text-xl font-bold text-gray-50 md:text-2xl whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-none">
                                Welcome Back, <span className="text-cyan-400">{userName}!</span>
                            </h1>
                        </div>
                    </div>

                    {/* ➡️ Right: RESTORED PROFILE/USER SECTION */}
                    <button
                        className="flex items-center space-x-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
                        aria-label="User Profile"
                        // Add link to profile page here if needed
                    >
                        <User className="w-6 h-6 text-cyan-400" />
                    </button>

                </div>
            </header>

            {/* 2. SIDEBAR NAVIGATION (Mobile Menu) */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-[#121a28] p-4 shadow-2xl z-30 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                <div className="flex justify-end mb-8">
                    <button className="text-gray-400 hover:text-white text-3xl font-light" onClick={() => setIsMenuOpen(false)}>
                        &times;
                    </button>
                </div>

                <div className="space-y-4">
                    {/* My Profile Link/Button */}
                    <button
                        className="w-full flex items-center space-x-3 p-3 rounded-lg bg-cyan-700 bg-opacity-20 hover:bg-opacity-30 transition"
                        onClick={() => { console.log("Navigating to My Profile"); setIsMenuOpen(false); }}
                    >
                        <User className="w-5 h-5 text-cyan-400" />
                        <span className="text-lg font-semibold text-cyan-200">My Profile</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition shadow-md"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* 3. MAIN DASHBOARD CONTENT */}
            <main className="p-4 md:p-8">

                {/* 4-Stat Grid (Responsive layout) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                    <Card icon="📚" title="Notes Viewed" value={userProfile.notesViewed} color="bg-red-700" />
                    <Card icon="✅" title="Approved Uploads" value={userProfile.approvedUploads} color="bg-green-700" />
                    <Card icon="👁️" title="Views on Your Notes" value={userProfile.viewsOnNotes} color="bg-purple-700" />
                    <Card icon="⭐" title="Subscription Status" value={userProfile.subscriptionStatus} color="bg-yellow-700" details="Free Views Used: 0 / 2" />
                </div>

                {/* Your Achievements Section */}
                <h2 className="text-3xl font-bold text-gray-50 mt-8 mb-6">Your Achievements</h2>
                <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center">
                        <div className="text-5xl mb-2">⏳</div>
                        <span className="text-gray-300">OG Member</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer">
                        <div className="w-16 h-16 border-4 border-gray-600 rounded-full flex items-center justify-center text-4xl text-gray-400 hover:border-cyan-400 transition">
                            +
                        </div>
                        <span className="text-gray-300 mt-2">View All</span>
                    </div>
                </div>

                {/* Ready for more? Section (Buttons) */}
                <div className="mt-12 p-6 bg-[#1f283a] rounded-xl shadow-lg border border-gray-700">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-3">Ready for more?</h3>
                    <p className="text-gray-300 mb-6">
                        Contribute to the community or find the perfect notes for your next exam.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        {/* Upload Button */}
                        <button className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center space-x-2">
                            <Upload className="w-5 h-5" />
                            <span>Upload a Note</span>
                        </button>
                        {/* Browse Button - NOW REDIRECTS */}
                        <button
                            onClick={handleRedirectToBrowse} // ⬅️ The button now redirects to the Browse Page
                            className="flex-1 bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-700 transition shadow-md flex items-center justify-center space-x-2"
                        >
                            <Search className="w-5 h-5" />
                            <span>Browse Notes</span>
                        </button>
                    </div>
                </div>

            </main>

        </div>
    );
};

// Helper Stat Card Component
const Card = ({ icon, title, value, color, details }) => (
    <div className={`p-4 rounded-xl shadow-lg ${color} bg-opacity-30 border-t-4 border-b-4 border-opacity-70 flex flex-col justify-between h-32`}>
        <div>
            <p className="text-sm text-gray-300 font-medium">{title}</p>
            <h3 className="text-3xl font-extrabold mt-1">
                {value}
            </h3>
        </div>
        {details && (
            <p className="text-xs font-semibold text-yellow-300 pt-1 border-t border-gray-700 mt-2">
                {details}
            </p>
        )}
    </div>
);


export default Dashboard;