// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================
// Este archivo contiene funciones para proteger rutas
// y verificar que el usuario tenga los permisos necesarios

const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// ============================================
// MIDDLEWARE: Proteger Rutas
// ============================================
// Esta función verifica que el usuario esté autenticado
// Busca el token JWT en los headers de la petición

exports.proteger = async (req, res, next) => {
  let token;

  // PASO 1: Extraer el token del header Authorization
  // El header viene en formato: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Separamos "Bearer" del token y nos quedamos solo con el token
    token = req.headers.authorization.split(' ')[1];
  }

  // PASO 2: Verificar que el token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - No se proporcionó token'
    });
  }

  try {
    // PASO 3: Verificar que el token es válido
    // jwt.verify() decodifica el token y verifica que no haya sido modificado
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // PASO 4: Buscar el usuario en la base de datos
    // El token contiene el ID del usuario en decoded.id
    req.usuario = await Usuario.findById(decoded.id);

    // PASO 5: Verificar que el usuario existe
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // PASO 6: Todo está bien, continuar a la siguiente función
    next();
  } catch (error) {
    // Si el token es inválido o expiró, rechazamos la petición
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// ============================================
// MIDDLEWARE: Autorizar por Rol
// ============================================
// Esta función verifica que el usuario tenga el rol correcto
// Por ejemplo, solo los admins pueden crear cursos

exports.autorizarRol = (...roles) => {
  // Retornamos una función middleware
  return (req, res, next) => {
    // Verificamos si el rol del usuario está en la lista de roles permitidos
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: `El rol '${req.usuario.rol}' no tiene permiso para esta acción`
      });
    }

    // El usuario tiene el rol correcto, continuar
    next();
  };
};

