'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'next/navigation';
import {
    Plus,
    MonitorPlay,
    Trash2,
    Edit2,
    GripVertical,
    Save,
    X,
    FolderPlus,
    Video,
    FileText,
    Link as LinkIcon
} from 'lucide-react';
import { getCursos, getClasesByCurso, crearClase } from '../../lib/api';
import { Curso, Clase } from '../../lib/types';
import Link from 'next/link';

function ClassesManagementContent() {
    const { usuario } = useAuth();
    const searchParams = useSearchParams();
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState<string>(searchParams.get('cursoId') || '');
    const [clases, setClases] = useState<Clase[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [nuevaClase, setNuevaClase] = useState({
        titulo: '',
        descripcion: '',
        videoUrl: '',
        cuerpoDoc: '',
        orden: 1
    });

    useEffect(() => {
        const fetchCursosData = async () => {
            const res = await getCursos();
            if (res.success && res.data) {
                const impartidos = res.data.filter(c => {
                    const profId = typeof c.profesor === 'string' ? c.profesor : c.profesor?._id;
                    return profId === usuario?._id;
                });
                setCursos(impartidos);

                // Validar que el curso seleccionado por URL pertenezca al profesor
                const cursoEnUrl = searchParams.get('cursoId');
                const esDueño = impartidos.some(c => c._id === cursoEnUrl);

                if (cursoEnUrl && esDueño) {
                    setCursoSeleccionado(cursoEnUrl);
                } else if (!cursoSeleccionado && impartidos.length > 0) {
                    setCursoSeleccionado(impartidos[0]._id);
                } else if (cursoEnUrl && !esDueño) {
                    setCursoSeleccionado(''); // Reset if invalid URL access
                }
            }
        };
        fetchCursosData();
    }, [usuario, searchParams]);

    useEffect(() => {
        const fetchClases = async () => {
            if (cursoSeleccionado) {
                setLoading(true);
                const res = await getClasesByCurso(cursoSeleccionado);
                if (res.success && res.data) {
                    setClases(res.data);
                }
                setLoading(false);
            }
        };
        fetchClases();
    }, [cursoSeleccionado]);

    const handleSaveClase = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await crearClase({
                titulo: nuevaClase.titulo,
                descripcion: nuevaClase.descripcion,
                curso: cursoSeleccionado,
                orden: nuevaClase.orden,
                contenidoMultimedia: {
                    videoUrl: nuevaClase.videoUrl,
                    materialDescargable: [],
                    cuerpoDoc: nuevaClase.cuerpoDoc
                }
            });

            if (res.success && res.data) {
                setClases([...clases, res.data]);
                setModalOpen(false);
                setNuevaClase({ titulo: '', descripcion: '', videoUrl: '', cuerpoDoc: '', orden: clases.length + 1 });
                alert('¡Lección publicada con éxito!');
            } else {
                alert(res.message || 'Error al crear la lección');
            }
        } catch (error) {
            alert('Error de conexión al servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Contenido</h1>
                    <p className="text-slate-500 mt-1 font-medium">Sube y organiza las lecciones de tus cursos.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href={`/plataforma/${cursoSeleccionado}`}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                    >
                        <Video size={18} />
                        Nueva Experiencia de Gestión
                    </Link>
                </div>
            </div>

            {/* Banner Informativo */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100">
                <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tight">¡Gestiona tus clases como un alumno! 🚀</h2>
                    <p className="text-indigo-100 font-medium max-w-xl">
                        Ahora puedes agregar vídeos, información y archivos directamente desde la plataforma de visualización.
                        Es más rápido, intuitivo y verás exactamente lo que verán tus alumnos.
                    </p>
                </div>
                <Link
                    href={`/plataforma/${cursoSeleccionado}`}
                    className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 transition-all shadow-lg"
                >
                    Ir a la Plataforma
                </Link>
            </div>

            {/* Classes List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden opacity-60">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-300 rounded-xl flex items-center justify-center text-white">
                            <MonitorPlay size={20} />
                        </div>
                        <h2 className="font-black text-slate-900">Vista de Listado (Legacy)</h2>
                    </div>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {clases.length} Total
                    </span>
                </div>

                <div className="p-4">
                    {loading ? (
                        <div className="py-20 text-center italic text-slate-400 font-medium">Cargando lecciones...</div>
                    ) : clases.length > 0 ? (
                        <div className="space-y-3">
                            {clases.map((clase, idx) => (
                                <div key={clase._id} className="group p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex items-center gap-6">
                                    <div className="text-slate-300 transition-colors group-hover:text-indigo-300">
                                        <GripVertical size={20} />
                                    </div>
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-sm group-hover:bg-white group-hover:text-indigo-600 transition-all">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-slate-900 leading-tight">{clase.titulo}</h4>
                                        <div className="flex items-center gap-4 mt-1">
                                            {clase.contenidoMultimedia?.videoUrl && (
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                                    <Video size={10} /> Video Subido
                                                </span>
                                            )}
                                            {clase.contenidoMultimedia?.cuerpoDoc && (
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                                                    <FileText size={10} /> Texto
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 shadow-sm transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
                                <MonitorPlay size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">No hay lecciones aún</h3>
                                <p className="text-sm text-slate-500 mt-1">Sube el primer vídeo para que tus alumnos empiecen a aprender.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Nueva Clase (Simple) */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <FolderPlus size={20} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Nueva Lección</h3>
                            </div>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
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
                                        placeholder="Ej: Introducción a la arquitectura..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/50 transition-all outline-none"
                                        value={nuevaClase.titulo}
                                        onChange={(e) => setNuevaClase({ ...nuevaClase, titulo: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">URL del Vídeo</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            required
                                            type="url"
                                            placeholder="https://vimeo.com/..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/50 transition-all outline-none"
                                            value={nuevaClase.videoUrl}
                                            onChange={(e) => setNuevaClase({ ...nuevaClase, videoUrl: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Descripción / Apuntes</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Resumen de la clase o instrucciones para el alumno..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/50 transition-all outline-none resize-none"
                                        value={nuevaClase.descripcion}
                                        onChange={(e) => setNuevaClase({ ...nuevaClase, descripcion: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Publicar Lección
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ClassesManagement() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ClassesManagementContent />
        </Suspense>
    );
}
