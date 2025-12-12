import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Globe, Shield, ArrowRight } from 'lucide-react'; // Removed Search
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import NoteCard from '../components/ui/NoteCard';
import api from '../services/api';
import Footer from '../components/layout/Footer';


const Home = () => {
  const [universities, setUniversities] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const FEATURED_UNIVERSITIES = [
    "Dr. A.P.J. Abdul Kalam Technical University",
    "University of Delhi",
    "Banaras Hindu University",
    "University of Mumbai",
    "Chandigarh University",
    "Jawaharlal Nehru University",
    "Amity University, Noida",
    "Lovely Professional University"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uniRes, notesRes] = await Promise.all([
          api.get('/notes/available-subjects'),
          api.get('/notes/filtered') // By default returns newest
        ]);

        // If backend has universities, use them. Otherwise, show featured ones to populate the UI.
        const backendUnis = uniRes.data.universities || [];
        if (backendUnis.length > 0) {
          setUniversities(backendUnis);
        } else {
          setUniversities(FEATURED_UNIVERSITIES);
        }

        // Map backend snake_case to frontend NoteCard props
        const mappedNotes = (notesRes.data || []).slice(0, 6).map(note => ({
          ...note,
          university: note.university_name,
          views: note.view_count,
          author: note.username || 'Anonymous'
        }));
        setRecentNotes(mappedNotes);
      } catch (error) {
        console.error("Failed to fetch landing page data:", error);
        // Fallback in case of API error
        setUniversities(FEATURED_UNIVERSITIES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm text-slate-400 mb-8 animate-fadeInUp">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {recentNotes.length > 0 ? `Over ${recentNotes.length}+ Verified Notes Available` : 'Share & Discover Verified Notes'}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Your notes, organized <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              by university.
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Browse study materials from top universities. <br /> Access high-quality notes shared by students like you.
          </p>

          {/* Dynamic Universities Grid */}
          <div className="max-w-5xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-6">Popular Universities</h3>

            {loading ? (
              <div className="flex justify-center gap-4">
                <div className="w-32 h-10 bg-slate-900 rounded-lg animate-pulse" />
                <div className="w-32 h-10 bg-slate-900 rounded-lg animate-pulse" />
                <div className="w-32 h-10 bg-slate-900 rounded-lg animate-pulse" />
              </div>
            ) : universities.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4">
                {universities.map((uni) => (
                  <button
                    key={uni}
                    onClick={() => navigate(`/notes?university_name=${encodeURIComponent(uni)}`)}
                    className="px-6 py-3 rounded-full bg-slate-900/50 border border-white/5 hover:border-green-500/30 hover:bg-slate-800 transition-all text-slate-300 hover:text-white font-medium shadow-lg hover:shadow-green-500/10"
                  >
                    {uni}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No universities added yet.</p>
            )}

            <div className="mt-8">
              <Link to="/notes">
                <Button variant="primary" className="px-8">Browse All Notes</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Uploads Section */}
      <section className="py-20 px-4 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recent Uploads</h2>
              <p className="text-slate-400">Fresh study material added by the community.</p>
            </div>
            <Link to="/notes" className="text-green-400 hover:text-green-300 flex items-center gap-1 font-medium hidden md:flex">
              View All <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-900 rounded-2xl animate-pulse" />)}
            </div>
          ) : recentNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => navigate(`/notes/view/${note.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
              <p className="text-slate-400">No notes uploaded yet. Be the first!</p>
              <Link to="/upload" className="inline-block mt-4 text-green-400 font-medium">Upload Notes</Link>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/notes" className="text-green-400 font-medium">View All Notes &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Features Grid - ID for navigation */}
      <section id="features" className="py-24 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why choose OriNotes?</h2>
            <p className="text-slate-400">Everything you need to ace your exams.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={CheckCircle}
              color="text-green-400"
              title="Verified Notes"
              desc="Every note is checked for quality and relevance before being published."
            />
            <FeatureCard
              icon={Globe}
              color="text-blue-400"
              title="Multi-University"
              desc="Support for major universities with specific course filters."
            />
            <FeatureCard
              icon={Shield}
              color="text-purple-400"
              title="Secure & Free"
              desc="Access notes for free. Your data is always secure with us."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section - Restored */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it Works</h2>
            <p className="text-slate-400">Get started in 3 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center relative">
            <div className="hidden md:block absolute top-12 left-[16%] w-[68%] h-0.5 bg-slate-800 -z-10" />

            {[
              { step: '1', title: 'Search', desc: 'Find your university and subject.' },
              { step: '2', title: 'Study', desc: 'Read high-quality notes online.' },
              { step: '3', title: 'Ace It', desc: 'Study smart and clear your exams.' }
            ].map((item) => (
              <div key={item.step} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-6 border-4 border-slate-950">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to share your knowledge?</h2>
            <p className="text-green-50 text-lg mb-8 max-w-2xl mx-auto">
              Help thousands of students by sharing your notes. Earn badges and recognition in the community.
            </p>
            <Link to="/register">
              <button className="bg-white text-green-600 font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Become a Contributor
              </button>
            </Link>
          </div>
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl opacity-50" />
        </div>
      </section>

      <footer className="border-t border-slate-800 py-12 bg-slate-950 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} OriNotes. All rights reserved.</p>
      </footer>

    </div>
  );
};

const FeatureCard = ({ icon: Icon, color, title, desc }) => (
  <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition hover:bg-slate-900/80 group">
    <div className={`w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${color}`}>
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-slate-100">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default Home;