'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '../context/AuthContext';
import { Curso } from '../lib/types';
import HeroSection from './HeroSection';
import CursosList from './CursosList';
import { beneficiosMock } from '../lib/mockData';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Lazy load non-critical sections
const BeneficiosSection = dynamic(() => import('./BeneficiosSection'), {
    ssr: true,
    loading: () => <div className="h-96 bg-slate-950/50 animate-pulse rounded-[3rem] m-10" />
});

const TestimoniosSection = dynamic(() => import('./TestimoniosSection'), {
    ssr: true,
    loading: () => <div className="h-96 bg-slate-950/50 animate-pulse rounded-[3rem] m-10" />
});

interface HomeClientProps {
    initialCursos: Curso[];
}

export default function HomeClient({ initialCursos }: HomeClientProps) {
    const { usuario } = useAuth();

    if (initialCursos.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-lg p-12 glass-dark rounded-[3rem] border border-white/10 shadow-2xl"
                >
                    <div className="text-6xl mb-8">🔭</div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Preparando el lanzamiento</h2>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
                        Estamos terminando de pulir las lecciones para ofrecerte la mejor experiencia de aprendizaje posible.
                    </p>
                    <Link href="/registro" className="btn-accent btn-lg w-full">
                        Notificarme al Lanzamiento
                    </Link>
                </motion.div>
            </div>
        );
    }

    const cursoDestacado = initialCursos[0];

    return (
        <div className="bg-slate-950 selection:bg-violet-500 selection:text-white">
            <HeroSection curso={cursoDestacado} />

            <CursosList initialCursos={initialCursos} usuario={usuario} />

            <BeneficiosSection beneficios={beneficiosMock} />

            <TestimoniosSection />

            {/* Epic Footer CTA */}
            <section className="py-40 relative overflow-hidden bg-slate-950">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent opacity-50"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center space-y-12"
                    >
                        <h2 className="text-5xl md:text-8xl font-black text-white tracking-[-0.05em] leading-[0.9]">
                            Es hora de <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Transformarte</span>
                        </h2>

                        <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                            No dejes que tu carrera se estanque. Únete a los más de 10,000 profesionales que ya dieron el salto.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-6 items-center pt-8">
                            <Link href="#cursos" className="btn-accent btn-lg px-16 group">
                                Explorar Academia
                                <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link href="/registro" className="text-white font-black text-lg uppercase tracking-widest hover:text-violet-400 transition-colors py-4">
                                Crear Cuenta Gratis
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
