// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, Info, ArrowRight, BookOpen } from 'lucide-react';
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";
import Logo from "../components/ui/Logo";

const HowToUseModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
      <GlassCard className="max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-cyan-400 hover:text-white text-2xl font-bold transition-colors"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
          How to Use OriNotes
        </h2>
        <div className="space-y-4 text-gray-200 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex items-start space-x-3">
            <BookOpen className="w-6 h-6 text-emerald-400 mt-1" />
            <div>
              <strong className="text-emerald-300 block">Browse Notes</strong>
              <p className="text-sm">Go to the “Notes” tab to explore all shared notes from various courses and subjects.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 flex items-center justify-center bg-cyan-500/20 rounded-full text-cyan-400 font-bold text-xs mt-1">2</div>
            <div>
              <strong className="text-cyan-300 block">View & Study</strong>
              <p className="text-sm">Click “View Note” to open PDFs and study content directly in the browser.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 flex items-center justify-center bg-purple-500/20 rounded-full text-purple-400 font-bold text-xs mt-1">3</div>
            <div>
              <strong className="text-purple-300 block">Upload & Share</strong>
              <p className="text-sm">Use “Upload a Note” to share your material securely with the community.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 flex items-center justify-center bg-pink-500/20 rounded-full text-pink-400 font-bold text-xs mt-1">4</div>
            <div>
              <strong className="text-pink-300 block">Manage & Track</strong>
              <p className="text-sm">Visit “My Notes” to edit uploads and track views and badges.</p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Button onClick={onClose} variant="primary" className="w-full sm:w-auto">
            Got it, let's start!
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradientPosition, setGradientPosition] = useState(0);

  // Subtle background animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((prev) => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <HowToUseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <Logo size="md" />

          {/* Navigation/Auth Buttons */}
          <nav className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" icon={LogIn}>
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" icon={UserPlus}>
                Register
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div
        className="relative min-h-[calc(100vh-72px)] flex flex-col items-center justify-center text-white overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)`, // Fallback
        }}
      >
        {/* Dynamic Background Overlay */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: `linear-gradient(${gradientPosition}deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1), rgba(168,85,247,0.1))`,
            transition: "background 0.5s ease",
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="absolute bg-cyan-400/20 rounded-full animate-float blur-sm"
              style={{
                width: `${Math.random() * 10 + 4}px`,
                height: `${Math.random() * 10 + 4}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 15}s`,
              }}
            ></span>
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-fadeInUp">
          <div className="mb-6 inline-block">
            <span className="py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-medium tracking-wide">
              🚀 The Future of Note Sharing
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            WELCOME TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 drop-shadow-lg">OriNotes</span>
          </h1>

          <h2 className="text-2xl md:text-4xl font-bold text-slate-300 mb-8">
            <span className="text-cyan-400">Explore.</span> <span className="text-blue-400">Learn.</span> <span className="text-purple-400">Grow.</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Your secure, premium platform for accessing course notes, sharing knowledge, and collaborating with students worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              size="lg"
              icon={Info}
              className="w-full sm:w-auto min-w-[180px]"
            >
              How to Use
            </Button>

            <Link to="/notes" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                className="w-full sm:w-auto min-w-[180px] shadow-cyan-500/20 shadow-xl"
              >
                Start Browsing
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer / Contact */}
        <div className="absolute bottom-6 w-full text-center text-slate-500 text-sm z-10">
          <p>
            Questions? Contact us at{" "}
            <a
              href="mailto:OriNotes887@gmail.com"
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              OriNotes887@gmail.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;