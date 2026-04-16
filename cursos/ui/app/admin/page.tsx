'use client';

import React from 'react';
import {
    Users,
    BookOpen,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Calendar
} from 'lucide-react';

export default function AdminDashboard() {
    // Mock data for dashboard
    const stats = [
        { label: 'Estudiantes Totales', value: '1,284', icon: Users, change: '+12.5%', isPositive: true, color: 'bg-blue-500' },
        { label: 'Cursos Activos', value: '24', icon: BookOpen, change: '+2', isPositive: true, color: 'bg-violet-500' },
        { label: 'Ventas del Mes', value: '$12,850', icon: DollarSign, change: '+18.2%', isPositive: true, color: 'bg-emerald-500' },
        { label: 'Tasa de Conversión', value: '3.2%', icon: TrendingUp, change: '-0.4%', isPositive: false, color: 'bg-amber-500' },
    ];

    const recentActivities = [
        { user: 'Ana García', action: 'se inscribió en', target: 'React Avanzado', time: 'hace 2 horas', avatar: 'AG' },
        { user: 'Carlos Ruiz', action: 'completó el curso', target: 'Node.js Backend', time: 'hace 5 horas', avatar: 'CR' },
        { user: 'Marta López', action: 'dejó una reseña en', target: 'Diseño UI/UX', time: 'hace 8 horas', avatar: 'ML' },
        { user: 'Juan Pérez', action: 'se registró como profesor', target: 'Petición pendiente', time: 'hace 1 día', avatar: 'JP' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
                    <p className="text-slate-500">Bienvenido de nuevo. Aquí tienes un resumen de lo que está pasando hoy.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 shadow-sm">
                        <Calendar size={16} />
                        Septiembre 2024
                    </div>
                    <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-200">
                        Descargar Reporte
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-${stat.color.split('-')[1]}-600`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.change}
                                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart Mockup */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Ingresos Semanales</h3>
                            <p className="text-sm text-slate-500">Comparativa con la semana anterior</p>
                        </div>
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                            <MoreVertical size={20} />
                        </button>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-4">
                        {[45, 60, 40, 75, 50, 90, 70].map((height, i) => (
                            <div key={i} className="flex-grow group relative">
                                <div
                                    className="w-full bg-violet-100 group-hover:bg-violet-600 transition-all rounded-t-lg"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        ${(height * 120).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-2 text-center uppercase font-bold">
                                    {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">Actividad Reciente</h3>
                        <button className="text-sm text-violet-600 font-semibold hover:underline">Ver todo</button>
                    </div>

                    <div className="space-y-6">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                                    {activity.avatar}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm leading-snug">
                                        <span className="font-bold text-slate-900">{activity.user}</span>
                                        {' '}{activity.action}{' '}
                                        <span className="font-semibold text-violet-600">{activity.target}</span>
                                    </p>
                                    <span className="text-xs text-slate-400 mt-1">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
