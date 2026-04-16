'use client';

import React, { useEffect, useState } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Mail,
    Shield,
    User as UserIcon,
    Filter,
    CheckCircle2,
    MoreVertical,
    X,
    UserPlus,
    Copy,
    Calendar,
    Key,
    UserCheck,
    AlertCircle,
    BookOpen,
    Check
} from 'lucide-react';
import { getUsuarios, actualizarUsuarioRol, eliminarUsuario, getCursos } from '../../lib/api';
import { Usuario, Curso } from '../../lib/types';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');

    // UI States
    const [userToEdit, setUserToEdit] = useState<Usuario | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);
    const [userToShowMore, setUserToShowMore] = useState<Usuario | null>(null);
    const [notificacion, setNotificacion] = useState<{ tipo: 'success' | 'error', mensaje: string } | null>(null);

    useEffect(() => {
        fetchUsers();
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        try {
            const response = await getCursos();
            if (response.success && response.data) {
                setCursos(response.data);
            }
        } catch (error) {
            console.error('Error al cargar cursos:', error);
        }
    };

    useEffect(() => {
        if (notificacion) {
            const timer = setTimeout(() => setNotificacion(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notificacion]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsuarios();
            if (response.success && response.data) {
                setUsuarios(response.data);
            } else {
                setNotificacion({ tipo: 'error', mensaje: response.message || 'Error al cargar usuarios' });
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            setNotificacion({ tipo: 'error', mensaje: 'Ocurrió un error al conectar con el servidor' });
        } finally {
            setLoading(false);
        }
    };

    const handleActualizarRol = async () => {
        if (!userToEdit) return;

        try {
            const response = await actualizarUsuarioRol(userToEdit._id, selectedRole, selectedRole === 'profesor' ? selectedCourses : []);
            if (response.success) {
                setUsuarios(prev => prev.map(u => u._id === userToEdit._id ? {
                    ...u,
                    rol: selectedRole as any,
                    cursosImpartidos: selectedRole === 'profesor' ? selectedCourses : []
                } : u));
                setNotificacion({ tipo: 'success', mensaje: 'Rol actualizado correctamente' });
                setUserToEdit(null);
            } else {
                setNotificacion({ tipo: 'error', mensaje: response.message || 'Error al actualizar rol' });
            }
        } catch (error) {
            setNotificacion({ tipo: 'error', mensaje: 'Ocurrió un error inesperado' });
        }
    };

    const toggleCourse = (id: string) => {
        setSelectedCourses(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleConfirmarEliminar = async () => {
        if (!userToDelete) return;

        try {
            const response = await eliminarUsuario(userToDelete._id);
            if (response.success) {
                setUsuarios(prev => prev.filter(u => u._id !== userToDelete._id));
                setNotificacion({ tipo: 'success', mensaje: 'Usuario eliminado correctamente' });
                setUserToDelete(null);
            } else {
                setNotificacion({ tipo: 'error', mensaje: response.message || 'Error al eliminar usuario' });
            }
        } catch (error) {
            setNotificacion({ tipo: 'error', mensaje: 'Ocurrió un error inesperado' });
        }
    };

    const copiarId = (id: string) => {
        navigator.clipboard.writeText(id);
        setNotificacion({ tipo: 'success', mensaje: 'ID copiado al portapapeles' });
    };

    const usuariosFiltrados = usuarios.filter(usuario => {
        const search = busqueda.toLowerCase();
        const nombre = (usuario.nombre || '').toLowerCase();
        const email = (usuario.email || '').toLowerCase();
        const rol = (usuario.rol || '').toLowerCase();

        return nombre.includes(search) || email.includes(search) || rol.includes(search);
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-slate-500 text-sm">Controla los accesos y roles de la plataforma. <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Total: {usuarios.length}</span></p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-200">
                    <Plus size={18} />
                    Invitar Usuario
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Filters bar */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o rol..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                            <Filter size={16} />
                            Filtrar por Rol
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Usuario</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Rol</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Cursos</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Fecha Registro</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">Cargando usuarios...</td>
                                </tr>
                            ) : usuariosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No se encontraron usuarios.</td>
                                </tr>
                            ) : (
                                usuariosFiltrados.map((usuario) => (
                                    <tr key={usuario._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shrink-0 relative">
                                                    {usuario.foto ? (
                                                        <Image src={usuario.foto} alt={usuario.nombre} fill className="object-cover" />
                                                    ) : (
                                                        <UserIcon size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{usuario.nombre}</p>
                                                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                                        <Mail size={12} />
                                                        {usuario.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {usuario.rol === 'admin' ? (
                                                    <span className="flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                                                        <Shield size={12} />
                                                        Admin
                                                    </span>
                                                ) : usuario.rol === 'profesor' ? (
                                                    <span className="flex items-center gap-1 px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold">
                                                        Profesor
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                                                        Estudiante
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-700">
                                                {usuario.rol === 'profesor' ? usuario.cursosImpartidos?.length : usuario.cursosComprados?.length || 0} cursos
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-500">
                                                {new Date(usuario.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setUserToEdit(usuario);
                                                        setSelectedRole(usuario.rol);
                                                        setSelectedCourses((usuario.cursosImpartidos || []).map(c => typeof c === 'string' ? c : c._id));
                                                    }}
                                                    className="p-2 hover:bg-violet-50 rounded-lg text-slate-400 hover:text-violet-600 transition-all"
                                                    title="Editar Rol"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setUserToDelete(usuario)}
                                                    className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setUserToShowMore(usuario)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                                                    title="Más acciones"
                                                >
                                                    <MoreVertical size={18} />
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

            {/* Notification Toast */}
            <AnimatePresence mode="wait">
                {notificacion && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 20, x: '-50%' }}
                        className={`fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${notificacion.tipo === 'success'
                            ? 'bg-white border-green-100 text-green-600'
                            : 'bg-white border-rose-100 text-rose-600'
                            }`}
                    >
                        {notificacion.tipo === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="font-bold text-sm tracking-tight">{notificacion.mensaje}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal: Editar Rol */}
            <AnimatePresence>
                {userToEdit && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-900">Cambiar Rol</h3>
                                <button onClick={() => setUserToEdit(null)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all"><X size={20} /></button>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-8 p-4 bg-violet-50 rounded-2xl border border-violet-100">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-violet-600 font-bold shadow-sm overflow-hidden relative">
                                        {userToEdit.foto ? <Image src={userToEdit.foto} fill alt={userToEdit.nombre} className="object-cover" /> : userToEdit.nombre.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-none">{userToEdit.nombre}</p>
                                        <p className="text-xs text-violet-600 font-medium mt-1 uppercase tracking-widest">Rol actual: {userToEdit.rol}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {['usuario', 'profesor', 'admin'].map((rol) => (
                                        <button
                                            key={rol}
                                            onClick={() => setSelectedRole(rol)}
                                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${selectedRole === rol
                                                ? 'border-violet-600 bg-violet-50 text-violet-600'
                                                : 'border-slate-100 hover:border-violet-200 hover:bg-slate-50 text-slate-600'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${selectedRole === rol ? 'bg-violet-600' : 'bg-slate-300 group-hover:bg-violet-400'}`} />
                                                <span className="font-bold capitalize">
                                                    {rol === 'usuario' ? 'Estudiante' : rol === 'profesor' ? 'Profesor' : 'Administrador'}
                                                </span>
                                            </div>
                                            {selectedRole === rol && <CheckCircle2 size={18} />}
                                        </button>
                                    ))}
                                </div>

                                {selectedRole === 'profesor' && (
                                    <div className="mt-8 space-y-4 animate-in slide-in-from-top-4 duration-300">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen size={16} className="text-violet-600" />
                                            <p className="text-sm font-bold text-slate-900">Asignar Cursos</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {cursos.map(curso => (
                                                <button
                                                    key={curso._id}
                                                    onClick={() => toggleCourse(curso._id)}
                                                    className={`p-3 rounded-xl border text-sm flex items-center justify-between transition-all ${selectedCourses.includes(curso._id)
                                                        ? 'bg-violet-50 border-violet-200 text-violet-700 font-medium'
                                                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <span className="truncate pr-4">{curso.titulo}</span>
                                                    {selectedCourses.includes(curso._id) && <Check size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-10">
                                    <button
                                        onClick={handleActualizarRol}
                                        disabled={selectedRole === userToEdit.rol && (selectedRole !== 'profesor' || JSON.stringify(selectedCourses) === JSON.stringify((userToEdit.cursosImpartidos || []).map(c => typeof c === 'string' ? c : c._id)))}
                                        className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold shadow-lg shadow-violet-200 transition-all active:scale-[0.98]"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: Confirmar Eliminar */}
            <AnimatePresence>
                {userToDelete && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden text-center p-8"
                        >
                            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">¿Eliminar Usuario?</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                Estás a punto de eliminar a <span className="font-bold text-slate-900">"{userToDelete.nombre}"</span>. Esta acción borrará todos sus datos y progresos permanentemente.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setUserToDelete(null)}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmarEliminar}
                                    className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200 transition-all active:scale-95"
                                >
                                    Sí, Eliminar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: Más Acciones */}
            <AnimatePresence>
                {userToShowMore && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-slate-900">
                                <h3 className="font-bold">Información de Usuario</h3>
                                <button onClick={() => setUserToShowMore(null)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all"><X size={20} /></button>
                            </div>
                            <div className="p-6 space-y-4 text-slate-900">
                                <button
                                    onClick={() => copiarId(userToShowMore._id)}
                                    className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center gap-4 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-violet-600 shadow-sm"><Copy size={18} /></div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-900">Copiar ID de Usuario</p>
                                        <p className="text-xs text-slate-500 font-mono mt-0.5">{userToShowMore._id}</p>
                                    </div>
                                </button>

                                <div className="w-full p-4 rounded-2xl bg-slate-50 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><Calendar size={18} /></div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-900">Fecha de Registro</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{new Date(userToShowMore.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setNotificacion({ tipo: 'success', mensaje: 'Instrucciones enviadas al email (Simulado)' });
                                        setUserToShowMore(null);
                                    }}
                                    className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center gap-4 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-amber-500 shadow-sm"><Key size={18} /></div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-900">Restablecer Contraseña</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Enviará un link de recuperación por email</p>
                                    </div>
                                </button>
                            </div>
                            <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
                                <button onClick={() => setUserToShowMore(null)} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-all">Cerrar</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
