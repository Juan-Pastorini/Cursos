'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { getCurso, crearCompra } from '../lib/api';
import ProtectedRoute from '../components/ProtectedRoute';
import { useSearchParams } from 'next/navigation';
import { Curso } from '../lib/types';

export default function CheckoutPage() {
    const { usuario } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const cursoId = searchParams.get('cursoId');

    const [curso, setCurso] = useState<Curso | null>(null);
    const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'paypal' | 'mercadopago'>('tarjeta');
    const [procesando, setProcesando] = useState(false);
    const [loadingCurso, setLoadingCurso] = useState(true);
    const [errorReg, setErrorReg] = useState<string | null>(null);


    // Datos de facturación
    const [datosFact, setDatosFact] = useState({
        nombre: usuario?.nombre || '',
        email: usuario?.email || '',
        pais: 'Argentina'
    });

    // Cargar datos del curso real
    useEffect(() => {
        const fetchCurso = async () => {
            if (!cursoId) {
                router.push('/');
                return;
            }
            try {
                const response = await getCurso(cursoId);
                if (response.success && response.data) {
                    setCurso(response.data);
                } else {
                    router.push('/');
                }
            } catch (err) {
                console.error('Error cargando curso:', err);
                router.push('/');
            } finally {
                setLoadingCurso(false);
            }
        };
        fetchCurso();
    }, [cursoId, router]);

    const handlePago = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        if (!curso || procesando) return;

        setProcesando(true);
        setErrorReg(null);

        try {
            const response = await crearCompra(
                curso._id,
                metodoPago,
                {
                    nombreCompleto: datosFact.nombre || usuario?.nombre || '',
                    email: datosFact.email || usuario?.email || '',
                    pais: datosFact.pais
                }
            );

            if (response.success) {
                router.push(`/checkout/success?cursoId=${curso._id}`);
            } else {
                setErrorReg(response.message || response.error || 'Hubo un error al procesar el pago.');
            }
        } catch (err: any) {
            console.error('Error en handlePago:', err);
            setErrorReg(err.message || 'Error de conexión con el servidor.');
        } finally {
            setProcesando(false);
        }
    };

    if (loadingCurso) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Cargando detalles del pago...</p>
                </div>
            </div>
        );
    }



    return (
        <ProtectedRoute>
            <div className="min-h-screen pt-32 pb-24 bg-slate-950">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-6 mb-16">
                            <h1 className="text-5xl font-black text-white tracking-tighter">Finalizar Inscripción</h1>
                            <div className="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent rounded-full hidden md:block"></div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-12">
                            {/* Formulario Izquierda */}
                            <div className="lg:col-span-8 space-y-10">
                                {/* Sección 1: Datos */}
                                <div className="glass-dark p-10 rounded-[3rem] border border-white/5 animate-fade-in-up">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl shadow-violet-500/20">1</div>
                                        <div>
                                            <h2 className="text-2xl font-black text-white tracking-tight">Información Personal</h2>
                                            <p className="text-slate-500 text-sm font-medium">Confirma los datos para tu acceso inmediato</p>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                                            <input
                                                type="text"
                                                className="input-dark"
                                                placeholder="Como aparecerá en el certificado"
                                                value={datosFact.nombre}
                                                onChange={(e) => setDatosFact({ ...datosFact, nombre: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email de Acceso</label>
                                            <input type="email" className="input-dark opacity-50 cursor-not-allowed font-medium" value={datosFact.email} disabled />
                                        </div>
                                    </div>
                                </div>

                                {/* Sección 2: Pago */}
                                <div className="glass-dark p-10 rounded-[3rem] border border-white/5 animate-fade-in-up delay-100">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl shadow-violet-500/20">2</div>
                                        <div>
                                            <h2 className="text-2xl font-black text-white tracking-tight">Método de Pago Seguro</h2>
                                            <p className="text-slate-500 text-sm font-medium">Transacciones protegidas con cifrado militar SSL</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6 mb-12">
                                        {[
                                            { id: 'tarjeta', label: 'Tarjeta', icon: '💳' },
                                            { id: 'paypal', label: 'PayPal', icon: '🌍' },
                                            { id: 'mercadopago', label: 'MP', icon: '🛡️' }
                                        ].map((metodo) => (
                                            <button
                                                key={metodo.id}
                                                onClick={() => setMetodoPago(metodo.id as any)}
                                                className={`p-8 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all duration-500 ${metodoPago === metodo.id
                                                    ? 'border-violet-600 bg-violet-600/10 shadow-glow'
                                                    : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'}`}
                                            >
                                                <span className="text-4xl">{metodo.icon}</span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${metodoPago === metodo.id ? 'text-violet-400' : 'text-slate-500'}`}>{metodo.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {metodoPago === 'tarjeta' ? (
                                        <div className="space-y-8 animate-fade-in p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Número de Tarjeta</label>
                                                <div className="relative">
                                                    <input type="text" className="input-dark pl-14" placeholder="0000 0000 0000 0000" />
                                                    <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiración</label>
                                                    <input type="text" className="input-dark" placeholder="MM/YY" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CVC</label>
                                                    <input type="password" className="input-dark" placeholder="***" maxLength={3} />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-10 bg-violet-500/5 rounded-[2.5rem] text-center border border-violet-500/10 animate-fade-in">
                                            <p className="text-violet-400 font-bold mb-3">Redirección Segura</p>
                                            <p className="text-slate-500 text-sm font-medium">Serás redirigido a la plataforma externa para finalizar el pago al confirmar tu inscripción.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Resumen Derecha */}
                            <div className="lg:col-span-4 space-y-10">
                                <div className="glass-dark p-10 rounded-[3rem] border border-white/5 sticky top-32 animate-fade-in-up delay-200">
                                    <h3 className="text-xl font-black text-white mb-10 tracking-tight">Resumen de Orden</h3>

                                    <div className="flex gap-6 mb-10">
                                        <div className="w-24 h-24 relative rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-white/10">
                                            <Image src={curso?.imagen?.startsWith('http') ? curso.imagen : "/hero-image.png"} alt="Curso" fill className="object-cover" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="text-lg font-black text-white leading-tight mb-2 truncate max-w-[150px]">{curso?.titulo}</h4>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit border border-emerald-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Acceso de por vida</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 border-t border-white/5 pt-8 mb-10">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Precio Estándar</span>
                                            <span className="text-slate-700 line-through font-bold">${((curso?.precio || 0) * 3).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Beca aplicada (67%)</span>
                                            <span className="text-emerald-400 font-black">-${((curso?.precio || 0) * 2).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline pt-6 border-t border-violet-500/20 text-white">
                                            <span className="text-lg font-black tracking-tight">Total Final</span>
                                            <div className="text-right">
                                                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tighter">${curso?.precio}</span>
                                                <span className="text-[10px] text-slate-600 font-bold ml-2">USD</span>
                                            </div>
                                        </div>
                                    </div>

                                    {errorReg && (
                                        <div className="p-5 bg-red-500/10 text-red-400 text-xs font-bold rounded-2xl mb-8 flex items-start gap-4 border border-red-500/20">
                                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {errorReg}
                                        </div>
                                    )}

                                    <button
                                        onClick={handlePago}
                                        disabled={procesando}
                                        className="btn-accent w-full py-6 text-lg tracking-[0.2em] font-black flex items-center justify-center gap-4 group/btn"
                                    >
                                        {procesando ? (
                                            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <>
                                                <span>Confirmar Inscripción</span>
                                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-10 flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-3 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                                            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Inscripción Segura SSL
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-violet-500/30">
                                        <Image src="https://i.pravatar.cc/150?u=roberto" alt="Avatar" width={64} height={64} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 italic leading-relaxed mb-1 font-medium">
                                            &quot;La mejor inversión para mi carrera technical. El acceso fue instantáneo.&quot;
                                        </p>
                                        <p className="text-[10px] font-black text-white border-l-2 border-violet-500 pl-3 uppercase tracking-widest">Roberto K. — Senior Dev</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
