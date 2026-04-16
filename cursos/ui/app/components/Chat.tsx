'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mensaje, Usuario } from '../lib/types';
import { getMensajes, enviarMensaje } from '../lib/api';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatProps {
    cursoId: string;
    usuarioActual: Usuario | null;
}

export default function Chat({ cursoId, usuarioActual }: ChatProps) {
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Cargar mensajes iniciales
    useEffect(() => {
        const fetchMensajes = async () => {
            const res = await getMensajes(cursoId);
            if (res.success && res.data) {
                setMensajes(res.data);
            }
            setLoading(false);
        };

        fetchMensajes();

        // Polling simple cada 5 segundos para nuevos mensajes
        const interval = setInterval(fetchMensajes, 5000);
        return () => clearInterval(interval);
    }, [cursoId]);

    // Auto-scroll al final cuando hay nuevos mensajes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [mensajes]);

    const handleEnviar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoMensaje.trim() || enviando || !usuarioActual) return;

        setEnviando(true);
        const res = await enviarMensaje(cursoId, nuevoMensaje);
        if (res.success && res.data) {
            setMensajes([...mensajes, res.data]);
            setNuevoMensaje('');
        }
        setEnviando(false);
    };

    return (
        <div className="flex flex-col h-full bg-slate-800/40 backdrop-blur-2xl rounded-[2.5rem] border border-slate-700/50 shadow-2xl overflow-hidden relative">
            {/* Header del Chat */}
            <div className="p-6 border-b border-slate-700/50 bg-slate-800/60 flex items-center justify-between">
                <div>
                    <h3 className="font-extrabold text-slate-100 tracking-tight">Comunidad Pro</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        Discusión Activa
                    </p>
                </div>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 overflow-hidden shadow-md relative">
                            <Image
                                src={`https://i.pravatar.cc/100?u=${i + 20}`}
                                alt="User"
                                fill
                                unoptimized
                                className="opacity-90 object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Lista de Mensajes */}
            <div
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-6 space-y-5 scroll-smooth custom-scrollbar"
            >
                <AnimatePresence>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30">
                            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cargando...</span>
                        </div>
                    ) : mensajes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-30">
                            <div className="text-3xl mb-3">💬</div>
                            <p className="text-slate-200 font-bold text-sm">Sin mensajes aún</p>
                        </div>
                    ) : (
                        mensajes.map((msg, index) => {
                            const usuario = msg.usuario || {
                                _id: 'deleted',
                                nombre: 'Usuario Eliminado',
                                foto: null,
                                rol: 'usuario'
                            };

                            const esMio = usuario._id === usuarioActual?._id;
                            const esAdmin = usuario.rol === 'admin';

                            return (
                                <motion.div
                                    key={msg._id}
                                    initial={{ opacity: 0, x: esMio ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex gap-3 ${esMio ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        {usuario.foto ? (
                                            <div className={`w-8 h-8 rounded-xl overflow-hidden border ${esMio ? 'border-violet-500/30' : 'border-slate-600'} shadow-md relative`}>
                                                <Image
                                                    src={usuario.foto}
                                                    alt={usuario.nombre}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className={`w-8 h-8 rounded-xl ${esMio ? 'bg-violet-600/80' : 'bg-slate-700'} flex items-center justify-center text-[10px] font-bold text-white border border-slate-600/50`}>
                                                {usuario.nombre.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`flex flex-col max-w-[82%] ${esMio ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <span className={`text-[10px] font-bold ${esMio ? 'text-violet-400' : 'text-slate-300'}`}>{usuario.nombre}</span>
                                            {esAdmin && (
                                                <span className="px-1.5 py-0.5 bg-slate-100 text-[8px] font-black text-slate-900 rounded uppercase tracking-tighter">Instructor</span>
                                            )}
                                            <span className="text-[8px] font-medium text-slate-500">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className={`p-3.5 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${esMio
                                            ? 'bg-violet-600 text-white rounded-tr-none'
                                            : esAdmin
                                                ? 'bg-slate-100 text-slate-900 rounded-tl-none font-semibold'
                                                : 'bg-slate-700/80 border border-slate-600/50 text-slate-100 rounded-tl-none'
                                            }`}>
                                            {msg.texto}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Input de Mensaje */}
            <div className="p-5 bg-slate-800/80 border-t border-slate-700/50">
                <form onSubmit={handleEnviar} className="relative group">
                    <input
                        type="text"
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        placeholder="Mensaje..."
                        className="w-full bg-slate-900/40 border border-slate-700 rounded-2xl px-5 py-3.5 pr-14 text-sm font-medium text-slate-100 placeholder:text-slate-500 focus:border-slate-500 transition-all outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!nuevoMensaje.trim() || enviando}
                        className="absolute right-1.5 top-1.5 bottom-1.5 w-11 bg-slate-100 hover:bg-white disabled:bg-slate-700 disabled:text-slate-500 rounded-xl flex items-center justify-center text-slate-900 shadow-lg transition-all active:scale-95"
                    >
                        {enviando ? (
                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
