'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error, clearError, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/mis-cursos');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            router.push('/mis-cursos');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 py-20 px-4">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-md w-full relative z-10 animate-fade-in-up">
                {/* Logo / Branding */}
                <div className="text-center mb-10">
                    <Link href="/" className="flex items-center justify-center gap-3 mb-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-2xl">C</span>
                        </div>
                        <span className="text-white font-black text-3xl tracking-tighter">Curso<span className="text-violet-400">Pro</span></span>
                    </Link>
                    <p className="text-slate-400 text-sm">Tu carrera profesional empieza aquí</p>
                </div>

                {/* Card */}
                <div className="glass-dark rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <div className="p-8 md:p-10">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
                            <p className="text-slate-400">Ingresa tus credenciales para continuar</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex justify-between items-center animate-fade-in">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </span>
                                <button onClick={clearError} className="hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Correo Electrónico</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors z-10">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        className="input-dark pl-12"
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-semibold text-slate-300 ml-1">Contraseña</label>
                                    <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors z-10">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="input-dark pl-12 pr-12"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.882 9.882L9.881 9.881M14.122 14.122l.001.001m5.422 1.126A10.05 10.05 0 0021 12c0-5.385-4.365-9.75-9.75-9.75-1.127 0-2.203.19-3.21.536m-4.04 4.04l.115-.115M2.25 2.25l19.5 19.5" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary w-full py-4 text-base font-bold shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Iniciando...
                                        </span>
                                    ) : (
                                        'Iniciar Sesión'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-10 pt-8 border-t border-white/5 text-center">
                            <p className="text-slate-400 text-sm">
                                ¿Nuevo en la plataforma?{' '}
                                <Link href="/registro" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">
                                    Crea tu cuenta gratis
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm inline-flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver a la página principal
                    </Link>
                </div>
            </div>
        </div>
    );
}
