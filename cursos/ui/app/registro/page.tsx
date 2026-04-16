'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function RegistroPage() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const { registro, loading, error, clearError, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/mis-cursos');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (password !== confirmPassword) {
            setFormError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setFormError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const success = await registro(nombre, email, password);
        if (success) {
            router.push('/mis-cursos');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 py-24 px-4">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            <div className="max-w-md w-full relative z-10 animate-fade-in-up">
                {/* Branding */}
                <div className="text-center mb-10">
                    <Link href="/" className="flex items-center justify-center gap-3 mb-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-2xl">C</span>
                        </div>
                        <span className="text-white font-black text-3xl tracking-tighter">Curso<span className="text-violet-400">Pro</span></span>
                    </Link>
                    <p className="text-slate-400 text-sm">Empieza tu camino hacia el éxito hoy mismo</p>
                </div>

                {/* Card */}
                <div className="glass-dark rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <div className="p-8 md:p-10">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Crea tu cuenta</h1>
                            <p className="text-slate-400">Únete a cientos de estudiantes graduados</p>
                        </div>

                        {(error || formError) && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex justify-between items-center animate-fade-in">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error || formError}
                                </span>
                                <button onClick={() => { clearError(); setFormError(null); }} className="hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Nombre Completo</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors z-10">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="input-dark pl-12"
                                        placeholder="Ej: Juan Pérez"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 ml-1">Contraseña</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="input-dark text-sm px-5"
                                        placeholder="Min. 6 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 ml-1">Confirmar</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="input-dark text-sm px-5"
                                        placeholder="Repite contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center ml-1">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.882 9.882L9.881 9.881M14.122 14.122l.001.001m5.422 1.126A10.05 10.05 0 0021 12c0-5.385-4.365-9.75-9.75-9.75-1.127 0-2.203.19-3.21.536m-4.04 4.04l.115-.115M2.25 2.25l19.5 19.5" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                    {showPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full py-4 text-base font-bold shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creando cuenta...
                                    </span>
                                ) : (
                                    'Registrarse'
                                )}
                            </button>

                            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                                Al registrarte, confirmas que has leído y aceptas nuestra <a href="#" className="text-slate-400 underline hover:text-white transition-colors">Política de Privacidad</a> y los <a href="#" className="text-slate-400 underline hover:text-white transition-colors">Términos del Servicio</a>.
                            </p>
                        </form>

                        <div className="mt-10 pt-8 border-t border-white/5 text-center">
                            <p className="text-slate-400 text-sm">
                                ¿Ya eres parte de la academia?{' '}
                                <Link href="/login" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">
                                    Inicia sesión aquí
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
