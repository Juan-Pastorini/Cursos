'use client';

import React, { useState, useEffect } from 'react';
import { Testimonio } from '../lib/types';
import Image from 'next/image';
import { getTestimonios, crearTestimonio } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, MessageSquare, Quote, User } from 'lucide-react';
import Link from 'next/link';

export default function TestimoniosSection() {
    const { isAuthenticated, usuario } = useAuth();
    const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Form state
    const [rating, setRating] = useState(5);
    const [comentario, setComentario] = useState('');
    const [hover, setHover] = useState(0);

    useEffect(() => {
        fetchTestimonios();
    }, []);

    const fetchTestimonios = async () => {
        setLoading(true);
        const res = await getTestimonios();
        if (res.success && res.data) {
            setTestimonios(res.data);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comentario.trim()) return;

        setSending(true);
        const res = await crearTestimonio(comentario, rating);
        if (res.success && res.data) {
            setTestimonios([res.data, ...testimonios]);
            setComentario('');
            setRating(5);
            // Reemplazo alert por algo más elegante si fuera necesario, pero por ahora lo dejo funcional
        }
        setSending(false);
    };

    return (
        <section id="testimonios" className="py-40 relative overflow-hidden bg-slate-950">
            {/* Background Light Effects */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto space-y-6">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-violet-500/10 text-violet-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-violet-500/20"
                    >
                        Experiencias Reales
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tighter"
                    >
                        Lo que dicen <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-sm">nuestros Graduados</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed"
                    >
                        Historias de transformación contadas por quienes ya pasaron por el programa.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="sticky top-32 glass-dark p-8 rounded-[3rem] border border-white/10 shadow-2xl"
                        >
                            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                <MessageSquare className="text-violet-500" />
                                Deja tu opinión
                            </h3>

                            {isAuthenticated ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Rating */}
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Calificación</p>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHover(star)}
                                                    onMouseLeave={() => setHover(0)}
                                                    className="transition-transform active:scale-90"
                                                >
                                                    <Star
                                                        size={32}
                                                        className={`${star <= (hover || rating)
                                                            ? 'fill-violet-500 text-violet-500'
                                                            : 'text-slate-700'
                                                            } transition-colors duration-300`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Tu comentario</label>
                                        <textarea
                                            required
                                            value={comentario}
                                            onChange={(e) => setComentario(e.target.value)}
                                            rows={4}
                                            placeholder="Cuéntanos tu experiencia con el curso..."
                                            className="input-dark resize-none py-4 px-6 h-auto min-h-[120px]"
                                        />
                                    </div>

                                    <button
                                        disabled={sending}
                                        type="submit"
                                        className="btn-accent w-full py-5 text-sm uppercase font-black tracking-widest flex items-center justify-center gap-3 animate-shimmer"
                                    >
                                        {sending ? 'Enviando...' : (
                                            <>
                                                Publicar Testimonio
                                                <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-10 space-y-6">
                                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10">
                                        <User className="text-slate-600" size={40} />
                                    </div>
                                    <p className="text-slate-400 font-medium">Debes iniciar sesión para dejar tu evaluación.</p>
                                    <Link href="/login" className="btn-accent py-4 px-10">
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Feed Section */}
                    <div className="lg:col-span-2">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-64 glass-dark rounded-[2.5rem] animate-pulse"></div>
                                ))}
                            </div>
                        ) : testimonios.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {testimonios.map((t, index) => (
                                        <motion.div
                                            layout
                                            key={t._id}
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.05 }}
                                            className="glass-dark p-8 rounded-[2.5rem] border border-white/5 hover:border-violet-500/30 transition-all group relative"
                                        >
                                            <Quote className="absolute top-6 right-8 text-white/5 group-hover:text-violet-500/10 transition-colors" size={64} />

                                            <div className="flex gap-1 mb-6">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i < t.rating ? 'fill-violet-400 text-violet-400' : 'text-slate-800'}
                                                    />
                                                ))}
                                            </div>

                                            <p className="text-slate-300 font-medium leading-relaxed italic mb-8 relative z-10 text-lg">
                                                &quot;{t.comentario}&quot;
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-black overflow-hidden shadow-xl border border-white/10 relative">
                                                    {t.avatar ? (
                                                        <Image src={t.avatar} alt={t.nombre} fill className="object-cover" />
                                                    ) : (
                                                        t.nombre ? t.nombre.charAt(0).toUpperCase() : 'U'
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-white leading-none mb-1.5">{t.nombre}</h4>
                                                    <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Estudiante Certificado</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="py-24 text-center glass-dark rounded-[3rem] border border-dashed border-white/10">
                                <p className="text-slate-500 font-medium italic text-lg">Aún no hay testimonios. ¡Sé el primero en compartir tu experiencia!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
