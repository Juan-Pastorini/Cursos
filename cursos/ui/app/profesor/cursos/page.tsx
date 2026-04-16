'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    BookOpen,
    Users,
    MoreVertical,
    ExternalLink
} from 'lucide-react';
import { getCursos, eliminarCurso } from '../../lib/api';
import { Curso } from '../../lib/types';

export default function MisCursosProfesor() {
    const { usuario } = useAuth();
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCursos = async () => {
            const res = await getCursos();
            if (res.success && res.data) {
                const impartidos = res.data.filter(c => {
                    const profId = typeof c.profesor === 'string' ? c.profesor : c.profesor?._id;
                    return profId === usuario?._id;
                });
                setCursos(impartidos);
            }
            setLoading(false);
        };
        fetchCursos();
    }, [usuario]);

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
            const res = await eliminarCurso(id);
            if (res.success) {
                setCursos(prev => prev.filter(c => c._id !== id));
            } else {
                alert(res.message || 'Error al eliminar el curso');
            }
        }
    };

    const filteredCursos = cursos.filter(c =>
        c.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Cursos</h1>
                    <p className="text-slate-500 mt-1 font-medium">Gestiona tu catálogo de cursos y contenido.</p>
                </div>

                <Link
                    href="/profesor/cursos/nuevo"
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-center justify-center"
                >
                    <Plus size={18} /> Crear Nuevo Curso
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por título..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none">
                        <option>Todos los niveles</option>
                        <option>Básico</option>
                        <option>Intermedio</option>
                        <option>Avanzado</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-slate-100 h-80 rounded-[2.5rem] animate-pulse" />
                    ))}
                </div>
            ) : filteredCursos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCursos.map(curso => (
                        <div key={curso._id} className="group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col">
                            {/* Image Header */}
                            <div className="relative h-48 w-full overflow-hidden">
                                {curso.imagen && (curso.imagen.startsWith('http') || curso.imagen.startsWith('/')) ? (
                                    <Image
                                        src={curso.imagen}
                                        alt={curso.titulo}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                                        <BookOpen size={48} className="text-slate-300/50" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                                        {curso.nivel}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Link
                                        href={`/plataforma/${curso._id}`}
                                        className="bg-indigo-600/90 backdrop-blur-md text-white p-2.5 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg"
                                        title="Ver en Plataforma"
                                    >
                                        <ExternalLink size={16} />
                                    </Link>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex-grow space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                                        {curso.titulo}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 font-medium">
                                        {curso.descripcion}
                                    </p>
                                </div>

                                <div className="flex items-center gap-6 pt-2 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                            <Users size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Alumnos</p>
                                            <p className="text-sm font-black text-slate-900">{curso.inscriptos || 0}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <BookOpen size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Precio</p>
                                            <p className="text-sm font-black text-slate-900">${curso.precio}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <Link
                                    href={`/profesor/clases?cursoId=${curso._id}`}
                                    className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 hover:underline"
                                >
                                    Gestionar Clases
                                </Link>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/profesor/cursos/editar/${curso._id}`}
                                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
                                    >
                                        <Edit size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(curso._id)}
                                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-200 shadow-sm transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-6 shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                        <BookOpen size={48} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900">Aún no tienes cursos</h3>
                        <p className="text-slate-500 max-w-md mx-auto font-medium">Empieza a compartir tu conocimiento creando tu primer curso profesional hoy mismo.</p>
                    </div>
                    <Link
                        href="/profesor/cursos/nuevo"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105"
                    >
                        <Plus size={20} /> Crear mi primer curso
                    </Link>
                </div>
            )}
        </div>
    );
}
