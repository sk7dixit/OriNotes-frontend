import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Logo />
                        <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                            The smartest way to share and find university notes. Join our community today.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/notes" className="hover:text-green-400">Browse Notes</Link></li>
                            <li><Link to="/upload-notes" className="hover:text-green-400">Upload</Link></li>
                            <li><Link to="/universities" className="hover:text-green-400">Universities</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/help" className="hover:text-green-400">Help Center</Link></li>
                            <li><Link to="/guidelines" className="hover:text-green-400">Guidelines</Link></li>
                            <li><a href="mailto:support@orinotes.com" className="hover:text-green-400">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/privacy" className="hover:text-green-400">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-green-400">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} OriNotes. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {/* Social icons could go here */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
