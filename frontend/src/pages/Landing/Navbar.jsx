import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout, loading } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Особенности', href: '#features' },
        { name: 'Как это работает', href: '#how-it-works' },
        { name: 'Преимущества', href: '#benefits' },
        { name: 'Отзывы', href: '#testimonials' }
    ];

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top, behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled
                ? 'py-4 bg-white/80 backdrop-blur-xl shadow-soft'
                : 'py-8 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group relative z-10">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg transition-transform group-hover:scale-110" style={{ backgroundColor: '#E07856' }}>
                        TB
                    </div>
                    <span className={`text-2xl font-bold font-display transition-colors ${isScrolled ? 'text-text-primary' : 'text-text-primary'}`}>
                        Timebank
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => scrollToSection(e, link.href)}
                            className="font-medium text-text-secondary hover:text-primary transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden lg:flex items-center gap-6 min-w-[200px] justify-end">
                    {loading ? (
                        <div className="w-10 h-10 rounded-xl bg-primary/5 animate-pulse" />
                    ) : isAuthenticated ? (
                        <div className="flex items-center gap-6">
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 font-bold text-text-secondary hover:text-primary transition-colors group"
                            >
                                <LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Дашборд
                            </Link>
                            <Link
                                to={`/profile/${user?.id}`}
                                className="flex items-center gap-3 p-1 pr-4 rounded-2xl bg-warm-cream border border-primary/5 hover:border-primary/20 transition-all group"
                            >
                                {user?.avatar_url ? (
                                    <img
                                        src={`http://localhost:5001${user.avatar_url}`}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-xl object-cover shadow-soft group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-soft">
                                        {user?.name?.charAt(0)}
                                    </div>
                                )}
                                <span className="font-bold text-text-primary">{user?.name}</span>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="font-bold text-text-secondary hover:text-primary transition-colors">
                                Вход
                            </Link>
                            <Link to="/register" className="btn-primary flex items-center gap-2 !px-8 !py-3 !text-base group">
                                Регистрация
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden relative z-10 p-2 text-text-primary"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-warm-cream lg:hidden transition-transform duration-500 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full justify-center items-center gap-10 px-6">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => scrollToSection(e, link.href)}
                            className="text-3xl font-bold text-text-primary hover:text-primary transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="w-full h-px bg-primary/10 max-w-xs" />
                    {isAuthenticated ? (
                        <div className="flex flex-col items-center gap-6 w-full px-6">
                            <Link
                                to="/dashboard"
                                className="text-2xl font-bold text-text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Дашборд
                            </Link>
                            <Link
                                to={`/profile/${user?.id}`}
                                className="flex items-center gap-3 p-3 w-full bg-white rounded-2xl shadow-soft"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0)}
                                </div>
                                <span className="font-bold text-text-primary">{user?.name}</span>
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setMobileMenuOpen(false);
                                }}
                                className="text-error font-bold"
                            >
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-2xl font-bold text-text-secondary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Вход
                            </Link>
                            <Link
                                to="/register"
                                className="btn-primary w-full max-w-xs text-center text-xl"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Регистрация
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
