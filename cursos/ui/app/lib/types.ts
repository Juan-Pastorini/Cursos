// ============================================
// TIPOS TypeScript para la aplicación
// ============================================

// Tipo para los módulos del curso
export interface ModuloCurso {
    modulo: string;
    temas: string[];
}

// Tipo para el curso
export interface Curso {
    _id: string;
    titulo: string;
    descripcion: string;
    descripcionCorta: string;
    precio: number;
    imagen: string;
    duracion: string;
    nivel: 'Principiante' | 'Intermedio' | 'Avanzado';
    contenido: ModuloCurso[];
    destacado: boolean;
    activo: boolean;
    inscriptos: number;
    profesor: string | Usuario;
    createdAt: string;
    updatedAt: string;
}

// Tipo para el usuario
export interface Usuario {
    _id: string;
    nombre: string;
    email: string;
    rol: 'usuario' | 'profesor' | 'admin';
    foto?: string;
    biografia?: string;
    redesSociales?: {
        linkedin?: string;
        github?: string;
        twitter?: string;
    };
    cursosComprados: {
        curso: Curso;
        fechaCompra: string;
    }[];
    cursosImpartidos?: (string | Curso)[];
    createdAt: string;
    updatedAt: string;
}

// Tipo para la Clase (Multimedia)
export interface Clase {
    _id: string;
    titulo: string;
    descripcion: string;
    curso: string | Curso;
    orden: number;
    contenidoMultimedia: {
        videoUrl?: string;
        materialDescargable: {
            nombre: string;
            url: string;
        }[];
        cuerpoDoc?: string;
    };
    esGratuita: boolean;
    activo: boolean;
}

// Tipo para la Tutoría
export interface Tutoria {
    _id: string;
    titulo: string;
    estudiante: string | Usuario;
    profesor: string | Usuario;
    curso?: string | Curso;
    fechaProgramada: string;
    duracion: number;
    linkReunion?: string;
    estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
    notasSeguimiento?: string;
    createdAt: string;
}

// Tipo para la compra
export interface Compra {
    _id: string;
    usuario: string | Usuario;
    curso: string | Curso;
    precioCompra: number;
    metodoPago: 'tarjeta' | 'paypal' | 'transferencia' | 'mercadopago';
    estadoPago: 'pendiente' | 'completado' | 'rechazado' | 'reembolsado';
    transaccionId: string;
    datosFacturacion: {
        nombreCompleto: string;
        email: string;
        pais: string;
    };
    createdAt: string;
    updatedAt: string;
}

// Tipo para la respuesta de autenticación
export interface AuthResponse {
    success: boolean;
    token: string;
    usuario?: Usuario;
    message?: string;
}

// Tipo para respuesta de API genérica
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Tipo para los testimonios (mockeados)
// Tipo para los testimonios
export interface Testimonio {
    _id: string;
    nombre: string;
    avatar?: string;
    cargo?: string;
    comentario: string;
    rating: number;
    createdAt?: string;
}

// Tipo para las FAQs
export interface FAQ {
    id: string;
    pregunta: string;
    respuesta: string;
}

// Tipo para datos del formulario de registro
export interface RegistroFormData {
    nombre: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Tipo para datos del formulario de login
export interface LoginFormData {
    email: string;
    password: string;
}

// Tipo para datos de facturación
export interface DatosFacturacion {
    nombreCompleto: string;
    email: string;
    pais: string;
}

// Tipo para los mensajes del chat
export interface Mensaje {
    _id: string;
    curso: string;
    usuario: {
        _id: string;
        nombre: string;
        foto?: string;
        rol: string;
    };
    texto: string;
    fecha: string;
    createdAt: string;
}

// Estado del carrito/checkout
export interface CheckoutState {
    cursoId: string | null;
    metodoPago: Compra['metodoPago'] | null;
    datosFacturacion: DatosFacturacion | null;
    procesando: boolean;
    error: string | null;
}
