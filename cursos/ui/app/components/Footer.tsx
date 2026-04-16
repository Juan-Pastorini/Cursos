'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const pathname = usePathname();

    // No mostrar el footer en las páginas de administración o plataforma
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/plataforma')) {
        return null;
    }

    return (
        <footer id="contacto" className="bg-slate-950 pt-24 pb-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="md:col-span-12 lg:col-span-5 space-y-8 flex flex-col items-center text-center">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-500">
                                <span className="text-white font-black text-2xl">C</span>
                            </div>
                            <span className="text-white font-black text-2xl tracking-tighter">Curso<span className="text-violet-400">Pro</span></span>
                        </Link>

                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                            Formando a la próxima generación de líderes tecnológicos. Nuestra misión es democratizar el acceso a la educación técnica de élite con programas diseñados para el mundo real.
                        </p>

                        <div className="flex gap-4 justify-center">
                            {['twitter', 'instagram', 'youtube', 'linkedin'].map((social) => (
                                <motion.a
                                    key={social}
                                    href={`https://${social}.com`}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-xl"
                                >
                                    <span className="sr-only">{social}</span>
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        {/* Icons could be added here or just leave standard SVG paths if preferred */}
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            {social === 'twitter' && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />}
                                            {social === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />}
                                            {social === 'youtube' && <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />}
                                            {social === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />}
                                        </svg>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="md:col-span-12 lg:col-span-7 grid md:grid-cols-3 gap-12">
                        <div className="space-y-6">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">Academia</h4>
                            <ul className="space-y-4">
                                {['Cursos', 'Contenido', 'Testimonios', 'Contacto'].map((item) => (
                                    <li key={item}>
                                        <a href={`#${item.toLowerCase()}`} className="text-slate-500 hover:text-white transition-colors font-medium">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">Compañía</h4>
                            <ul className="space-y-4">
                                {['Sobre Nosotros', 'Blog', 'Carreras', 'Soporte'].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-slate-500 hover:text-white transition-colors font-medium">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">Contacto</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-1 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <span className="text-slate-500 font-medium">hola@cursopro.com</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-1 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H3.75A2.25 2.25 0 001.5 4.5v2.25z" />
                                        </svg>
                                    </div>
                                    <span className="text-slate-500 font-medium">+54 11 1234-5678</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-1 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-slate-500 font-medium">Buenos Aires, Argentina</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-slate-500 text-sm font-medium">
                        © {currentYear} <span className="text-white">CursoPro Academy</span>. Todos los derechos reservados.
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Sistemas OK</span>
                        </div>
                        <span className="text-slate-800 text-lg">|</span>
                        <p className="text-slate-500 text-sm font-medium">
                            Desarrollado con ❤️ para la comunidad
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

