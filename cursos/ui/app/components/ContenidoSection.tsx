import React, { useState } from 'react';
import { ModuloCurso } from '../lib/types';
import Link from 'next/link';

interface ContenidoSectionProps {
    contenido: ModuloCurso[];
    duracion: string;
    nivel: string;
    haComprado?: boolean;
    cursoId?: string;
}

export default function ContenidoSection({ contenido, duracion, nivel, haComprado = false, cursoId }: ContenidoSectionProps) {
    const [expandedModule, setExpandedModule] = useState<number | null>(0);

    const totalTemas = contenido?.reduce((acc, modulo) => acc + (modulo.temas?.length || 0), 0) || 0;

    return (
        <section id="contenido" className="section bg-slate-50">
            <div className="container">
                {/* Section header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold mb-4">
                        Programa completo
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Contenido del curso
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto mb-8">
                        Un programa estructurado paso a paso para que domines cada concepto sin sentirte abrumado.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-violet-600">{contenido?.length || 0}</div>
                            <div className="text-sm text-slate-500">Módulos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-violet-600">{totalTemas}</div>
                            <div className="text-sm text-slate-500">Lecciones</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-violet-600">{duracion || '0h'}</div>
                            <div className="text-sm text-slate-500">Duración</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-violet-600">{nivel || 'Principiante'}</div>
                            <div className="text-sm text-slate-500">Nivel</div>
                        </div>
                    </div>
                </div>

                {/* Modules accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {contenido?.map((modulo, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Module header */}
                            <button
                                onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{modulo.modulo}</h3>
                                        <p className="text-sm text-slate-500">{modulo.temas?.length || 0} lecciones</p>
                                    </div>
                                </div>
                                <svg
                                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${expandedModule === index ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Module content */}
                            {expandedModule === index && (
                                <div className="px-6 pb-5 border-t border-slate-100 bg-slate-50/50">
                                    <ul className="space-y-3 pt-4">
                                        {modulo.temas?.map((tema, temaIndex) => (
                                            <li key={temaIndex} className="flex items-center justify-between group/item px-2 py-1 rounded-lg hover:bg-white transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${haComprado ? 'text-emerald-500' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className={`text-sm font-medium transition-all ${haComprado
                                                            ? 'text-slate-700'
                                                            : 'text-slate-400 group-hover/item:text-slate-500 blur-[2px] select-none group-hover/item:blur-0'
                                                        }`}>
                                                        {tema}
                                                    </span>
                                                </div>
                                                {!haComprado && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-200/50 rounded-md text-slate-400">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-[9px] font-black uppercase tracking-wider">Bloqueado</span>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
