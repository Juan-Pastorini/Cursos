'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTutorias, getMisCompras } from '../lib/api';
import { Tutoria, Compra } from '../lib/types';
import Image from 'next/image';
import ProtectedRoute from '../components/ProtectedRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function PerfilPage() {
    const { usuario, loading: authLoading } = useAuth();
    const [tutorias, setTutorias] = useState<Tutoria[]>([]);
    const [compras, setCompras] = useState<Compra[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'perfil' | 'cursos' | 'tutorias'>('perfil');

    useEffect(() => {
        const fetchData = async () => {
            if (usuario) {
                const [resTutorias, resCompras] = await Promise.all([
                    getTutorias(),
                    getMisCompras()
                ]);
                if (resTutorias.success && resTutorias.data) setTutorias(resTutorias.data);
                if (resCompras.success && resCompras.data) setCompras(resCompras.data);
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [usuario, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!usuario) return null;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-violet-500/30">
                <Header />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
                    {/* Perfil Header */}
                    <div className="relative mb-12 lg:mb-20">
                        <div className="absolute -top-24 -left-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                        <div className="relative flex flex-col md:flex-row items-center gap-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 lg:p-12 rounded-[2.5rem] overflow-hidden">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-slate-900">
                                    <Image
                                        src={usuario.foto || 'https://ui-avatars.com/api/?name=' + usuario.nombre + '&background=8b5cf6&color=fff'}
                                        alt={usuario.nombre}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <button className="absolute bottom-2 right-2 w-10 h-10 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-all shadow-xl">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                            </div>

                            <div className="flex-grow text-center md:text-left space-y-4">
                                <div>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest mb-3">
                                        {usuario.rol}
                                    </div>
                                    <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight">{usuario.nombre}</h1>
                                    <p className="text-slate-400 text-lg">{usuario.email}</p>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <div className="px-5 py-2.5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Cursos</span>
                                        <span className="text-xl font-bold text-white">{usuario.cursosComprados.length}</span>
                                    </div>
                                    <div className="px-5 py-2.5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Tutorías</span>
                                        <span className="text-xl font-bold text-white">{tutorias.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-slate-800 mb-12 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'perfil', label: 'Mi Perfil' },
                            { id: 'cursos', label: 'Mis Cursos' },
                            { id: 'tutorias', label: 'Tutorías y Seguimiento' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-8 py-4 text-sm font-bold tracking-tight transition-all relative shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="tab-underline"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500 rounded-t-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'perfil' && (
                            <motion.div
                                key="perfil"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid lg:grid-cols-3 gap-8"
                            >
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] space-y-6">
                                        <h2 className="text-xl font-bold text-white">Información Personal</h2>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nombre Completo</label>
                                                <input
                                                    type="text"
                                                    defaultValue={usuario.nombre}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email</label>
                                                <input
                                                    type="email"
                                                    defaultValue={usuario.email}
                                                    disabled
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="sm:col-span-2 space-y-2">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Biografía</label>
                                                <textarea
                                                    placeholder="Cuéntanos un poco sobre ti..."
                                                    defaultValue={usuario.biografia}
                                                    rows={4}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                                                ></textarea>
                                            </div>
                                        </div>
                                        <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-violet-600/20">
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] space-y-6">
                                        <h2 className="text-xl font-bold text-white">Redes Sociales</h2>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                                </div>
                                                <input type="text" placeholder="LinkedIn URL" className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                                                </div>
                                                <input type="text" placeholder="GitHub URL" className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'cursos' && (
                            <motion.div
                                key="cursos"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {usuario.cursosComprados.length > 0 ? (
                                    usuario.cursosComprados.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ y: -5 }}
                                            className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden group"
                                        >
                                            <div className="relative aspect-video overflow-hidden">
                                                <Image
                                                    src={item.curso.imagen || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'}
                                                    alt={item.curso.titulo}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="p-6 lg:p-8 space-y-4">
                                                <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-2">{item.curso.titulo}</h3>
                                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-violet-500 w-[45%]" />
                                                </div>
                                                <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest">
                                                    <span>Progreso</span>
                                                    <span>45%</span>
                                                </div>
                                                <a
                                                    href={`/plataforma/${item.curso._id}`}
                                                    className="block text-center bg-slate-100 hover:bg-white text-slate-900 font-black py-4 rounded-2xl transition-all active:scale-95"
                                                >
                                                    Continuar Aprendiendo
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center space-y-4">
                                        <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto text-4xl mb-6">📚</div>
                                        <h3 className="text-2xl font-bold text-white">No tienes cursos todavía</h3>
                                        <p className="text-slate-400 max-w-sm mx-auto">Explora nuestro catálogo y comienza tu camino hacia el éxito hoy mismo.</p>
                                        <a href="/#cursos" className="inline-block bg-violet-600 px-8 py-4 rounded-2xl font-bold text-white hover:bg-violet-500 transition-all mt-4">Ver Catálogo</a>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'tutorias' && (
                            <motion.div
                                key="tutorias"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Tutorías Programadas</h2>
                                        <p className="text-slate-400">Gestiona tus sesiones de seguimiento personalizadas.</p>
                                    </div>
                                    <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-violet-600/20 active:scale-95">
                                        Solicitar Nueva Tutoría
                                    </button>
                                </div>

                                <div className="grid gap-4">
                                    {tutorias.length > 0 ? (
                                        tutorias.map((tutoria) => (
                                            <div
                                                key={tutoria._id}
                                                className="bg-slate-900/50 border border-slate-800 p-6 lg:p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-800/50 transition-colors"
                                            >
                                                <div className="flex items-start gap-6">
                                                    <div className="w-14 h-14 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-2xl text-violet-400">
                                                        🗓️
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="text-lg font-bold text-white">{tutoria.titulo}</h3>
                                                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                            <span className="flex items-center gap-1.5">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                {new Date(tutoria.fechaProgramada).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                {new Date(tutoria.fechaProgramada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            <span className={`flex items-center gap-1.5 ${tutoria.estado === 'confirmada' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                                <div className={`w-2 h-2 rounded-full ${tutoria.estado === 'confirmada' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                                                {tutoria.estado}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {tutoria.linkReunion && (
                                                        <a
                                                            href={tutoria.linkReunion}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-grow md:flex-grow-0 text-center bg-slate-100 hover:bg-white text-slate-900 font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
                                                        >
                                                            Unirse a Sesión
                                                        </a>
                                                    )}
                                                    <button className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center bg-slate-900/30 border border-slate-800/50 border-dashed rounded-[2.5rem]">
                                            <p className="text-slate-500 font-bold">No hay tutorías programadas próximas.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                                    </div>
                                    <div className="relative z-10 space-y-4 max-w-xl">
                                        <h3 className="text-xl font-bold text-white">¿Necesitas ayuda extra?</h3>
                                        <p className="text-slate-300">Como estudiante Premium, tienes acceso a 2 tutorías personalizadas al mes de 45 minutos con tus profesores.</p>
                                        <div className="flex items-center gap-2 text-violet-400 font-black text-[10px] uppercase tracking-widest">
                                            <span>Disponibles: 2/2</span>
                                            <span className="text-slate-600">•</span>
                                            <span>Renueva en 12 días</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                <Footer />

                <style jsx global>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
            </div>
        </ProtectedRoute>
    );
}
