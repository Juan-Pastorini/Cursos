// ============================================
// MODELO: Clase
// ============================================
// Este archivo define la estructura de las clases (lecciones) individuales
// Cada clase pertenece a un curso y puede tener contenido multimedia

const mongoose = require('mongoose');

const claseSchema = new mongoose.Schema({
    // Título de la clase (ej: "Introducción a React")
    titulo: {
        type: String,
        required: [true, 'El título de la clase es requerido'],
        trim: true
    },

    // Descripción o resumen de lo que se verá en la clase
    descripcion: {
        type: String,
        trim: true
    },

    // Referencia al curso al que pertenece
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso',
        required: [true, 'La clase debe pertenecer a un curso']
    },

    // Orden de la clase dentro del curso
    orden: {
        type: Number,
        required: true,
        default: 0
    },

    // CONTENIDO MULTIMEDIA
    contenidoMultimedia: {
        // URL del video (YouTube, Vimeo, Cloudinary, etc.)
        videoUrl: {
            type: String,
            default: ''
        },
        // Archivos adjuntos (PDFs, ZIPs, etc.)
        materialDescargable: [{
            nombre: String,
            url: String
        }],
        // Texto largo (artículo de la clase)
        cuerpoDoc: {
            type: String,
            default: ''
        }
    },

    // Si la clase es gratuita (preview) o solo para inscritos
    esGratuita: {
        type: Boolean,
        default: false
    },

    // Estado de la clase
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Clase', claseSchema);
