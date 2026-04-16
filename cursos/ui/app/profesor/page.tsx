'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import {
    BookOpen,
    Users,
    MonitorPlay,
    TrendingUp,
    MessageSquare,
    Plus,
    Clock,
    CheckCircle
} from 'lucide-react';
import { getCursos } from '../lib/api';
import { Curso } from '../lib/types';

export default function ProfesorDashboard() {
    const { usuario } = useAuth();
    const [misCursos, setMisCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchCursos = async () => {
            try {
                const res = await getCursos();
                if (isMounted && res.success && res.data) {
                    const impartidos = res.data.filter(c => {
                        const profId = typeof c.profesor === 'string' ? c.profesor : c.profesor?._id;
                        return profId === usuario?._id;
                    });
                    setMisCursos(impartidos);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchCursos();
        return () => { isMounted = false; };
    }, [usuario?._id]);

    const stats = [
        { title: 'Cursos Activos', value: misCursos.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Total Estudiantes', value: misCursos.reduce((acc, c) => acc + (c.inscriptos || 12), 0), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { title: 'Progreso Promedio', value: '84%', icon: MonitorPlay, color: 'text-violet-600', bg: 'bg-violet-50' },
        { title: 'Valoración Media', value: '4.9', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const nombreMostrado = usuario?.nombre ? usuario.nombre.split(' ')[0] : 'Docente';

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">¡Hola, Profe {nombreMostrado}! 👋</h1>
                <p className="text-slate-500 mt-1 font-medium">Aquí tienes un resumen de la actividad en tus cursos hoy.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.title}</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Courses List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Tus Cursos Impartidos</h2>
                        <Link href="/profesor/cursos" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
                            Ver todos
                        </Link>
                    </div>

                    {loading ? (
                        <div className="bg-white h-40 rounded-[2rem] border border-dashed border-slate-300 flex items-center justify-center italic text-slate-400">
                            Cargando tus cursos...
                        </div>
                    ) : misCursos.length > 0 ? (
                        <div className="space-y-4">
                            {misCursos.map(curso => (
                                <div key={curso._id} className="bg-white p-5 rounded-[2rem] border border-slate-200 flex items-center gap-5 hover:shadow-md transition-shadow">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100 relative bg-slate-100 flex items-center justify-center">
                                        {curso.imagen && (curso.imagen.startsWith('http') || curso.imagen.startsWith('/')) ? (
                                            <Image 
                                                src={curso.imagen} 
                                                alt={curso.titulo} 
                                                fill 
                                                className="object-cover" 
                                                sizes="64px"
                                                onError={(e) => {
                                                    // Si falla la carga, ocultar la imagen
                                                    const target = e.target as HTMLElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <BookOpen size={24} className="text-slate-300" />
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate">{curso.titulo}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md">
                                                {curso.nivel}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                <Users size={12} /> {curso.inscriptos || 0} alumnos
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/plataforma/${curso._id}`}
                                        className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 whitespace-nowrap"
                                    >
                                        Subir Contenido
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-10 rounded-[2rem] border border-dashed border-slate-300 text-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="font-bold text-slate-900">Aún no tienes cursos</h3>
                            <p className="text-slate-500 text-sm mt-1 mb-6">Empieza hoy mismo subiendo tu primer curso.</p>
                            <Link href="/profesor/cursos/nuevo" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                                <Plus size={18} /> Crear Curso
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">Actividad Reciente</h2>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <CheckCircle size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Nueva inscripción</p>
                                <p className="text-xs text-slate-500 mt-0.5">Juan Pérez se unió a un curso</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">Hace 5 minutos</p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-slate-400 opacity-60">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <Clock size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Sin más actividad</p>
                                <p className="text-xs mt-0.5">Te avisaremos cuando haya novedades.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-600 p-6 rounded-[2rem] text-white overflow-hidden relative group">
                        <div className="relative z-10">
                            <h3 className="font-black text-lg leading-tight">¿Necesitas ayuda con tus clases?</h3>
                            <p className="text-indigo-100 text-xs mt-2 font-medium">Revisa nuestra guía para profesores o contacta con soporte.</p>
                            <button className="mt-4 px-4 py-2 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20">
                                Ver Guía
                            </button>
                        </div>
                        <MessageSquare className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500/30 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}
