// ============================================
// MODELO: Usuario
// ============================================
// Este archivo define la estructura de los usuarios en MongoDB
// Incluye validaciones, encriptación de contraseñas y métodos útiles

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ============================================
// ESQUEMA DEL USUARIO
// ============================================
// Definimos qué campos tendrá cada usuario y sus reglas

const usuarioSchema = new mongoose.Schema({
  // Campo: Nombre del usuario
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true  // Elimina espacios al inicio y final
  },

  // Campo: Email (debe ser único)
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,      // No puede haber dos usuarios con el mismo email
    lowercase: true,   // Convierte a minúsculas automáticamente
    trim: true,
    // Validación con expresión regular para verificar formato de email
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
  },

  // Campo: Contraseña (se encriptará antes de guardar)
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false  // No devolver password en queries por seguridad
  },

  // Campo: Rol del usuario (usuario normal, profesor o administrador)
  rol: {
    type: String,
    enum: ['usuario', 'profesor', 'admin'],  // Solo puede ser uno de estos valores
    default: 'usuario'            // Por defecto es usuario normal
  },

  // Campo: Foto de perfil
  foto: {
    type: String,
    default: null  // Cambiado a null para evitar dependencias de archivos inexistentes
  },

  // Campo: Biografía del usuario
  biografia: {
    type: String,
    maxlength: [500, 'La biografía no puede exceder 500 caracteres'],
    default: ''
  },

  // Campo: Redes sociales (para profesores)
  redesSociales: {
    linkedin: String,
    github: String,
    twitter: String
  },

  // Campo: Cursos que ha comprado el usuario (estudiante)
  cursosComprados: [{
    curso: {
      type: mongoose.Schema.Types.ObjectId,  // Referencia al modelo Curso
      ref: 'Curso'
    },
    fechaCompra: {
      type: Date,
      default: Date.now  // Fecha actual por defecto
    }
  }],

  // Campo: Cursos que imparte el usuario (profesor)
  cursosImpartidos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso'
  }]
}, {
  // Opciones del esquema
  timestamps: true  // Agrega automáticamente createdAt y updatedAt
});

// ============================================
// MIDDLEWARE: Encriptar contraseña
// ============================================
// Este código se ejecuta ANTES de guardar un usuario
// Encripta la contraseña para que no se guarde en texto plano

usuarioSchema.pre('save', async function (next) {
  // Solo encriptamos si la contraseña fue modificada
  if (!this.isModified('password')) {
    return next();
  }

  // Generamos un "salt" (dato aleatorio para hacer la encriptación más segura)
  const salt = await bcrypt.genSalt(10);

  // Encriptamos la contraseña
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// ============================================
// MÉTODO: Comparar contraseñas
// ============================================
// Este método nos permite verificar si una contraseña es correcta
// Útil para el login

usuarioSchema.methods.compararPassword = async function (passwordIngresado) {
  // bcrypt.compare compara la contraseña ingresada con la encriptada
  return await bcrypt.compare(passwordIngresado, this.password);
};

// Exportamos el modelo para usarlo en otros archivos
module.exports = mongoose.model('Usuario', usuarioSchema);

