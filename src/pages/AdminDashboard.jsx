import React, { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
// import AdminNavbar from "../components/admin/AdminNavbar";
import AdminOverview from "../components/admin/AdminOverview";
import AdminNotes from "../components/admin/AdminNotes";
import AdminUsers from "../components/admin/AdminUsers";
import AdminApprovals from "../components/admin/AdminApprovals";
import AdminUpload from "../components/admin/AdminUpload";
import AdminFeedback from "../components/admin/AdminFeedback"; // New Feedback Component
import AdminDeleteRequests from "../components/admin/AdminDeleteRequests"; // New Delete Request Component
import AdminSettings from "./AdminSettings";

// Placeholder Components for Tabs not yet fully implemented
const PlaceholderTab = ({ name }) => (
  <div className="flex flex-col items-center justify-center h-96 text-slate-500">
    <h2 className="text-2xl font-bold text-white mb-2">{name} Module</h2>
    <p>This section is under construction as per the new design specs.</p>
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  // Sync tab updates if URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        // We can optimize this later to only fetch data relevant to the active tab
        const response = await api.get("/admin/dashboard");
        if (!mounted) return;
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch admin data.", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [activeTab]); // Potentially re-fetch or fetch specific data when tab changes

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview data={data || {}} />;
      case 'notes':
        return <AdminNotes />;
      case 'users':
        return <AdminUsers />;
      case 'approvals':
        return <AdminApprovals />;
      case 'upload':
        return <AdminUpload />;
      case 'feedback':
        return <AdminFeedback />; // New Feedback Tab
      case 'delete-requests':
        return <AdminDeleteRequests />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview data={data || {}} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter">
      {/* Top Navigation - Managed by Layout */}
      {/* <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} /> */}

      {/* Main Content - No Sidebar */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}