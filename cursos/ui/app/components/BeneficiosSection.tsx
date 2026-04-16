'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Beneficio {
    icono: string;
    titulo: string;
    descripcion: string;
}

interface BeneficiosSectionProps {
    beneficios: Beneficio[];
}

export default function BeneficiosSection({ beneficios }: BeneficiosSectionProps) {
    return (
        <section id="beneficios" className="py-60 bg-slate-950 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-violet-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-600/10 rounded-full blur-[120px]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24 max-w-3xl mx-auto space-y-6"
                >
                    <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 text-violet-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                        Experiencia de Aprendizaje
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        ¿Por qué elegir <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Nuestra Academia?</span>
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                        No somos solo videos. Somos una plataforma diseñada para que realmente domines la tecnología y consigas resultados tangibles.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {beneficios.map((beneficio, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-10 rounded-[2.5rem] glass-dark border border-white/5 hover:border-violet-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 text-center flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500">
                                {beneficio.icono}
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-violet-400 transition-colors">
                                {beneficio.titulo}
                            </h3>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                {beneficio.descripcion}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

