import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-inter flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 px-4 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-slate-400">
                            Please read these terms carefully before using OriNotes.
                        </p>
                    </div>

                    <div className="space-y-8 text-slate-300 leading-relaxed">
                        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the OriNotes website, you agree to comply with and be bound by these Terms of Service.
                                If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-4">2. Eligibility</h2>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>You must be at least 13 years old to use this service.</li>
                                <li>You must have the legal capacity to enter into a binding agreement.</li>
                                <li>Access may be restricted in certain regions depending on local laws.</li>
                            </ul>
                        </section>

                        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-4">3. User Accounts</h2>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>You agree to provide accurate and complete registration information.</li>
                                <li>You are responsible for maintaining the security of your account credentials.</li>
                                <li>You are responsible for all activities that occur under your account.</li>
                                <li>Notify us immediately of any unauthorized access to your account.</li>
                            </ul>
                        </section>

                        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-4">4. User Responsibilities and Conduct</h2>
                            <p className="mb-2">You agree NOT to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Engage in illegal or harmful activities.</li>
                                <li>Harass, abuse, or spam other users.</li>
                                <li>Attempt to disrupt or compromise the integrity of the platform.</li>
                                <li>Misuse platform features or attempt to reverse engineer the service.</li>
                            </ul>
                        </section>

                        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-4">5. Content Ownership and Usage</h2>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>You retain ownership of the content you upload to OriNotes.</li>
                                <li>By uploading, you grant OriNotes a non-exclusive, worldwide license to host, display, and distribute your content on the platform.</li>
                                <li>You represent and warrant that you own or have the necessary rights to the content you upload.</li>
                            </ul>
                        </section>

                        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-4">6. Prohibited Content</h2>
                            <p className="mb-2">We do not tolerate:</p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Copyright-infringing material.</li>
                                <li>Offensive, hateful, defamatory, or misleading content.</li>
                                <li>Malware, viruses, or malicious files.</li>
                            </ul>
                        </section>

                        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-4">7. Privacy and Data Usage</h2>
                            <p>
                                Your use of our services is also governed by our Privacy Policy. We collect and use your data to provide and improve our services,
                                as described in the Privacy Policy.
                            </p>
                        </section>

                        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-4">8. Intellectual Property Rights</h2>
                            <p>
                                The OriNotes platform, including its logos, branding, UI, and source code, is the property of OriNotes.
                                You agree not to copy, modify, or distribute our platform's proprietary content without permission.
                            </p>
                        </section>

                        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-4">9. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 text-center text-sm text-slate-500">
                        <p>Last Updated: December 2025</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsOfService;
