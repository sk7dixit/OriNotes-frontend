import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Universities', href: '#universities' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
                ? 'bg-slate-900/80 backdrop-blur-xl border-slate-800 py-3 shadow-lg'
                : 'bg-transparent border-transparent py-5'
                }`}
        >
            <div className="w-full px-6 lg:px-12">
                <div className="flex items-center justify-between h-20">
                    {/* Logo - Left */}
                    <div className="flex-shrink-0">
                        <Logo size="lg" />
                    </div>

                    {/* Desktop Nav - Center */}
                    <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                        <div className="flex space-x-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Actions - Right */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login">
                            <Button variant="ghost" size="sm" icon={LogIn}>
                                Login
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm" icon={UserPlus}>
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-slate-300 hover:text-white focus:outline-none"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-4 shadow-xl">
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-slate-300 hover:text-white text-base font-medium"
                            >
                                {link.name}
                            </a>
                        ))}
                        <hr className="border-slate-800 my-2" />
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-center">
                                Login
                            </Button>
                        </Link>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="primary" className="w-full justify-center">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
