import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ShieldCheck, FileText, Heart, AlertTriangle } from 'lucide-react';

const Guidelines = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-inter flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 px-4 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                            Community Guidelines
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            To keep OriNotes a helpful and safe place for everyone, we ask that you follow these guidelines.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Quality Standards */}
                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                                    <FileText size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-100">Content Quality</h2>
                            </div>
                            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                                <ul className="space-y-4 text-slate-300">
                                    <li className="flex gap-3">
                                        <span className="text-green-400 font-bold">✓</span>
                                        <p><strong>Legibility:</strong> Notes must be clear, readable, and well-scanned. Blurry or upside-down images will be rejected.</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-green-400 font-bold">✓</span>
                                        <p><strong>Relevance:</strong> Ensure your notes are correctly categorized by university, course, and unit. Misleading metadata harms the community.</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-green-400 font-bold">✓</span>
                                        <p><strong>Originality:</strong> Upload notes you have created or have explicit permission to share. Do not upload textbooks or copyrighted materials.</p>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Respectful Behavior */}
                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-pink-500/10 rounded-lg text-pink-400">
                                    <Heart size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-100">Respect & Safety</h2>
                            </div>
                            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                                <p className="text-slate-300 mb-4">
                                    OriNotes is a diverse community of students. We expect all interactions to be respectful and constructive.
                                </p>
                                <ul className="space-y-4 text-slate-300">
                                    <li className="flex gap-3">
                                        <span className="text-red-400 font-bold">✕</span>
                                        <p><strong>No Harassment:</strong> Bullying, hate speech, or harassment of any kind will not be tolerated.</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-red-400 font-bold">✕</span>
                                        <p><strong>No Spam:</strong> Do not upload irrelevant content, advertisements, or promotional materials.</p>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Copyright Compliance */}
                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400">
                                    <AlertTriangle size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-100">Copyright & Integrity</h2>
                            </div>
                            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                                <p className="text-slate-300">
                                    Respect the intellectual property of others. Only upload content that you have the right to share.
                                    If you believe your copyright has been infringed, please contact us immediately.
                                    Repeated violations may result in account suspension.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Guidelines;
