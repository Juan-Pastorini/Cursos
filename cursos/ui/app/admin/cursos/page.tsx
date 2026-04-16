'use client';

import React, { useEffect, useState } from 'react';
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit2,
    Trash2,
    Eye,
    Filter,
    CheckCircle2,
    XCircle,
    BookOpen
} from 'lucide-react';
import Image from 'next/image';
import { getCursos, eliminarCurso } from '../../lib/api';
import { Curso } from '../../lib/types';

export default function AdminCourses() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        setLoading(true);
        try {
            const response = await getCursos();
            if (response.success && response.data) {
                setCursos(response.data);
            }
        } catch (error) {
            console.error('Error al cargar cursos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
            try {
                const response = await eliminarCurso(id);
                if (response.success) {
                    fetchCursos();
                }
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const cursosFiltrados = cursos.filter(curso =>
        curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        curso.nivel.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Cursos</h1>
                    <p className="text-slate-500 text-sm">Administra tu catálogo de cursos y contenido.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-200">
                    <Plus size={18} />
                    Nuevo Curso
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Filters bar */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por título o nivel..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                            <Filter size={16} />
                            Filtros
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Curso</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Nivel</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Precio</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Inscriptos</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">Cargando cursos...</td>
                                </tr>
                            ) : cursosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">No se encontraron cursos.</td>
                                </tr>
                            ) : (
                                cursosFiltrados.map((curso) => (
                                    <tr key={curso._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative">
                                                    {curso.imagen ? (
                                                        <Image src={curso.imagen} alt={curso.titulo} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            <BookOpen size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="max-w-xs">
                                                    <p className="font-semibold text-slate-900 truncate">{curso.titulo}</p>
                                                    <p className="text-xs text-slate-500 truncate">{curso.descripcionCorta || curso.descripcion}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${curso.nivel === 'Avanzado' ? 'bg-indigo-100 text-indigo-700' :
                                                curso.nivel === 'Intermedio' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {curso.nivel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            ${curso.precio}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                                                <span className="text-sm font-medium">{curso.inscriptos || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-emerald-600">
                                                <CheckCircle2 size={16} />
                                                <span className="text-sm font-medium">Activo</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Ver alumnos">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-slate-100 rounded-lg text-violet-600 transition-colors" title="Editar">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(curso._id)}
                                                    className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
