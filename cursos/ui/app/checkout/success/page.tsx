'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

import { Suspense } from 'react';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { usuario } = useAuth();
    const [counter, setCounter] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/mis-cursos');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden px-4">
            {/* Background Glows */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"
            ></motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"
            ></motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl w-full text-center z-10"
            >
                {/* Icon Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.3 }}
                    className="mb-12 relative inline-block"
                >
                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/20 relative border border-white/20">
                        <motion.svg
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="w-16 h-16 text-white drop-shadow-md"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 tracking-tight"
                >
                    ¡Pago Confirmado!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-xl text-slate-400 mb-12 max-w-lg mx-auto leading-relaxed"
                >
                    ¡Bienvenido a la comunidad, <span className="text-white font-bold">{usuario?.nombre || 'estudiante'}</span>!
                    Tu inscripción se ha procesado con éxito y ya tienes acceso total al contenido.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
                >
                    <Link
                        href="/mis-cursos"
                        className="group relative p-[1px] rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative bg-slate-900 border border-white/10 rounded-2xl py-4 px-8 font-bold flex items-center justify-center gap-3">
                            <span>Ir a Mis Cursos</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </Link>

                    <Link
                        href="/"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 px-8 font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        Explorar más
                    </Link>
                </motion.div>

                {/* Auto redirect info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="pt-8 border-t border-white/10"
                >
                    <div className="flex items-center justify-center gap-4 text-slate-500 text-sm font-medium">
                        <p>Serás redirigido automáticamente en</p>
                        <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center text-violet-400 font-bold font-mono">
                            {counter}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Confetti-like particles */}
            {mounted && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                opacity: 0,
                                x: Math.random() * 100 + "%",
                                y: "110%"
                            }}
                            animate={{
                                opacity: [0, 0.2, 0],
                                y: "-10%"
                            }}
                            transition={{
                                duration: 5 + Math.random() * 5,
                                delay: Math.random() * 5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)],
                            }}
                        ></motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SuccessPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </ProtectedRoute>
    );
}

