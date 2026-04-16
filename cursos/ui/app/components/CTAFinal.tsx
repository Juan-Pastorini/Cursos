'use client';

// ============================================
// COMPONENTE: CTA Final
// ============================================
// Sección de llamada a la acción final antes del footer

import React from 'react';
import Link from 'next/link';
import { Curso } from '../lib/types';

interface CTAFinalProps {
    curso: Curso;
}

export default function CTAFinal({ curso }: CTAFinalProps) {
    return (
        <section className="section bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                        <span className="text-sm text-white/90">⏰ Oferta por tiempo limitado</span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Empieza tu transformación{' '}
                        <span className="text-cyan-300">hoy mismo</span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                        No esperes más para cambiar tu futuro. Únete a los más de {curso.inscriptos.toLocaleString()} estudiantes que ya están construyendo la carrera de sus sueños.
                    </p>

                    {/* Price */}
                    <div className="inline-flex items-baseline gap-3 mb-8">
                        <span className="text-white/60 line-through text-xl">$297</span>
                        <span className="text-5xl font-bold text-white">${curso.precio}</span>
                        <span className="text-white/60">USD</span>
                    </div>

                    {/* CTA Button */}
                    <div className="mb-8">
                        <Link href="/checkout" className="btn btn-lg bg-white text-violet-700 hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all">
                            Inscribirme ahora
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap justify-center gap-6 text-white/70 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span>Pago 100% seguro</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Garantía 30 días</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            <span>Acceso inmediato</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
