'use client';

// ============================================
// COMPONENTE: Sección de FAQ
// ============================================

import React, { useState } from 'react';
import { FAQ } from '../lib/types';

interface FAQSectionProps {
    faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
    const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id || null);

    return (
        <section id="faq" className="section section-dark">
            <div className="container">
                <div className="max-w-3xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-semibold mb-4">
                            Preguntas frecuentes
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            ¿Tienes dudas?
                        </h2>
                        <p className="text-slate-400">
                            Aquí respondemos las preguntas más comunes de nuestros estudiantes.
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/70 transition-colors"
                                >
                                    <span className="font-medium text-white pr-4">{faq.pregunta}</span>
                                    <svg
                                        className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === faq.id ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {openFaq === faq.id && (
                                    <div className="px-6 pb-5">
                                        <div className="pt-2 border-t border-slate-700/50">
                                            <p className="text-slate-400 leading-relaxed pt-4">{faq.respuesta}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Additional help */}
                    <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-slate-700/50">
                        <h3 className="text-xl font-semibold text-white mb-2">¿Tienes otra pregunta?</h3>
                        <p className="text-slate-400 mb-4">
                            Estamos aquí para ayudarte. Escríbenos y te responderemos en menos de 24 horas.
                        </p>
                        <a
                            href="mailto:soporte@cursoonline.com"
                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            soporte@cursoonline.com
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
