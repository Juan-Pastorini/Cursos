'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Header() {
    const { isAuthenticated, usuario, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // No mostrar el header en las páginas de administración, profesor o plataforma
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/profesor') || pathname?.startsWith('/plataforma')) {
        return null;
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'
                }`}
        >
            <nav className="container mx-auto px-4">
                <div className={`relative flex items-center justify-between px-6 h-16 rounded-2xl transition-all duration-500 ${scrolled
                    ? 'glass-dark shadow-2xl shadow-black/20'
                    : 'bg-transparent'
                    }`}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-500 group-hover:rotate-12">
                            <span className="text-white font-black text-xl">C</span>
                        </div>
                        <span className="text-white font-black text-xl tracking-tighter">Curso<span className="text-violet-400">Pro</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {['Cursos', 'Contenido', 'Testimonios', 'Contacto'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-6">
                                {usuario?.cursosComprados && usuario.cursosComprados.length > 0 && (
                                    <Link
                                        href={`/plataforma/${usuario.cursosComprados[0].curso._id}`}
                                        className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-black uppercase tracking-widest hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                        Plataforma Pro
                                    </Link>
                                )}
                                <Link
                                    href="/perfil"
                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Mi Perfil
                                </Link>

                                {usuario?.rol === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="px-4 py-2 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs font-black uppercase tracking-widest hover:bg-violet-600/20 transition-all"
                                    >
                                        Admin
                                    </Link>
                                )}

                                {usuario?.rol === 'profesor' && (
                                    <Link
                                        href="/profesor"
                                        className="px-4 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest hover:bg-indigo-600/20 transition-all"
                                    >
                                        Profesor
                                    </Link>
                                )}

                                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                                    <div className="flex flex-col items-end">
                                        <span className="text-white text-sm font-black leading-none mb-1">
                                            {usuario?.nombre || 'Usuario'}
                                        </span>
                                        <button
                                            onClick={logout}
                                            className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 hover:text-red-400 transition-colors"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center border border-white/20 shadow-lg text-white font-black">
                                        {usuario?.foto ? (
                                            <Image
                                                src={usuario.foto}
                                                alt={usuario.nombre}
                                                width={40}
                                                height={40}
                                                className="object-cover w-full h-full"
                                                unoptimized
                                            />
                                        ) : (
                                            usuario?.nombre?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="px-5 py-2 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/registro"
                                    className="px-6 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20 active:scale-95"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 p-4 md:hidden"
                    >
                        <div className="glass-dark rounded-3xl p-8 flex flex-col gap-6 shadow-2xl">
                            {['Cursos', 'Contenido', 'Testimonios', 'Contacto'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-2xl font-black text-white"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item}
                                </a>
                            ))}
                            <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                                {isAuthenticated ? (
                                    <>
                                        <Link href="/mis-cursos" className="text-xl font-bold text-violet-400" onClick={() => setMobileMenuOpen(false)}>
                                            Ir a Mis Cursos
                                        </Link>
                                        {usuario?.rol === 'admin' && (
                                            <Link href="/admin" className="text-xl font-bold text-rose-400" onClick={() => setMobileMenuOpen(false)}>
                                                Panel Admin
                                            </Link>
                                        )}
                                        {usuario?.rol === 'profesor' && (
                                            <Link href="/profesor" className="text-xl font-bold text-indigo-400" onClick={() => setMobileMenuOpen(false)}>
                                                Panel Profesor
                                            </Link>
                                        )}
                                        <button onClick={logout} className="text-left text-xl font-bold text-red-400">
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-xl font-bold text-white" onClick={() => setMobileMenuOpen(false)}>
                                            Iniciar Sesión
                                        </Link>
                                        <Link href="/registro" className="btn-accent py-4" onClick={() => setMobileMenuOpen(false)}>
                                            Registrarse
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

