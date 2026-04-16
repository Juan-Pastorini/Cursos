'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    BookOpen,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    MonitorPlay
} from 'lucide-react';

export default function ProfesorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { usuario, loading, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading && (!isAuthenticated || (usuario?.rol !== 'profesor' && usuario?.rol !== 'admin'))) {
            router.push('/login');
        }
    }, [usuario, loading, isAuthenticated, router]);

    if (loading || !usuario || (usuario.rol !== 'profesor' && usuario.rol !== 'admin')) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const menuItems = [
        { title: 'Panel Profesor', icon: LayoutDashboard, href: '/profesor' },
        { title: 'Mis Cursos', icon: BookOpen, href: '/profesor/cursos' },
        { title: 'Gestión de Clases', icon: MonitorPlay, href: '/profesor/clases' },
        { title: 'Tutorías', icon: MessageSquare, href: '/profesor/tutorias' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } transition-all duration-300 ease-in-out bg-white border-r border-slate-200 flex flex-col z-50`}
            >
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tighter">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform">P</div>
                        {isSidebarOpen && <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900">Profesor</span>}
                    </Link>
                </div>

                <nav className="flex-grow px-3 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                                {isSidebarOpen && <span className="font-medium">{item.title}</span>}
                                {isActive && isSidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-3 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl group"
                    >
                        <LogOut size={20} className="group-hover:text-red-500" />
                        {isSidebarOpen && <span className="font-medium">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col h-screen overflow-y-auto">
                {/* Top Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold leading-none">{usuario.nombre}</p>
                                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mt-1">Profesor</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 overflow-hidden relative">
                                {usuario.foto ? (
                                    <Image src={usuario.foto} alt={usuario.nombre} fill className="object-cover" />
                                ) : (
                                    usuario.nombre.substring(0, 2).toUpperCase()
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
