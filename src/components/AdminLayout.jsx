import React from 'react';
// import AdminSidebar from './AdminSidebar'; // Removed as per request
import AdminNavbar from './admin/AdminNavbar';

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#0A0A0C] text-white font-inter">
            {/* Global Top Navbar */}
            <AdminNavbar />

            <div className="w-full transition-all duration-300">
                {/* Main Content Area */}
                {/* Added top padding to account for fixed navbar */}
                <div className="pt-20 p-4 sm:p-6 lg:p-8 min-h-screen">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
