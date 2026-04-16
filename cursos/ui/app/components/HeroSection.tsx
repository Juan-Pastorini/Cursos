'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Curso } from '../lib/types';
import { motion } from 'framer-motion';

interface HeroSectionProps {
    curso: Curso;
}

export default function HeroSection({ curso }: HeroSectionProps) {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 pt-32 pb-40">
            {/* Ultra-Premium Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left content: High-Convertion Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center space-y-8"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mx-auto">
                            <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
                            </span>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                                {curso.inscriptos.toLocaleString()} Estudiantes ya están dentro
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mx-auto">
                            Domina el <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400">
                                Código Real
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
                            {curso.descripcionCorta}. Formación de élite diseñada para llevarte de cero a Junior avanzado en tiempo récord.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
                            <Link href={`/checkout?cursoId=${curso._id}`} className="btn-accent btn-lg group">
                                Iniciar Formación
                                <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <a href="#contenido" className="btn-secondary btn-lg">
                                Ver Temario
                            </a>
                        </div>

                        {/* Social Proof Mini */}
                        <div className="flex items-center justify-center gap-6 pt-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                            <div className="relative w-8 h-8">
                                <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" fill alt="React" className="object-contain" />
                            </div>
                            <div className="relative w-20 h-8">
                                <Image src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" fill alt="Node" className="object-contain" />
                            </div>
                            <div className="relative w-24 h-8">
                                <Image src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg" fill alt="MongoDB" className="object-contain" />
                            </div>
                            <span className="text-white/10 text-3xl font-thin mx-2">|</span>
                            <div className="text-left">
                                <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Certificado Elite</p>
                                <p className="text-slate-600 text-[9px] font-bold">Avalado por la industria IT</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right content: The Visual Asset */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="relative z-10 animate-float">
                            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 to-blue-600/30 rounded-[3rem] blur-2xl transform scale-105"></div>
                            <div className="relative bg-slate-900 p-2 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden group">
                                <Image
                                    src="/hero-image.png"
                                    alt={curso.titulo}
                                    width={800}
                                    height={600}
                                    className="rounded-[2.5rem] object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                            </div>

                            {/* Floating Badges */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 glass-dark p-6 rounded-3xl border border-white/10 shadow-2xl z-20"
                            >
                                <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Precio Miembro</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white">${curso.precio}</span>
                                    <span className="text-slate-500 line-through text-lg font-bold">297</span>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-2xl z-20 flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-green-200">
                                    ✓
                                </div>
                                <div>
                                    <p className="text-slate-900 font-black leading-none">Acceso Vitalicio</p>
                                    <p className="text-slate-400 text-xs font-bold leading-none mt-1">Un solo pago</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator Pro */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            >
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-violet-500 to-transparent"></div>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] rotate-90 origin-left ml-4">Scroll</span>
            </motion.div>
        </section>
    );
}

