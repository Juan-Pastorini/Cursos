'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Curso, Usuario } from '../lib/types';

interface CursosListProps {
    initialCursos: Curso[];
    usuario: Usuario | null;
}

export default function CursosList({ initialCursos, usuario }: CursosListProps) {
    const [filtro, setFiltro] = useState('Todos');
    const [busqueda, setBusqueda] = useState('');

    const cursosFiltrados = initialCursos.filter(curso => {
        const cumpleFiltro = filtro === 'Todos' || curso.nivel === filtro;
        const cumpleBusqueda = curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
            curso.descripcion.toLowerCase().includes(busqueda.toLowerCase());
        return cumpleFiltro && cumpleBusqueda;
    });

    return (
        <section id="cursos" className="py-40 relative overflow-hidden bg-slate-950 z-20">
            {/* Ambient Background Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600/5 via-transparent to-transparent opacity-50"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24 max-w-4xl mx-auto"
                >
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-500/50"></div>
                        <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.5em]">Catálogo de Élite 2024</span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-violet-500/50"></div>
                    </div>

                    <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-10">
                        Maestría <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 italic">Tecnológica</span>
                    </h2>

                    <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto">
                        Programas diseñados para forjar el <span className="text-white font-bold">1% de los talentos</span> globales.
                    </p>
                </motion.div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
                    <div className="relative w-full md:w-[450px] group">
                        <div className="absolute inset-0 bg-violet-600/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                            <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Buscar tu próxima formación..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium text-white text-lg placeholder:text-slate-600 shadow-2xl backdrop-blur-xl"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-xl">
                        {['Todos', 'Principiante', 'Intermedio', 'Avanzado'].map((nivel) => (
                            <button
                                key={nivel}
                                onClick={() => setFiltro(nivel)}
                                className={`px-8 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${filtro === nivel
                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/40 translate-y-[-2px]'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {nivel}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {cursosFiltrados.map((curso, index) => (
                        <motion.div
                            key={curso._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex flex-col bg-slate-900/40 rounded-[3rem] overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all duration-700 shadow-2xl relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-violet-600/0 via-transparent to-violet-600/0 group-hover:to-violet-600/5 transition-all duration-700"></div>

                            {/* Image with overlay */}
                            <div className="relative h-72 overflow-hidden">
                                <Image
                                    src={curso.imagen && curso.imagen.startsWith('http') ? curso.imagen : "/hero-image.png"}
                                    alt={curso.titulo}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors duration-700" />

                                <div className="absolute top-6 left-6">
                                    <span className="px-5 py-2 glass-dark rounded-2xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                                        {curso.nivel}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-10 flex-grow flex flex-col items-center text-center relative z-10">
                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <span className="bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">
                                        {curso.duracion}
                                    </span>
                                    <div className="flex items-center gap-1.5 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20">
                                        <span className="text-amber-400 text-sm">★</span>
                                        <span className="text-xs font-black text-amber-400">4.9</span>
                                    </div>
                                </div>

                                <h3 className="text-3xl font-black text-white mb-6 group-hover:text-violet-400 transition-colors tracking-tight leading-[1.1]">
                                    {curso.titulo}
                                </h3>

                                <p className="text-slate-500 text-lg font-medium leading-relaxed line-clamp-2 mb-10">
                                    {curso.descripcionCorta || curso.descripcion}
                                </p>

                                <div className="mt-auto pt-10 border-t border-white/5 w-full flex flex-col items-center gap-8">
                                    <div className="flex flex-col items-center">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3">
                                            {usuario?.cursosComprados?.some(item => (typeof item.curso === 'string' ? item.curso : item.curso._id) === curso._id) ? 'Status' : 'Acceso'}
                                        </p>
                                        <div className="text-4xl font-black text-white tracking-tighter">
                                            {usuario?.cursosComprados?.some(item => (typeof item.curso === 'string' ? item.curso : item.curso._id) === curso._id) ? (
                                                <span className="text-emerald-400 text-2xl uppercase tracking-widest">Adquirido</span>
                                            ) : usuario?.rol === 'admin' ? (
                                                <span className="text-violet-400 text-2xl uppercase tracking-widest">Admin Pass</span>
                                            ) : (
                                                <span className="flex items-baseline gap-1">
                                                    <span className="text-violet-400">$</span>{curso.precio}
                                                    <span className="text-xs text-slate-600 font-bold ml-1">USD</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <Link
                                        href={(usuario?.cursosComprados?.some(item => (typeof item.curso === 'string' ? item.curso : item.curso._id) === curso._id) || usuario?.rol === 'admin')
                                            ? `/plataforma/${curso._id}`
                                            : `/checkout?cursoId=${curso._id}`
                                        }
                                        className={`btn w-full py-5 text-sm uppercase tracking-[0.2em] font-black ${(usuario?.cursosComprados?.some(item => (typeof item.curso === 'string' ? item.curso : item.curso._id) === curso._id) || usuario?.rol === 'admin')
                                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                                : 'btn-accent shadow-glow'
                                            }`}
                                    >
                                        {(usuario?.cursosComprados?.some(item => (typeof item.curso === 'string' ? item.curso : item.curso._id) === curso._id) || usuario?.rol === 'admin') ? 'Continuar Aprendizaje' : 'Reservar mi lugar'}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
