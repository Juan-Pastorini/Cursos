'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    ChevronRight,
    Menu,
    X,
    Bell,
    Search
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { usuario, loading, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!loading && (!isAuthenticated || usuario?.rol !== 'admin')) {
            router.push('/login');
        }
    }, [usuario, loading, isAuthenticated, router]);

    if (loading || !usuario || usuario.rol !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const menuItems = [
        { title: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { title: 'Cursos', icon: BookOpen, href: '/admin/cursos' },
        { title: 'Usuarios', icon: Users, href: '/admin/usuarios' },
        { title: 'Mensajes', icon: MessageSquare, href: '/admin/mensajes' },
        { title: 'Configuración', icon: Settings, href: '/admin/configuracion' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } transition-all duration-300 ease-in-out bg-white border-r border-slate-200 flex flex-col z-50`}
            >
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs">AD</div>
                        {isSidebarOpen && <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">AdminPanel</span>}
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
                                    ? 'bg-violet-50 text-violet-600'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'} />
                                {isSidebarOpen && <span className="font-medium">{item.title}</span>}
                                {isActive && isSidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600" />}
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
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-slate-100 rounded-full text-slate-500">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-px bg-slate-200 mx-2" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold leading-none">{usuario.nombre}</p>
                                <p className="text-xs text-slate-500 capitalize">{usuario.rol}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-200 overflow-hidden relative">
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
