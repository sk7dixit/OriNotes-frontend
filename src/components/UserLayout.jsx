import React, { useState } from 'react';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';

const UserLayout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const { user } = useAuth();

    // If the user is an admin, render the AdminLayout instead of the UserLayout
    // This allows admins to view "user" pages (like Dashboard) while seeing the Admin Sidebar
    if (user?.role === 'admin') {
        return <AdminLayout>{children}</AdminLayout>;
    }

    return (
        <div className="flex bg-slate-950 min-h-screen">
            {/* Sidebar */}
            <UserSidebar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
                isMobileOpen={isMobileNavOpen}
                setIsMobileOpen={setIsMobileNavOpen}
            />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-[88px]' : 'lg:ml-72'}`}>

                {/* Top Header */}
                <UserHeader
                    toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    isSidebarCollapsed={isSidebarCollapsed}
                    toggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
                />

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw]">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
