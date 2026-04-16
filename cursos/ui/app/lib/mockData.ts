// ============================================
// DATOS MOCKEADOS para la Landing Page
// ============================================
// Usados mientras no hay datos reales del backend

import { Curso, Testimonio, FAQ } from './types';

// ============================================
// CURSO DE EJEMPLO
// ============================================
export const cursoMock: Curso = {
    _id: 'curso-demo-001',
    titulo: 'Desarrollo Web Full Stack con JavaScript',
    descripcion: `Domina el desarrollo web moderno de principio a fin. Este curso integral te llevará desde los fundamentos hasta la construcción de aplicaciones web completas y profesionales.

Aprenderás HTML5, CSS3, JavaScript ES6+, React.js, Node.js, Express y MongoDB. Al finalizar, serás capaz de crear aplicaciones web full stack, desde el diseño de la interfaz hasta la implementación del servidor y la base de datos.

El curso incluye proyectos prácticos del mundo real, código fuente descargable, y acceso a una comunidad exclusiva de desarrolladores donde podrás resolver tus dudas y hacer networking.`,
    descripcionCorta: 'Conviértete en desarrollador Full Stack dominando JavaScript, React, Node.js y MongoDB. Crea aplicaciones web profesionales desde cero.',
    precio: 97,
    imagen: '/hero-image.png',
    duracion: '40+ horas de contenido',
    nivel: 'Principiante',
    contenido: [
        {
            modulo: 'Fundamentos del Desarrollo Web',
            temas: [
                'Introducción al desarrollo web moderno',
                'HTML5 semántico y accesibilidad',
                'CSS3 avanzado: Flexbox y Grid',
                'Diseño responsive y mobile-first',
            ],
        },
        {
            modulo: 'JavaScript Moderno (ES6+)',
            temas: [
                'Variables, tipos de datos y operadores',
                'Funciones, arrays y objetos',
                'Async/Await y Promesas',
                'DOM manipulation y eventos',
                'Módulos y programación modular',
            ],
        },
        {
            modulo: 'React.js - Frontend Moderno',
            temas: [
                'Componentes y props',
                'Estado y hooks (useState, useEffect)',
                'Context API y manejo de estado global',
                'React Router para navegación',
                'Consumo de APIs REST',
            ],
        },
        {
            modulo: 'Node.js y Express - Backend',
            temas: [
                'Introducción a Node.js',
                'Creación de APIs REST con Express',
                'Middleware y manejo de errores',
                'Autenticación con JWT',
                'Validación de datos',
            ],
        },
        {
            modulo: 'MongoDB - Base de Datos',
            temas: [
                'Fundamentos de bases de datos NoSQL',
                'Mongoose: ODM para MongoDB',
                'CRUD operations',
                'Relaciones entre documentos',
                'Indexación y optimización',
            ],
        },
        {
            modulo: 'Proyecto Final Integrador',
            temas: [
                'Planificación y arquitectura del proyecto',
                'Desarrollo del backend completo',
                'Desarrollo del frontend con React',
                'Integración y testing',
                'Deployment a producción',
            ],
        },
    ],
    destacado: true,
    activo: true,
    inscriptos: 2847,
    profesor: '6789abcdef0123456789abcd', // Mock ID
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-20T00:00:00.000Z',
};

// ============================================
// TESTIMONIOS
// ============================================
export const testimoniosMock: Testimonio[] = [
    {
        _id: '1',
        nombre: 'María González',
        avatar: 'MG',
        cargo: 'Desarrolladora Frontend en TechCorp',
        comentario: 'Este curso cambió mi carrera por completo. Pasé de no saber programar a conseguir mi primer trabajo como desarrolladora en solo 4 meses. El contenido es claro, práctico y actualizado.',
        rating: 5,
    },
    {
        _id: '2',
        nombre: 'Carlos Rodríguez',
        avatar: 'CR',
        cargo: 'Freelancer Full Stack',
        comentario: 'La mejor inversión que he hecho en mi educación. Ahora trabajo como freelancer y facturo más del triple de lo que ganaba en mi empleo anterior. Los proyectos prácticos son increíbles.',
        rating: 5,
    },
    {
        _id: '3',
        nombre: 'Ana Martínez',
        avatar: 'AM',
        cargo: 'Tech Lead en StartupX',
        comentario: 'Recomiendo este curso a todo mi equipo. La explicación de los conceptos es excepcional y los ejemplos del mundo real hacen que todo sea fácil de entender y aplicar.',
        rating: 5,
    },
    {
        _id: '4',
        nombre: 'Luis Hernández',
        avatar: 'LH',
        cargo: 'Estudiante de Ingeniería',
        comentario: 'Como estudiante, este curso complementó perfectamente mi formación universitaria. Aprendí habilidades prácticas que no enseñan en la universidad.',
        rating: 5,
    },
];

// ============================================
// PREGUNTAS FRECUENTES
// ============================================
export const faqsMock: FAQ[] = [
    {
        id: '1',
        pregunta: '¿Necesito experiencia previa en programación?',
        respuesta: 'No, este curso está diseñado para principiantes absolutos. Empezamos desde cero y avanzamos gradualmente. Solo necesitas una computadora y ganas de aprender.',
    },
    {
        id: '2',
        pregunta: '¿Por cuánto tiempo tendré acceso al curso?',
        respuesta: 'Tendrás acceso de por vida al curso y a todas las actualizaciones futuras. Una vez que compras, el contenido es tuyo para siempre.',
    },
    {
        id: '3',
        pregunta: '¿Hay garantía de devolución?',
        respuesta: 'Sí, ofrecemos una garantía de satisfacción de 30 días. Si el curso no cumple tus expectativas, te devolvemos el 100% de tu dinero, sin preguntas.',
    },
    {
        id: '4',
        pregunta: '¿Recibiré un certificado al completar el curso?',
        respuesta: 'Sí, al completar el curso recibirás un certificado digital que podrás agregar a tu LinkedIn y currículum vitae.',
    },
    {
        id: '5',
        pregunta: '¿Puedo ver el curso en mi celular o tablet?',
        respuesta: 'Absolutamente. La plataforma es 100% responsive y puedes acceder desde cualquier dispositivo: computadora, tablet o celular.',
    },
    {
        id: '6',
        pregunta: '¿Hay soporte si tengo dudas?',
        respuesta: 'Sí, tienes acceso a nuestra comunidad exclusiva donde puedes hacer preguntas y recibir ayuda tanto del instructor como de otros estudiantes.',
    },
    {
        id: '7',
        pregunta: '¿Qué métodos de pago aceptan?',
        respuesta: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal, MercadoPago y transferencia bancaria.',
    },
    {
        id: '8',
        pregunta: '¿Cuánto tiempo necesito dedicar por semana?',
        respuesta: 'Recomendamos dedicar al menos 5-10 horas por semana para un aprendizaje óptimo. Sin embargo, al tener acceso de por vida, puedes ir a tu propio ritmo.',
    },
];

// ============================================
// BENEFICIOS DEL CURSO
// ============================================
export const beneficiosMock = [
    {
        icono: '🎥',
        titulo: '40+ horas de video',
        descripcion: 'Contenido HD actualizado regularmente',
    },
    {
        icono: '💻',
        titulo: 'Proyectos prácticos',
        descripcion: '5 proyectos del mundo real para tu portafolio',
    },
    {
        icono: '📱',
        titulo: 'Acceso multiplataforma',
        descripcion: 'Aprende desde cualquier dispositivo',
    },
    {
        icono: '🏆',
        titulo: 'Certificado incluido',
        descripcion: 'Certificación al completar el curso',
    },
    {
        icono: '♾️',
        titulo: 'Acceso de por vida',
        descripcion: 'Incluye todas las actualizaciones futuras',
    },
    {
        icono: '👥',
        titulo: 'Comunidad exclusiva',
        descripcion: 'Acceso a grupo privado de estudiantes',
    },
];

// ============================================
// GARANTÍAS
// ============================================
export const garantiasMock = [
    {
        icono: '🔒',
        titulo: 'Pago 100% Seguro',
        descripcion: 'Datos encriptados con SSL',
    },
    {
        icono: '💯',
        titulo: 'Garantía 30 días',
        descripcion: 'Devolución sin preguntas',
    },
    {
        icono: '⚡',
        titulo: 'Acceso Inmediato',
        descripcion: 'Empieza a aprender hoy mismo',
    },
];
