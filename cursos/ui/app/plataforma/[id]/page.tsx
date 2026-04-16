'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getCurso, getClasesByCurso, crearClase, updateClase, eliminarClase, actualizarCurso } from '../../lib/api';
import { Curso, Clase } from '../../lib/types';
import ProtectedRoute from '../../components/ProtectedRoute';
import Chat from '../../components/Chat';
import ChatBot from '../../components/ChatBot';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Plus,
    Edit,
    Trash2,
    Save,
    Video,
    Link as LinkIcon,
    FileText
} from 'lucide-react';

export default function PlataformaPage() {
    const params = useParams();
    const router = useRouter();
    const { usuario, loading: authLoading } = useAuth();
    const [curso, setCurso] = useState<Curso | null>(null);
    const [clases, setClases] = useState<Clase[]>([]);
    const [loading, setLoading] = useState(true);
    const [moduloActivo, setModuloActivo] = useState(0);
    const [claseActiva, setClaseActiva] = useState<Clase | null>(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [botOpen, setBotOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('descripcion');
    const [moduloAbierto, setModuloAbierto] = useState<number | null>(0);

    // Editor States
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentModuleIndex, setCurrentModuleIndex] = useState<number | null>(null);
    const [nuevaClase, setNuevaClase] = useState({
        _id: '',
        titulo: '',
        descripcion: '',
        videoUrl: '',
        cuerpoDoc: '',
        orden: 1
    });

    const esProfe = usuario?.rol === 'admin' || (usuario?.rol === 'profesor' &&
        (typeof curso?.profesor === 'string' ? curso.profesor === usuario._id : curso?.profesor?._id === usuario._id));

    const handleSaveClase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!curso || currentModuleIndex === null) return;

        const claseData = {
            titulo: nuevaClase.titulo,
            descripcion: nuevaClase.descripcion,
            curso: curso._id,
            orden: nuevaClase.orden,
            contenidoMultimedia: {
                videoUrl: nuevaClase.videoUrl,
                cuerpoDoc: nuevaClase.cuerpoDoc,
                materialDescargable: []
            }
        };

        let res;
        let oldTitle = '';
        if (isEditing && nuevaClase._id) {
            const oldClase = clases.find(c => c._id === nuevaClase._id);
            oldTitle = oldClase?.titulo || '';
            res = await updateClase(nuevaClase._id, claseData);
        } else {
            res = await crearClase(claseData);
        }

        if (res.success && res.data) {
            // Sincronizar el título en el array de temas del curso
            const nuevosContenidos = [...curso.contenido];
            const temas = nuevosContenidos[currentModuleIndex].temas;

            if (isEditing) {
                const idxEnTemas = temas.indexOf(oldTitle);
                if (idxEnTemas !== -1) {
                    temas[idxEnTemas] = nuevaClase.titulo;
                } else if (!temas.includes(nuevaClase.titulo)) {
                    temas.push(nuevaClase.titulo);
                }
            } else {
                if (!temas.includes(nuevaClase.titulo)) {
                    temas.push(nuevaClase.titulo);
                }
            }

            await actualizarCurso(curso._id, { contenido: nuevosContenidos });

            // Recargar datos
            const [resCurso, resClases] = await Promise.all([
                getCurso(curso._id),
                getClasesByCurso(curso._id)
            ]);

            if (resCurso.success && resCurso.data) setCurso(resCurso.data);
            if (resClases.success && resClases.data) setClases(resClases.data);

            setModalOpen(false);
            setNuevaClase({ _id: '', titulo: '', descripcion: '', videoUrl: '', cuerpoDoc: '', orden: 1 });
        } else {
            alert(res.message || 'Error al guardar la clase');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
            const claseAEliminar = clases.find(c => c._id === id);
            const res = await eliminarClase(id);
            if (res.success) {
                // Eliminar del array de temas del curso
                if (curso && claseAEliminar) {
                    const nuevosContenidos = [...curso.contenido];
                    nuevosContenidos.forEach(mod => {
                        mod.temas = mod.temas.filter(t => t !== claseAEliminar.titulo);
                    });
                    await actualizarCurso(curso._id, { contenido: nuevosContenidos });
                    setCurso({ ...curso, contenido: nuevosContenidos });
                }

                setClases(prev => prev.filter(c => c._id !== id));
                if (claseActiva?._id === id) {
                    setClaseActiva(null);
                }
            } else {
                alert(res.message || 'Error al eliminar');
            }
        }
    };

    const toggleModulo = (idx: number) => {
        setModuloAbierto(prev => prev === idx ? null : idx);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (params.id) {
                const [resCurso, resClases] = await Promise.all([
                    getCurso(params.id as string),
                    getClasesByCurso(params.id as string)
                ]);

                if (resCurso.success && resCurso.data) {
                    setCurso(resCurso.data);
                } else {
                    router.push('/mis-cursos');
                }

                if (resClases.success && resClases.data) {
                    setClases(resClases.data);
                    if (resClases.data.length > 0) {
                        setClaseActiva(resClases.data[0]);
                    }
                }
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, router]);

    // Soporte para teclado (Navegación con flechas)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') irASiguienteClase();
            if (e.key === 'ArrowLeft') irAClaseAnterior();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [claseActiva, clases]);

    // Verificar si el usuario tiene acceso
    useEffect(() => {
        if (!authLoading && usuario && curso) {
            const esProfeDelCurso = usuario.rol === 'profesor' &&
                (typeof curso.profesor === 'string' ? curso.profesor === usuario._id : curso.profesor?._id === usuario._id);
            const esAdmin = usuario.rol === 'admin';
            const tieneAcceso = usuario.cursosComprados.some(
                item => item.curso._id === curso._id
            );

            if (!tieneAcceso && !esAdmin && !esProfeDelCurso) {
                router.push('/');
            }
        }
    }, [usuario, curso, authLoading, router]);

    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-violet-500/20 rounded-full"></div>
                    <div className="absolute inset-0 w-20 h-20 border-t-2 border-violet-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!curso) return null;

    const temasModuloActual = curso.contenido[moduloActivo]?.temas || [];
    const leccionActual = claseActiva ? claseActiva.titulo : (temasModuloActual[0] || 'Clase');

    const irASiguienteClase = () => {
        if (!claseActiva) return;
        const currentIndex = clases.findIndex(c => c._id === claseActiva._id);
        if (currentIndex < clases.length - 1) {
            setClaseActiva(clases[currentIndex + 1]);
        }
    };

    const irAClaseAnterior = () => {
        if (!claseActiva) return;
        const currentIndex = clases.findIndex(c => c._id === claseActiva._id);
        if (currentIndex > 0) {
            setClaseActiva(clases[currentIndex - 1]);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-violet-500/30">
                {/* Header Sub-Nav */}
                <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-3 lg:gap-6">
                        <Link href="/mis-cursos" className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all text-[10px] lg:text-xs font-black uppercase tracking-widest">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            <span className="hidden sm:inline">Panel</span>
                        </Link>
                        <div className="h-6 lg:h-8 w-px bg-slate-200"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center max-w-[50%] hidden md:flex">
                            <h1 className="font-black text-slate-900 tracking-tight leading-none text-base lg:text-xl truncate w-full">{curso.titulo}</h1>
                        </div>

                        {/* Mobile Titles - Left Aligned */}
                        <div className="md:hidden max-w-[150px] sm:max-w-none">
                            <h1 className="font-black text-slate-900 tracking-tight leading-none text-sm truncate">{curso.titulo}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-900 leading-tight">{usuario?.nombre}</span>
                                <span className="text-[9px] font-black text-violet-600 uppercase tracking-widest">
                                    {esProfe ? (usuario?.rol === 'admin' ? 'Modo Administrador' : 'Modo Instructor') : 'Estudiante Premium'}
                                </span>
                            </div>
                            <div className="relative group cursor-pointer">
                                {usuario?.foto ? (
                                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100 ring-2 ring-violet-50 group-hover:ring-violet-200 transition-all">
                                        <Image
                                            src={usuario.foto}
                                            alt={usuario.nombre}
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-violet-50 group-hover:ring-violet-200 transition-all">
                                        {usuario?.nombre.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex flex-grow overflow-hidden h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)]">
                    {/* Sidebar Navigation - FIXED */}
                    <aside className="hidden lg:flex w-[340px] bg-white border-r border-slate-200 flex-col shrink-0 overflow-y-auto custom-scrollbar z-40">
                        {/* Progress Section in Sidebar */}
                        <div className="p-7 border-b border-slate-100 bg-slate-50/30">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Tu Progreso</span>
                                <span className="text-sm font-black text-violet-600">0%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                <div className="h-full bg-violet-600 w-0 shadow-[0_0_8px_rgba(139,92,246,0.2)]"></div>
                            </div>
                        </div>

                        <div className="p-7">
                            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">Plan de formación</h2>

                            <div className="space-y-4">
                                {curso.contenido.map((modulo, mIdx) => {
                                    const isOpen = moduloAbierto === mIdx;

                                    // Agrupar clases por modulo basándonos en los temas (si es posible)
                                    // Por ahora, si no hay asociación directa, podemos intentar buscar coincidencias por nombre
                                    // o simplemente mostrar las clases que correspondan al índice si coinciden en cantidad.
                                    // Para este diseño, mostraremos las clases que correspondan a este modulo.
                                    const clasesDelModulo = clases.filter(c =>
                                        modulo.temas.some(t => t.toLowerCase() === c.titulo.toLowerCase())
                                    );

                                    // Si no hay correspondencia exacta, usamos un fallback de "Módulo" si las clases están ordenadas
                                    // (Esto es una heurística para que no se vea vacío si los nombres no coinciden exacto)
                                    const displayClases = clasesDelModulo.length > 0 ? clasesDelModulo : (mIdx === 0 && clases.length > 0 ? clases : []);

                                    return (
                                        <div key={mIdx} className="space-y-2">
                                            {/* Modulo Header */}
                                            <div
                                                onClick={() => toggleModulo(mIdx)}
                                                className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all group cursor-pointer ${isOpen ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border transition-colors ${isOpen ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-400'
                                                        }`}>
                                                        {mIdx + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-sm font-black tracking-tight ${isOpen ? 'text-white' : 'text-slate-900 group-hover:text-black'}`}>
                                                            {modulo.modulo}
                                                        </h3>
                                                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isOpen ? 'text-slate-400' : 'text-slate-400'}`}>
                                                            {modulo.temas.length} Lecciones
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {esProfe && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsEditing(false);
                                                                setCurrentModuleIndex(mIdx);
                                                                setNuevaClase({ _id: '', titulo: '', descripcion: '', videoUrl: '', cuerpoDoc: '', orden: displayClases.length + 1 });
                                                                setModalOpen(true);
                                                            }}
                                                            className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white hover:bg-slate-200 text-slate-400'}`}
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    )}
                                                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                        <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Clases List */}
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden space-y-1 pl-2"
                                                    >
                                                        {displayClases.length > 0 ? (
                                                            displayClases.map((clase, cIdx) => {
                                                                const isActive = claseActiva?._id === clase._id;
                                                                return (
                                                                    <div key={clase._id} className="group relative">
                                                                        <button
                                                                            onClick={() => {
                                                                                setClaseActiva(clase);
                                                                                setModuloActivo(mIdx);
                                                                            }}
                                                                            className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all group ${isActive
                                                                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 ring-2 ring-violet-50'
                                                                                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                                                                                }`}
                                                                        >
                                                                            <div className="flex-grow pr-16 md:pr-0">
                                                                                <div className={`text-[13px] font-bold leading-snug tracking-tight ${isActive ? 'text-white' : 'text-slate-700'}`}>
                                                                                    {clase.titulo}
                                                                                </div>
                                                                            </div>
                                                                            {isActive && (
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                                            )}
                                                                        </button>

                                                                        {esProfe && (
                                                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setIsEditing(true);
                                                                                        setCurrentModuleIndex(mIdx);
                                                                                        setNuevaClase({
                                                                                            _id: clase._id,
                                                                                            titulo: clase.titulo,
                                                                                            descripcion: clase.descripcion,
                                                                                            videoUrl: clase.contenidoMultimedia.videoUrl || '',
                                                                                            cuerpoDoc: clase.contenidoMultimedia.cuerpoDoc || '',
                                                                                            orden: clase.orden
                                                                                        });
                                                                                        setModalOpen(true);
                                                                                    }}
                                                                                    className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white hover:bg-slate-200 text-slate-400'}`}
                                                                                >
                                                                                    <Edit size={12} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleDelete(clase._id);
                                                                                    }}
                                                                                    className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-white/10 hover:bg-rose-500 text-white' : 'bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500'}`}
                                                                                >
                                                                                    <Trash2 size={12} />
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            modulo.temas.map((tema, tIdx) => (
                                                                <div key={tIdx} className="p-4 pl-6 text-slate-400 text-xs font-bold flex items-center gap-3">
                                                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                                    {tema}
                                                                </div>
                                                            ))
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* Main View Area */}
                    <main className="flex-grow flex flex-col overflow-hidden relative">
                        <div className="flex-grow overflow-y-auto custom-scrollbar p-4 lg:p-10 pt-8 lg:pt-12 pb-24 lg:pb-12 bg-slate-50/50">
                            <div className="max-w-[1000px] mx-auto space-y-8">
                                {/* Cinema Video Player */}
                                <div className="group relative aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 ring-1 ring-slate-200/50 ring-inset">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 opacity-70"></div>

                                    <motion.div
                                        key={claseActiva?._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 lg:p-12 z-20"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05, rotate: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-16 h-16 lg:w-20 lg:h-20 bg-white text-slate-900 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] cursor-pointer group/play"
                                        >
                                            <svg className="w-8 h-8 lg:w-10 lg:h-10 ml-1 text-slate-900 group-hover/play:text-violet-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4.516 7.548c0-.923.951-1.471 1.699-.926l7.74 5.645a1.125 1.125 0 010 1.852l-7.74 5.645c-.748.545-1.699-.003-1.699-.926V7.548z" />
                                            </svg>
                                        </motion.div>
                                        <h2 className="text-xl lg:text-4xl font-black text-white mb-4 tracking-tighter px-4 drop-shadow-2xl max-w-3xl leading-tight text-center mx-auto">
                                            {leccionActual}
                                        </h2>
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-400 font-bold text-[8px] lg:text-[10px] uppercase tracking-[0.4em] opacity-80 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                                                Premium Stream
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                                                <span className="text-violet-400 font-black text-[8px] lg:text-[10px] uppercase tracking-[0.4em]">
                                                    1080p Ultra HD
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-30">
                                        <div className="h-full bg-violet-600 w-1/4 shadow-[0_0_20px_#8b5cf6]"></div>
                                    </div>
                                </div>

                                <div className="space-y-8 bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm">
                                    {/* Navigation and Actions */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={irAClaseAnterior}
                                                disabled={clases.findIndex(c => c._id === claseActiva?._id) === 0}
                                                className="px-8 py-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-xs hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-3 group"
                                            >
                                                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                                                Anterior
                                            </button>
                                            <button
                                                onClick={irASiguienteClase}
                                                disabled={clases.findIndex(c => c._id === claseActiva?._id) === clases.length - 1}
                                                className="px-8 py-4 rounded-xl bg-violet-600 text-white font-black text-xs hover:bg-violet-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-violet-200 flex items-center gap-3 group"
                                            >
                                                Siguiente
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 font-bold">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Progreso:</span>
                                            <span className="text-sm text-slate-900 leading-none">
                                                {clases.findIndex(c => c._id === claseActiva?._id) + 1} / {clases.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tabs Navigation */}
                                    <div className="flex items-center gap-10 border-b border-slate-100 overflow-x-auto no-scrollbar">
                                        {['descripcion', 'recursos', 'preguntas'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`pb-5 text-xs lg:text-sm font-black uppercase tracking-[0.25em] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                            >
                                                {tab === 'preguntas' ? 'Comunidad' : tab}
                                                {activeTab === tab && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute bottom-[-1px] left-0 right-0 h-1 bg-violet-600 rounded-full z-10"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tab Content */}
                                    <div className="min-h-[300px] pt-4">
                                        <AnimatePresence mode="wait">
                                            {activeTab === 'descripcion' && (
                                                <motion.div
                                                    key="desc"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-8"
                                                >
                                                    <div className="space-y-6 text-center max-w-3xl mx-auto">
                                                        <h3 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">
                                                            Acerca de esta lección
                                                        </h3>
                                                        <p className="text-slate-800 text-lg lg:text-xl leading-relaxed font-semibold">
                                                            {claseActiva?.descripcion || 'Esta lección no tiene una descripción detallada todavía.'}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                        <div className="p-7 rounded-[2rem] bg-slate-50 border border-slate-200 shadow-sm flex items-center gap-5 hover:border-violet-200 transition-colors group">
                                                            <div className="w-14 h-14 rounded-2xl bg-white text-violet-600 flex items-center justify-center shadow-sm group-hover:bg-violet-600 group-hover:text-white transition-all">
                                                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duración total</p>
                                                                <p className="text-base font-black text-slate-900">12:45 min</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-7 rounded-[2rem] bg-slate-50 border border-slate-200 shadow-sm flex items-center gap-5 hover:border-emerald-200 transition-colors group">
                                                            <div className="w-14 h-14 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nivel de clase</p>
                                                                <p className="text-base font-black text-slate-900">Intermedio</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === 'recursos' && (
                                                <motion.div
                                                    key="res"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-10"
                                                >
                                                    <h3 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight text-center">Recursos del estudiante</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {claseActiva?.contenidoMultimedia.materialDescargable.length ? (
                                                            claseActiva.contenidoMultimedia.materialDescargable.map((material, mIdx) => (
                                                                <a
                                                                    key={mIdx}
                                                                    href={material.url}
                                                                    target="_blank"
                                                                    className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all group shadow-sm"
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-violet-500 transition-colors">
                                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                                        </div>
                                                                        <span className="text-sm font-black text-slate-700 group-hover:text-slate-950">{material.nombre}</span>
                                                                    </div>
                                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 group-hover:text-violet-600 transition-colors">
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                                    </div>
                                                                </a>
                                                            ))
                                                        ) : (
                                                            <div className="col-span-2 py-16 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                                </div>
                                                                <p className="text-slate-400 font-bold text-sm">No hay archivos adicionales para esta clase.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === 'preguntas' && (
                                                <motion.div
                                                    key="qa"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-8"
                                                >
                                                    <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm relative overflow-hidden group">
                                                        <div className="absolute inset-0 bg-violet-50/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        <div className="relative z-10">
                                                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner">
                                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                                            </div>
                                                            <h4 className="text-slate-900 text-xl font-black mb-2">Comunidad Educativa</h4>
                                                            <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">
                                                                Estamos preparando la mejor experiencia de aprendizaje social para ti. ¡Vuelve pronto!
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Chat Bubble (Right) */}
                        <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[70]">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setChatOpen(!chatOpen)}
                                className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] transition-all ${chatOpen
                                    ? 'bg-slate-900 text-white rotate-90'
                                    : 'bg-violet-600 text-white hover:bg-violet-500'
                                    }`}
                            >
                                {chatOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <div className="relative">
                                        <svg className="w-6 h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                                    </div>
                                )}
                            </motion.button>
                        </div>

                        {/* Overlaid Chat Panel */}
                        <AnimatePresence>
                            {chatOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40, scale: 0.95, x: 20 }}
                                    animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, y: 40, scale: 0.95, x: 20 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 400 }}
                                    className="fixed bottom-24 right-4 lg:bottom-28 lg:right-10 w-[min(calc(100vw-32px),450px)] h-[min(calc(100vh-160px),650px)] z-[65] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-200 rounded-[2.5rem] overflow-hidden bg-white/95 backdrop-blur-xl"
                                >
                                    <Chat cursoId={curso._id} usuarioActual={usuario} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>

                <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.08); border-radius: 20px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.15); }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>

                {/* Modal Editor de Clase */}
                <AnimatePresence>
                    {modalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                onClick={() => setModalOpen(false)}
                            ></motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden"
                            >
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-violet-100">
                                            {isEditing ? <Edit size={20} /> : <Plus size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                                {isEditing ? 'Editar Lección' : 'Nueva Lección'}
                                            </h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Módulo: {curso.contenido[currentModuleIndex || 0].modulo}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSaveClase} className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Título de la Lección</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Ej: Introducción a React..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-4 focus:ring-violet-500/10 focus:bg-white focus:border-violet-500/50 transition-all outline-none"
                                                value={nuevaClase.titulo}
                                                onChange={(e) => setNuevaClase({ ...nuevaClase, titulo: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">URL del Vídeo (Vimeo/YouTube)</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input
                                                    required
                                                    type="url"
                                                    placeholder="https://vimeo.com/..."
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:ring-4 focus:ring-violet-500/10 focus:bg-white focus:border-violet-500/50 transition-all outline-none"
                                                    value={nuevaClase.videoUrl}
                                                    onChange={(e) => setNuevaClase({ ...nuevaClase, videoUrl: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Contenido / Descripción</label>
                                            <textarea
                                                rows={4}
                                                placeholder="Resumen de la clase o instrucciones para el alumno..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-4 focus:ring-violet-500/10 focus:bg-white focus:border-violet-500/50 transition-all outline-none resize-none"
                                                value={nuevaClase.descripcion}
                                                onChange={(e) => setNuevaClase({ ...nuevaClase, descripcion: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-violet-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-violet-200 hover:bg-violet-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        {isEditing ? 'Guardar Cambios' : 'Publicar Lección'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </ProtectedRoute>
    );
}
