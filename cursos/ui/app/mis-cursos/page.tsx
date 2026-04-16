'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';

export default function MisCursosPage() {
    const { usuario, loading, updateFoto } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [updating, setUpdating] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUpdateFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUpdating(true);
            const success = await updateFoto(file);
            setUpdating(false);
            if (!success) {
                alert("No se pudo actualizar la foto. Intenta con otra imagen.");
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => setMounted(true), []);

    if (loading || !mounted) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Cargando tus cursos...</p>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen pt-32 pb-24 bg-slate-950 relative overflow-hidden selection:bg-violet-500/30">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-violet-600/10 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-600/10 rounded-full blur-[120px] -ml-20 -mb-20 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        {/* Welcome Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12"
                        >
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-600/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
                                    Panel de Estudiante
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                                    Mis <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Cursos</span>
                                </h1>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                    ¡Es un placer verte de nuevo, {usuario?.nombre.split(' ')[0]}!
                                </p>
                            </div>

                            <div className="flex items-center gap-6 glass-dark p-3 pr-8 rounded-3xl border border-white/10">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleUpdateFoto}
                                />
                                <div className="relative group cursor-pointer flex-shrink-0" onClick={triggerFileInput}>
                                    {usuario?.foto ? (
                                        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl relative transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 ${updating ? 'opacity-50' : ''}`}>
                                            <Image
                                                src={usuario.foto}
                                                alt={usuario.nombre}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 80px, 96px"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-black text-center p-2 uppercase tracking-tighter">
                                                {updating ? 'Subiendo...' : (
                                                    <>
                                                        <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        Cambiar
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                                            {updating ? '...' : usuario?.nombre?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-600 rounded-2xl flex items-center justify-center shadow-xl border border-white/20 group-hover:scale-110 transition-transform z-10">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white">{usuario?.cursosComprados?.length || 0} Cursos</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Inscritos</span>
                                        </div>
                                        {usuario?.cursosComprados && usuario.cursosComprados.length > 0 && (
                                            <Link
                                                href={`/plataforma/${usuario.cursosComprados[0].curso._id}`}
                                                className="px-4 py-2 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20 active:scale-95 border border-white/10"
                                            >
                                                Ir a Plataforma
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Cursos Content */}
                        <div className="space-y-12">
                            {!usuario?.cursosComprados || usuario.cursosComprados.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-dark rounded-[3rem] p-16 text-center border border-white/10 shadow-2xl"
                                >
                                    <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner border border-white/10">
                                        🎓
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Tu biblioteca está vacía</h2>
                                    <p className="text-slate-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed font-medium">
                                        Parece que aún no te has inscrito en ningún programa. Comienza hoy mismo tu transformación profesional con nuestra formación de alto impacto.
                                    </p>
                                    <Link href="/" className="btn-accent btn-lg px-12 group">
                                        Explorar Catálogo
                                        <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </motion.div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {usuario.cursosComprados.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group glass-dark rounded-[2.5rem] shadow-2xl hover:shadow-violet-600/20 border border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col"
                                        >
                                            {/* Course Image */}
                                            <div className="h-60 relative overflow-hidden">
                                                <Image
                                                    src={item.curso.imagen && item.curso.imagen.startsWith('http') ? item.curso.imagen : "/hero-image.png"}
                                                    alt={item.curso.titulo}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                                <div className="absolute top-5 left-5">
                                                    <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-black rounded-xl uppercase tracking-wider border border-white/10">
                                                        {item.curso.nivel}
                                                    </span>
                                                </div>

                                                <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-xl relative">
                                                                <Image src={`https://i.pravatar.cc/100?u=${i + index}`} alt="User" fill className="object-cover" />
                                                            </div>
                                                        ))}
                                                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-violet-600 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                                                            +1k
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Course Content */}
                                            <div className="p-8 flex-grow flex flex-col">
                                                <h3 className="font-black text-white mb-4 leading-tight text-2xl group-hover:text-violet-400 transition-colors tracking-tight">
                                                    {item.curso.titulo}
                                                </h3>
                                                <p className="text-slate-400 text-sm mb-10 line-clamp-2 font-medium leading-relaxed">
                                                    {item.curso.descripcionCorta || item.curso.descripcion}
                                                </p>

                                                {/* Progress Section */}
                                                <div className="mt-auto space-y-6">
                                                    <div className="flex justify-between items-end">
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">Tu Avance</p>
                                                            <p className="text-2xl font-black text-white leading-none">25<span className="text-sm font-bold text-violet-400 ml-1">%</span></p>
                                                        </div>
                                                        <div className="flex gap-1.5">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                <div key={i} className={`h-2 w-7 rounded-full transition-all duration-500 ${i <= 1 ? 'bg-violet-500 shadow-[0_0_10px_#8b5cf6]' : 'bg-white/5'}`}></div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Link
                                                        href={`/plataforma/${item.curso._id}`}
                                                        className="w-full bg-white text-slate-950 hover:bg-violet-500 hover:text-white py-5 rounded-[1.5rem] font-black text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-3 group/btn shadow-xl shadow-black/20"
                                                    >
                                                        Continuar Formación
                                                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Additional Resources Banner */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative rounded-[3rem] overflow-hidden group shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-violet-800 to-fuchsia-900" />
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

                                <div className="relative p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
                                    <div className="max-w-2xl text-center md:text-left space-y-8">
                                        <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em]">
                                            Ecosistema de Aprendizaje
                                        </div>
                                        <h3 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter">
                                            ¿Atascado? <br />
                                            <span className="text-white/60">Estamos contigo.</span>
                                        </h3>
                                        <p className="text-indigo-100 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                                            Únete a nuestra comunidad de Discord y recibe ayuda personalizada de tutores y otros 5,000+ estudiantes élite.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-6 shrink-0 w-full md:w-auto">
                                        <button className="px-12 py-6 bg-white text-indigo-900 font-black rounded-3xl shadow-2xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4 text-lg">
                                            <span className="text-3xl">💬</span>
                                            Acceso Discord
                                        </button>
                                        <div className="flex flex-col items-center md:items-start gap-1">
                                            <div className="flex -space-x-3 mb-2">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="w-10 h-10 rounded-full border-4 border-indigo-800 bg-slate-200 overflow-hidden relative">
                                                        <Image src={`https://i.pravatar.cc/100?u=support${i}`} alt="Support" fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest text-center md:text-left">Activos ahora mismo</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Animated glowing blobs for extra flair */}
                                <div className="absolute -top-24 -left-24 w-80 h-80 bg-fuchsia-500/30 rounded-full blur-[120px] animate-pulse"></div>
                                <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.2s' }}></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

