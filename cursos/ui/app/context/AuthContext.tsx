'use client';

// ============================================
// CONTEXTO DE AUTENTICACIÓN
// ============================================
// Maneja el estado global de autenticación del usuario

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Usuario } from '../lib/types';
import { getMe, guardarToken, eliminarToken, login as apiLogin, registro as apiRegistro } from '../lib/api';

// Tipo del contexto
interface AuthContextType {
    usuario: Usuario | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    registro: (nombre: string, email: string, password: string) => Promise<boolean>;
    updateFoto: (foto: string | File) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ... (checkAuth, useEffect, login, registro functions remain the same)

    // Verificar si hay sesión activa al cargar
    const checkAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await getMe();
            if (response.success && response.data) {
                setUsuario(response.data);
            } else {
                eliminarToken();
            }
        } catch {
            eliminarToken();
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Función de login
    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiLogin(email, password);
            if (response.success && response.token) {
                guardarToken(response.token);
                await checkAuth();
                return true;
            } else {
                setError(response.message || 'Error al iniciar sesión');
                return false;
            }
        } catch {
            setError('Error de conexión. Intenta de nuevo.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Función de registro
    const registro = async (nombre: string, email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiRegistro(nombre, email, password);
            if (response.success && response.token) {
                guardarToken(response.token);
                await checkAuth();
                return true;
            } else {
                setError(response.message || 'Error al registrarse');
                return false;
            }
        } catch {
            setError('Error de conexión. Intenta de nuevo.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Función de logout
    const logout = () => {
        eliminarToken();
        setUsuario(null);
        setError(null);
    };

    // Actualizar foto de perfil
    const updateFoto = async (foto: string | File): Promise<boolean> => {
        try {
            const { updateProfilePhoto } = await import('../lib/api');
            const response = await updateProfilePhoto(foto);
            if (response.success && response.data) {
                setUsuario(response.data);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error al actualizar foto:', err);
            return false;
        }
    };

    // Limpiar error
    const clearError = () => setError(null);

    const value: AuthContextType = {
        usuario,
        loading,
        error,
        isAuthenticated: !!usuario,
        login,
        registro,
        updateFoto,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar el contexto
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}
