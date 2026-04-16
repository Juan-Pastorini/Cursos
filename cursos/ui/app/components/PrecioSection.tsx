'use client';

// ============================================
// COMPONENTE: Sección de Precio y CTA
// ============================================

import React from 'react';
import Link from 'next/link';
import { Curso } from '../lib/types';

interface PrecioSectionProps {
    curso: Curso;
    garantias: {
        icono: string;
        titulo: string;
        descripcion: string;
    }[];
}

export default function PrecioSection({ curso, garantias }: PrecioSectionProps) {
    const precioOriginal = 297;
    const precioActual = curso?.precio || 0;
    const descuento = Math.round(((precioOriginal - precioActual) / precioOriginal) * 100);

    return (
        <section id="precio" className="section bg-slate-50">
            <div className="container">
                <div className="max-w-4xl mx-auto">
                    {/* Main pricing card */}
                    <div className="relative">
                        {/* Decorative gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-3xl transform rotate-1 opacity-20 blur-xl" />

                        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                            {/* Discount banner */}
                            <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-center py-3">
                                <span className="text-sm font-semibold">🔥 Oferta especial: {descuento}% de descuento por tiempo limitado</span>
                            </div>

                            <div className="p-8 md:p-12">
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    {/* Left - What's included */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                            Acceso completo al curso
                                        </h2>

                                        <ul className="space-y-4">
                                            {[
                                                `${curso?.duracion || '40+ horas'} de contenido en video`,
                                                `${curso?.contenido?.length || 0} módulos completos`,
                                                'Proyectos prácticos del mundo real',
                                                'Código fuente descargable',
                                                'Certificado de finalización',
                                                'Acceso de por vida',
                                                'Actualizaciones gratuitas',
                                                'Comunidad privada de estudiantes',
                                                'Soporte y resolución de dudas',
                                            ].map((item, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-slate-600">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Right - Price and CTA */}
                                    <div className="text-center md:text-left md:border-l md:border-slate-200 md:pl-8">
                                        {/* Price */}
                                        <div className="mb-6">
                                            <div className="text-slate-400 line-through text-lg">${precioOriginal} USD</div>
                                            <div className="flex items-baseline justify-center md:justify-start gap-2">
                                                <span className="text-5xl font-bold text-slate-900">${precioActual}</span>
                                                <span className="text-slate-500">USD</span>
                                            </div>
                                            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                                                <span>Ahorras ${precioOriginal - precioActual}</span>
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <Link href={`/checkout?cursoId=${curso?._id || ''}`} className="btn btn-lg btn-accent w-full mb-4 animate-pulse-glow">
                                            Inscribirme ahora
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Link>

                                        {/* Microcopy */}
                                        <p className="text-sm text-slate-500 mb-6">
                                            Pago único • Sin suscripciones • Acceso inmediato
                                        </p>

                                        {/* Payment methods */}
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4 border-t border-slate-100">
                                            <span className="text-xs text-slate-400">Aceptamos:</span>
                                            <div className="flex gap-2">
                                                <div className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">Visa</div>
                                                <div className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">Mastercard</div>
                                                <div className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">PayPal</div>
                                                <div className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">MercadoPago</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guarantees */}
                    <div className="mt-12 grid sm:grid-cols-3 gap-6">
                        {garantias?.map((garantia, index) => (
                            <div key={index} className="text-center p-6 rounded-xl bg-white shadow-sm border border-slate-100">
                                <div className="text-3xl mb-3">{garantia.icono}</div>
                                <h3 className="font-semibold text-slate-900 mb-1">{garantia.titulo}</h3>
                                <p className="text-sm text-slate-500">{garantia.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
