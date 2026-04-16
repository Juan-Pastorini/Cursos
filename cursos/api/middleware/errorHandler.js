// ============================================
// MIDDLEWARE DE MANEJO DE ERRORES
// ============================================
// Este middleware captura todos los errores de la aplicación
// y los convierte en respuestas JSON consistentes

const errorHandler = (err, req, res, next) => {
  // Copiamos el error para no modificar el original
  let error = { ...err };
  error.message = err.message;

  // Mostramos el error en la consola para debugging
  console.log('❌ Error:', err);

  // TIPO 1: Error de ID inválido en MongoDB
  // Ejemplo: cuando buscamos un curso con ID "abc123" que no es válido
  if (err.name === 'CastError') {
    error.message = 'Recurso no encontrado - ID inválido';
    error.statusCode = 404;
  }

  // TIPO 2: Error de duplicado
  // Ejemplo: cuando intentamos registrar un email que ya existe
  if (err.code === 11000) {
    error.message = 'Este valor ya existe en la base de datos';
    error.statusCode = 400;
  }

  // TIPO 3: Error de validación
  // Ejemplo: cuando falta un campo requerido o tiene formato incorrecto
  if (err.name === 'ValidationError') {
    // Extraemos todos los mensajes de error de validación
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = messages.join(', ');
    error.statusCode = 400;
  }

  // Enviamos la respuesta de error al cliente
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error del servidor'
  });
};

// Exportamos el middleware
module.exports = errorHandler;

