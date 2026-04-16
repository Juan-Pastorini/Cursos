// ============================================
// CLIENTE API - Comunicación con el backend
// ============================================

import { Curso, Usuario, Compra, AuthResponse, ApiResponse, Testimonio } from './types';

// URL base de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ============================================
// HELPER: Obtener headers de autenticación
// ============================================
function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// ============================================
// AUTENTICACIÓN
// ============================================

// Registrar un nuevo usuario
export async function registro(nombre: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
    });
    return res.json();
}

// Iniciar sesión
export async function login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}

// Obtener perfil del usuario actual
export async function getMe(): Promise<ApiResponse<Usuario>> {
    const res = await fetch(`${API_URL}/auth/me`, {
        headers: getAuthHeaders(),
    });
    const data = await res.json();
    return {
        success: data.success,
        data: data.usuario,
        message: data.message
    };
}

// Actualizar foto de perfil (acepta URL o Archivo)
export async function updateProfilePhoto(foto: string | File): Promise<ApiResponse<Usuario>> {
    const formData = new FormData();

    if (typeof foto === 'string') {
        formData.append('foto', foto);
    } else {
        formData.append('foto', foto);
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    // NOTA: Cuando usamos FormData, el navegador pone automáticamente el 'Content-Type': 'multipart/form-data'
    // con el boundary correcto. Si lo ponemos nosotros a mano, puede fallar.

    const res = await fetch(`${API_URL}/auth/updatefoto`, {
        method: 'PUT',
        headers: headers,
        body: formData,
    });
    const data = await res.json();
    return {
        success: data.success,
        data: data.usuario,
        message: data.message
    };
}

// Obtener todos los usuarios (Admin)
export async function getUsuarios(): Promise<ApiResponse<Usuario[]>> {
    const res = await fetch(`${API_URL}/auth/usuarios`, {
        headers: getAuthHeaders(),
    });
    const data = await res.json();
    return {
        success: data.success,
        data: data.usuarios,
        message: data.message || data.error
    };
}

// Eliminar un usuario (Admin)
export async function eliminarUsuario(id: string): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_URL}/auth/usuarios/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    const data = await res.json();
    return {
        success: data.success,
        message: data.message
    };
}

// Actualizar rol de usuario (Admin)
export async function actualizarUsuarioRol(id: string, rol: string, cursosIds?: string[]): Promise<ApiResponse<Usuario>> {
    const res = await fetch(`${API_URL}/auth/usuarios/${id}/rol`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rol, cursosIds }),
    });
    const data = await res.json();
    return {
        success: data.success,
        data: data.usuario,
        message: data.message
    };
}

// ============================================
// CURSOS
// ============================================

// Obtener todos los cursos
export async function getCursos(): Promise<ApiResponse<Curso[]>> {
    const res = await fetch(`${API_URL}/cursos`, {
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return {
        success: data.success,
        data: data.cursos,
        message: data.message
    };
}

// Obtener cursos destacados
export async function getCursosDestacados(): Promise<ApiResponse<Curso[]>> {
    const res = await fetch(`${API_URL}/cursos/destacados`, {
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return {
        success: data.success,
        data: data.cursos,
        message: data.message
    };
}

// Obtener un curso por ID
export async function getCurso(id: string): Promise<ApiResponse<Curso>> {
    const res = await fetch(`${API_URL}/cursos/${id}`, {
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return {
        success: data.success,
        data: data.curso,
        message: data.message
    };
}

// Crear un nuevo curso (Admin)
export async function crearCurso(cursoData: Partial<Curso>): Promise<ApiResponse<Curso>> {
    const res = await fetch(`${API_URL}/cursos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(cursoData),
    });
    const data = await res.json();
    return {
        success: data.success,
        data: data.curso,
        message: data.message
    };
}

// Actualizar un curso (Admin)
export async function actualizarCurso(id: string, cursoData: Partial<Curso>): Promise<ApiResponse<Curso>> {
    const res = await fetch(`${API_URL}/cursos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(cursoData),
    });
    const data = await res.json();
    return {
        success: data.success,
        data: data.curso,
        message: data.message
    };
}

// Eliminar un curso (Admin)
export async function eliminarCurso(id: string): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_URL}/cursos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    const data = await res.json();
    return {
        success: data.success,
        message: data.message
    };
}

// ============================================
// COMPRAS
// ============================================

// Crear una nueva compra
export async function crearCompra(
    cursoId: string,
    metodoPago: Compra['metodoPago'],
    datosFacturacion: Compra['datosFacturacion']
): Promise<ApiResponse<Compra>> {
    const res = await fetch(`${API_URL}/compras`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            cursoId,
            metodoPago,
            datosFacturacion,
        }),
    });
    const data = await res.json();
    return {
        success: data.success,
        data: data.compra,
        message: data.message
    };
}

// Obtener mis compras
export async function getMisCompras(): Promise<ApiResponse<Compra[]>> {
    const res = await fetch(`${API_URL}/compras/mis-compras`, {
        headers: getAuthHeaders(),
    });
    const data = await res.json();
    return {
        success: data.success,
        data: data.compras,
        message: data.message
    };
}

// ============================================
// CHAT / MENSAJES
// ============================================

import { Mensaje as MensajeType } from './types';

// Obtener mensajes de un curso
export async function getMensajes(cursoId: string): Promise<ApiResponse<MensajeType[]>> {
    try {
        const res = await fetch(`${API_URL}/mensajes/${cursoId}`, {
            headers: getAuthHeaders(),
        });
        const data = await res.json();
        return {
            success: data.success,
            data: data.data,
            message: data.message
        };
    } catch (error) {
        return { success: false, message: 'Error al conectar con el servidor' };
    }
}

// Enviar un mensaje
export async function enviarMensaje(cursoId: string, texto: string): Promise<ApiResponse<MensajeType>> {
    try {
        const res = await fetch(`${API_URL}/mensajes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ cursoId, texto }),
        });
        const data = await res.json();
        return {
            success: data.success,
            data: data.data,
            message: data.message
        };
    } catch (error) {
        return { success: false, message: 'Error al enviar el mensaje' };
    }
}

// ============================================
// CLASES (CONTENIDO MULTIMEDIA)
// ============================================

import { Clase as ClaseType } from './types';

// Obtener todas las clases de un curso
export async function getClasesByCurso(cursoId: string): Promise<ApiResponse<ClaseType[]>> {
    try {
        const res = await fetch(`${API_URL}/clases/curso/${cursoId}`, {
            headers: getAuthHeaders(),
        });
        const data = await res.json();
        return {
            success: data.success,
            data: data.data,
            message: data.message
        };
    } catch (error) {
        return { success: false, message: 'Error al obtener las clases' };
    }
}

// Crear una nueva clase
export async function crearClase(claseData: Partial<ClaseType>): Promise<ApiResponse<ClaseType>> {
    try {
        const res = await fetch(`${API_URL}/clases`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(claseData),
        });
        const data = await res.json();
        return {
            success: data.success,
            data: data.data,
            message: data.message
        };
    } catch (error) {
        return { success: false, message: 'Error al crear la clase' };
    }
}

// Actualizar una clase
export async function updateClase(id: string, claseData: Partial<ClaseType>): Promise<ApiResponse<ClaseType>> {
    try {
        const res = await fetch(`${API_URL}/clases/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(claseData),
        });
        const data = await res.json();
        return {
            success: data.success,
            data: data.data,
            message: data.message
        };
    } catch (error) {
        return { success: false, message: 'Error al actualizar la clase' };
    }
}

// Eliminar una clase
export async function eliminarClase(id: string): Promise<ApiResponse<void>> {
    try {
        const res = await fetch(`${API_URL}/clases/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await res.json();
        return {
            success: data.success,
            message: data.message
        };
    } catch (error) {
        return { success: false, message: 'Error al eliminar la clase' };
    }
}

// ============================================
// TUTORIAS
// ============================================

import { Tutoria as TutoriaType } from './types';

// Obtener todas las tutorías del usuario
export async function getTutorias(): Promise<ApiResponse<TutoriaType[]>> {
    try {
        const res = await fetch(`${API_URL}/tutorias`, {
            headers: getAuthHeaders(),
        });
        const data = await res.json();
        return {
            success: data.success,
            data: data.data,
            message: data.message
        };
    } catch (error) {
        return { success: false, message: 'Error al obtener las tutorías' };
    }
}

// Solicitar una tutoría
export async function solicitarTutoria(tutoriaData: Partial<TutoriaType>): Promise<ApiResponse<TutoriaType>> {
    try {
        const res = await fetch(`${API_URL}/tutorias`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(tutoriaData),
        });
        const data = await res.json();
        return {
            success: data.success,
            data: data.data,
            message: data.message
        };
    } catch (error) {
        return { success: false, message: 'Error al solicitar la tutoría' };
    }
}

// Actualizar una tutoría (profesor/admin)
export async function updateTutoria(id: string, tutoriaData: Partial<TutoriaType>): Promise<ApiResponse<TutoriaType>> {
    try {
        const res = await fetch(`${API_URL}/tutorias/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(tutoriaData),
        });
        const data = await res.json();
        return {
            success: data.success,
            data: data.data,
            message: data.message
        };
    } catch (error) {
        return { success: false, message: 'Error al actualizar la tutoría' };
    }
}

// ============================================
// TESTIMONIOS
// ============================================

export async function getTestimonios(): Promise<ApiResponse<Testimonio[]>> {
    try {
        const res = await fetch(`${API_URL}/testimonios`, {
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        return {
            success: data.success,
            data: data.data,
            message: data.message
        };
    } catch (error) {
        return { success: false, message: 'Error al obtener testimonios' };
    }
}

export async function crearTestimonio(comentario: string, rating: number): Promise<ApiResponse<Testimonio>> {
    try {
        const res = await fetch(`${API_URL}/testimonios`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ comentario, rating }),
        });
        const data = await res.json();
        return {
            success: data.success,
            data: data.data,
            message: data.message
        };
    } catch (error) {
        return { success: false, message: 'Error al enviar testimonio' };
    }
}

// ============================================
// HELPERS
// ============================================

// Guardar token en localStorage
export function guardarToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
}

// Eliminar token de localStorage
export function eliminarToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
}

// Verificar si hay un token guardado
export function hayToken(): boolean {
    if (typeof window !== 'undefined') {
        return !!localStorage.getItem('token');
    }
    return false;
}
