// ============================================
// MODELO: Tutoria
// ============================================
// Gestiona las sesiones de tutoría entre estudiantes y profesores

const mongoose = require('mongoose');

const tutoriaSchema = new mongoose.Schema({
    // Título o motivo de la tutoría
    titulo: {
        type: String,
        required: [true, 'El título de la tutoría es requerido']
    },

    // Estudiante que solicita o participa
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El estudiante es requerido']
    },

    // Profesor que dicta la tutoría
    profesor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El profesor es requerido']
    },

    // Curso relacionado (opcional, para contexto)
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso'
    },

    // Fecha y hora programada
    fechaProgramada: {
        type: Date,
        required: [true, 'La fecha y hora son requeridas']
    },

    // Duración estimada en minutos
    duracion: {
        type: Number,
        default: 60
    },

    // Link de la reunión (Zoom, Meet, Teams, etc.)
    linkReunion: {
        type: String,
        default: ''
    },

    // Estado de la tutoría
    estado: {
        type: String,
        enum: ['pendiente', 'confirmada', 'completada', 'cancelada'],
        default: 'pendiente'
    },

    // Notas o seguimiento post-tutoría
    notasSeguimiento: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tutoria', tutoriaSchema);
