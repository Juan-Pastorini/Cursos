'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import {
    Save,
    X,
    Image as ImageIcon,
    Plus,
    Minus,
    BookOpen,
    Layout
} from 'lucide-react';
import { crearCurso } from '../../../lib/api';

export default function NuevoCurso() {
    const router = useRouter();
    const { usuario } = useAuth();
    const [loading, setLoading] = useState(false);
    
    const [cursoData, setCursoData] = useState({
        titulo: '',
        descripcion: '',
        precio: 0,
        nivel: 'Básico',
        imagen: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
        destacado: false,
        contenido: [
            { modulo: 'Módulo 1: Introducción', temas: [] }
        ]
    });

    const handleAddModulo = () => {
        setCursoData({
            ...cursoData,
            contenido: [...cursoData.contenido, { modulo: `Módulo ${cursoData.contenido.length + 1}`, temas: [] }]
        });
    };

    const handleRemoveModulo = (index: number) => {
        const nuevosModulos = [...cursoData.contenido];
        nuevosModulos.splice(index, 1);
        setCursoData({ ...cursoData, contenido: nuevosModulos });
    };

    const handleModuloChange = (index: number, value: string) => {
        const nuevosModulos = [...cursoData.contenido];
        nuevosModulos[index].modulo = value;
        setCursoData({ ...cursoData, contenido: nuevosModulos });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await crearCurso({
                ...cursoData,
                profesor: usuario?._id // En el backend se valida, pero lo enviamos por claridad
            });

            if (res.success) {
                alert('¡Curso creado con éxito!');
                router.push('/profesor/cursos');
            } else {
                alert(res.message || 'Error al crear el curso');
            }
        } catch (error) {
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Crear Nuevo Curso</h1>
                    <p className="text-slate-500 mt-1 font-medium">Diseña tu programa de estudios y lánzalo hoy.</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2"
                >
                    <X size={18} /> Cancelar
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                {/* Basic Info Card */}
                <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <BookOpen size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900">Información Básica</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título del Curso</label>
                            <input
                                required
                                type="text"
                                placeholder="Ej: Master en Desarrollo Web Fullstack"
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
                                placeholder="Describe de qué trata tu curso en un par de frases..."
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
                                min="0"
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
                                    value={cursoData.imagen}
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
                            <h2 className="text-xl font-black text-slate-900">Estructura del Programa</h2>
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
                        {cursoData.contenido.map((mod, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 font-black text-xs flex items-center justify-center shrink-0">
                                    {idx + 1}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nombre del módulo..."
                                    className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/50 transition-all outline-none"
                                    value={mod.modulo}
                                    onChange={(e) => handleModuloChange(idx, e.target.value)}
                                />
                                {cursoData.contenido.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveModulo(idx)}
                                        className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Minus size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 italic text-center">
                        * Podrás añadir las lecciones y temas individuales una vez creado el curso.
                    </p>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-indigo-600 text-white rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save size={20} />
                        )}
                        {loading ? 'Creando...' : 'Lanzar Curso'}
                    </button>
                </div>
            </form>
        </div>
    );
}
