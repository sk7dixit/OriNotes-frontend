import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Search, Upload, Users, BookOpen } from 'lucide-react';

const HelpCenter = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-inter flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 px-4 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                            Help Center
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Everything you need to know about using OriNotes optimally.
                        </p>
                    </div>

                    <div className="grid gap-8">
                        {/* Section 1: Finding Notes */}
                        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-green-500/30 transition-colors">
                            <div className="flex items-start gap-6">
                                <div className="p-4 bg-blue-500/10 rounded-xl text-blue-400">
                                    <Search size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-slate-100">How to Find Notes</h2>
                                    <p className="text-slate-400 leading-relaxed mb-4">
                                        OriNotes makes it easy to find study materials for your specific university and course.
                                    </p>
                                    <ul className="space-y-3 text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                                            <span>Use the <strong>search bar</strong> on the home page or browse page to search by keywords (subject, course code).</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                                            <span>Navigate to the <strong>Browse Notes</strong> page to filter by University, Course, and Semester.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                                            <span>Check the <strong>Popular Universities</strong> section on the homepage for quick access.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Uploading Notes */}
                        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-green-500/30 transition-colors">
                            <div className="flex items-start gap-6">
                                <div className="p-4 bg-green-500/10 rounded-xl text-green-400">
                                    <Upload size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-slate-100">How to Upload Notes</h2>
                                    <p className="text-slate-400 leading-relaxed mb-4">
                                        Share your knowledge with the community and help others succeed.
                                    </p>
                                    <ul className="space-y-3 text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2" />
                                            <span>Create an account or log in to access the upload feature.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2" />
                                            <span>Click the <strong>Upload</strong> button in the navigation bar.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2" />
                                            <span>Fill in the details: University, Course, Subject, and Unit. Accurate metadata helps others find your notes!</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2" />
                                            <span>Upload your PDF file. Ensure it is clear and legible.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Community Features */}
                        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-green-500/30 transition-colors">
                            <div className="flex items-start gap-6">
                                <div className="p-4 bg-purple-500/10 rounded-xl text-purple-400">
                                    <Users size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-slate-100">Community & Features</h2>
                                    <p className="text-slate-400 leading-relaxed mb-4">
                                        Engage with other students and enhance your profile.
                                    </p>
                                    <ul className="space-y-3 text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2" />
                                            <span><strong>Profile:</strong> Customize your profile with a bio, avatar, and your university details.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2" />
                                            <span><strong>Badges:</strong> Earn badges for uploading notes, receiving likes, and being an active member.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2" />
                                            <span><strong>Favourites:</strong> Save notes to your library for quick access later.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-slate-400">Still have questions?</p>
                        <a href="mailto:support@orinotes.com" className="text-green-400 font-medium hover:text-green-300 transition-colors">Contact Support</a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HelpCenter;
