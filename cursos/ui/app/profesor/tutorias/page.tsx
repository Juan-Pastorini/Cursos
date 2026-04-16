'use client';

import React, { useEffect, useState } from 'react';
import {
    MessageSquare,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Video
} from 'lucide-react';
import { getTutorias, updateTutoria } from '../../lib/api';
import { Tutoria } from '../../lib/types';

export default function GestionTutorias() {
    const [tutorias, setTutorias] = useState<Tutoria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorias = async () => {
            const res = await getTutorias();
            if (res.success && res.data) {
                setTutorias(res.data);
            }
            setLoading(false);
        };
        fetchTutorias();
    }, []);

    const handleStatusChange = async (id: string, nuevoEstado: Tutoria['estado']) => {
        const res = await updateTutoria(id, { estado: nuevoEstado });
        if (res.success) {
            setTutorias(prev => prev.map(t => t._id === id ? { ...t, estado: nuevoEstado } : t));
        } else {
            alert('Error al actualizar el estado');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Tutorías</h1>
                <p className="text-slate-500 mt-1 font-medium">Responde a solicitudes de asesoría personalizada de tus alumnos.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-slate-100 h-24 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : tutorias.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {tutorias.map(tutoria => (
                        <div key={tutoria._id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-5 w-full md:w-auto">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                                    tutoria.estado === 'completada' ? 'bg-emerald-500' : 
                                    tutoria.estado === 'pendiente' ? 'bg-amber-500 shadow-lg shadow-amber-100' : 
                                    'bg-indigo-500 shadow-lg shadow-indigo-100'
                                }`}>
                                    <MessageSquare size={24} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-slate-900 truncate">
                                            {typeof tutoria.estudiante === 'string' ? 'Estudiante' : tutoria.estudiante.nombre}
                                        </h3>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest ${
                                            tutoria.estado === 'pendiente' ? 'bg-amber-50 text-amber-600' : 
                                            tutoria.estado === 'confirmada' ? 'bg-indigo-50 text-indigo-600' : 
                                            'bg-emerald-50 text-emerald-600'
                                        }`}>
                                            {tutoria.estado}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-0.5 italic">&quot;{tutoria.mensaje}&quot;</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                                            <Calendar size={12} /> {new Date(tutoria.fecha).toLocaleDateString()}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                                            <Clock size={12} /> {tutoria.hora}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                {tutoria.estado === 'pendiente' && (
                                    <>
                                        <button 
                                            onClick={() => handleStatusChange(tutoria._id, 'confirmada')}
                                            className="flex-grow md:flex-none px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={14} /> Confirmar
                                        </button>
                                        <button 
                                            onClick={() => handleStatusChange(tutoria._id, 'cancelada')}
                                            className="px-5 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all"
                                        >
                                            <XCircle size={14} />
                                        </button>
                                    </>
                                )}
                                {tutoria.estado === 'confirmada' && (
                                    <button 
                                        onClick={() => handleStatusChange(tutoria._id, 'completada')}
                                        className="flex-grow md:flex-none px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={14} /> Finalizar
                                    </button>
                                )}
                                {tutoria.linkMeeting && (
                                    <a 
                                        href={tutoria.linkMeeting}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"
                                    >
                                        <Video size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No tienes tutorías pendientes</h3>
                    <p className="text-slate-500 mt-2 font-medium">Cuando un alumno solicite una asesoría personalizada aparecerá aquí.</p>
                </div>
            )}
        </div>
    );
}
