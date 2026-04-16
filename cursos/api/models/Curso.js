// ============================================
// MODELO: Curso
// ============================================
// Este archivo define la estructura de los cursos en MongoDB

const mongoose = require('mongoose');

// ============================================
// ESQUEMA DEL CURSO
// ============================================
// Definimos qué campos tendrá cada curso

const cursoSchema = new mongoose.Schema({
  // Campo: Título del curso
  titulo: {
    type: String,
    required: [true, 'El título del curso es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },

  // Campo: Descripción completa del curso
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },

  // Campo: Descripción breve para mostrar en tarjetas
  descripcionCorta: {
    type: String,
    required: [true, 'La descripción corta es requerida'],
    maxlength: [200, 'La descripción corta no puede exceder 200 caracteres']
  },

  // Campo: Precio del curso
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },

  // Campo: URL de la imagen del curso
  imagen: {
    type: String,
    default: 'default-curso.jpg'  // Imagen por defecto
  },

  // Campo: Duración del curso (ej: "4 semanas", "20 horas")
  duracion: {
    type: String,
    required: [true, 'La duración es requerida']
  },

  // Campo: Nivel de dificultad
  nivel: {
    type: String,
    enum: ['Principiante', 'Intermedio', 'Avanzado'],  // Solo estos valores
    default: 'Principiante'
  },

  // Campo: Contenido del curso (módulos y temas)
  contenido: [{
    modulo: String,      // Nombre del módulo
    temas: [String]      // Array de temas del módulo
  }],

  // Campo: Si el curso aparece en la sección destacados
  destacado: {
    type: Boolean,
    default: false
  },

  // Campo: Si el curso está activo (soft delete)
  activo: {
    type: Boolean,
    default: true
  },

  // Campo: Profesor del curso
  profesor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
    // Quitamos el required momentáneamente para no romper los cursos existentes
  },

  // Campo: Contador de estudiantes inscritos
  inscriptos: {
    type: Number,
    default: 0
  }
}, {
  // Opciones del esquema
  timestamps: true  // Agrega createdAt y updatedAt automáticamente
});

// Exportamos el modelo
module.exports = mongoose.model('Curso', cursoSchema);

