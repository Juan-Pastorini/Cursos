'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import {
    Save,
    Image as ImageIcon,
    BookOpen,
    Layout,
    ArrowLeft,
    Minus
} from 'lucide-react';
import { getCurso, actualizarCurso } from '../../../lib/api';
import { Curso } from '../../../lib/types';

export default function EditarCurso() {
    const router = useRouter();
    const params = useParams();
    const { usuario } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [cursoData, setCursoData] = useState<Partial<Curso>>({
        titulo: '',
        descripcion: '',
        precio: 0,
        nivel: 'Básico',
        imagen: '',
        contenido: []
    });

    useEffect(() => {
        const fetchCurso = async () => {
            if (params.id) {
                const res = await getCurso(params.id as string);
                if (res.success && res.data) {
                    setCursoData(res.data);
                } else {
                    alert('Error al cargar el curso');
                    router.push('/profesor/cursos');
                }
                setLoading(false);
            }
        };
        fetchCurso();
    }, [params.id, router]);

    const handleAddModulo = () => {
        const nuevosModulos = [...(cursoData.contenido || []), { modulo: `Nuevo Módulo`, temas: [] }];
        setCursoData({ ...cursoData, contenido: nuevosModulos });
    };

    const handleRemoveModulo = (index: number) => {
        const nuevosModulos = [...(cursoData.contenido || [])];
        nuevosModulos.splice(index, 1);
        setCursoData({ ...cursoData, contenido: nuevosModulos });
    };

    const handleModuloChange = (index: number, value: string) => {
        const nuevosModulos = [...(cursoData.contenido || [])];
        nuevosModulos[index].modulo = value;
        setCursoData({ ...cursoData, contenido: nuevosModulos });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!params.id) return;
        setSaving(true);

        try {
            const res = await actualizarCurso(params.id as string, cursoData);
            if (res.success) {
                alert('¡Curso actualizado con éxito!');
                router.push('/profesor/cursos');
            } else {
                alert(res.message || 'Error al actualizar el curso');
            }
        } catch (error) {
            alert('Error de conexión');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Editar Curso</h1>
                        <p className="text-slate-500 mt-1 font-medium">Actualiza la información y estructura de tu curso.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Card */}
                <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <BookOpen size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900">Configuración General</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título del Curso</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/50 transition-all outline-none"
                                value={cursoData.titulo}
                                onChange={(e) => setCursoData({ ...cursoData, titulo: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción Breve</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/50 transition-all outline-none resize-none"
                                value={cursoData.descripcion}
                                onChange={(e) => setCursoData({ ...cursoData, descripcion: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio ($ USD)</label>
                            <input
                                required
                                type="number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/50 transition-all outline-none"
                                value={cursoData.precio}
                                onChange={(e) => setCursoData({ ...cursoData, precio: Number(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nivel</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/50 transition-all outline-none appearance-none"
                                value={cursoData.nivel}
                                onChange={(e) => setCursoData({ ...cursoData, nivel: e.target.value })}
                            >
                                <option>Básico</option>
                                <option>Intermedio</option>
                                <option>Avanzado</option>
                                <option>Experto</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL de Imagen de Portada</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="url"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/50 transition-all outline-none"
                                    value={cursoData.imagen || ''}
                                    onChange={(e) => setCursoData({ ...cursoData, imagen: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Structure Card */}
                <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Layout size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Plan de Estudios</h2>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddModulo}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                            Añadir Módulo
                        </button>
                    </div>

                    <div className="space-y-4">
                        {cursoData.contenido?.map((mod, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 font-black text-xs flex items-center justify-center shrink-0">
                                    {idx + 1}
                                </div>
                                <input
                                    type="text"
                                    className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/50 transition-all outline-none"
                                    value={mod.modulo}
                                    onChange={(e) => handleModuloChange(idx, e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveModulo(idx)}
                                    className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Minus size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-grow py-5 bg-indigo-600 text-white rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save size={20} />
                        )}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button
                        type="button"
                        className="px-10 py-5 bg-white border border-slate-200 text-slate-400 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
                        onClick={() => router.push('/profesor/cursos')}
                    >
                        Salir
                    </button>
                </div>
            </form>
        </div>
    );
}
