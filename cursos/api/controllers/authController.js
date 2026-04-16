// ============================================
// CONTROLADOR: Autenticación
// ============================================
// Este archivo contiene la lógica de negocio para:
// - Registrar nuevos usuarios
// - Iniciar sesión
// - Obtener información del usuario actual

const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// ============================================
// FUNCIÓN AUXILIAR: Generar Token JWT
// ============================================
// JWT (JSON Web Token) es un token que identifica al usuario
// Lo usamos para mantener la sesión del usuario

const generarToken = (id) => {
  return jwt.sign(
    { id },                          // Datos que guardamos en el token (solo el ID)
    process.env.JWT_SECRET,          // Clave secreta para firmar el token
    { expiresIn: process.env.JWT_EXPIRE }  // Tiempo de expiración
  );
};

// ============================================
// ENDPOINT: Registrar nuevo usuario
// ============================================
// Ruta: POST /api/auth/registro
// Acceso: Público

exports.registro = async (req, res, next) => {
  try {
    // PASO 1: Obtener los datos del body de la petición
    const { nombre, email, password } = req.body;

    // PASO 2: Verificar si el email ya está registrado
    const usuarioExiste = await Usuario.findOne({ email });

    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está registrado'
      });
    }

    // PASO 3: Crear el nuevo usuario en la base de datos
    // La contraseña se encriptará automáticamente (ver modelo Usuario)
    const usuario = await Usuario.create({
      nombre,
      email,
      password
    });

    // PASO 4: Generar un token JWT para el usuario
    const token = generarToken(usuario._id);

    // PASO 5: Enviar respuesta exitosa con el token y datos del usuario
    res.status(201).json({
      success: true,
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        foto: usuario.foto
      }
    });
  } catch (error) {
    // Si hay un error, lo pasamos al middleware de manejo de errores
    next(error);
  }
};

// ============================================
// ENDPOINT: Iniciar sesión
// ============================================
// Ruta: POST /api/auth/login
// Acceso: Público

exports.login = async (req, res, next) => {
  try {
    // PASO 1: Obtener email y contraseña del body
    const { email, password } = req.body;

    // PASO 2: Validar que se enviaron ambos campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingresa email y contraseña'
      });
    }

    // PASO 3: Buscar el usuario por email
    // Usamos .select('+password') porque el password no se devuelve por defecto
    const usuario = await Usuario.findOne({ email }).select('+password');

    // PASO 4: Verificar que el usuario existe
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // PASO 5: Verificar que la contraseña es correcta
    // Usamos el método compararPassword del modelo Usuario
    const passwordCorrecto = await usuario.compararPassword(password);

    if (!passwordCorrecto) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // PASO 6: Generar token JWT
    const token = generarToken(usuario._id);

    // PASO 7: Enviar respuesta exitosa
    res.status(200).json({
      success: true,
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        foto: usuario.foto
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Obtener usuario actual
// ============================================
// Ruta: GET /api/auth/me
// Acceso: Privado (requiere token)

exports.getMe = async (req, res, next) => {
  try {
    // PASO 1: Buscar el usuario por ID
    // El ID viene de req.usuario (lo agregó el middleware 'proteger')
    // Usamos .populate() para traer también los datos de los cursos comprados
    const usuario = await Usuario.findById(req.usuario.id)
      .populate('cursosComprados.curso');

    // PASO 2: Enviar respuesta con los datos del usuario
    res.status(200).json({
      success: true,
      usuario
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Actualizar foto de perfil
// ============================================
// Ruta: PUT /api/auth/updatefoto
// Acceso: Privado (requiere token)

exports.actualizarFoto = async (req, res, next) => {
  try {
    // Si se subió un archivo, Multer lo pone en req.file
    // Si no, verificamos si viene una URL en el body (opcional, para mantener compatibilidad)
    let fotoUrl = null;

    if (req.file) {
      // Usamos la API_URL de las variables de entorno si existe
      // si no, construimos la URL dinámicamente
      const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
      fotoUrl = `${baseUrl}/uploads/${req.file.filename}`;
    } else if (req.body.foto) {
      fotoUrl = req.body.foto;
    }

    if (!fotoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Por favor sube una imagen o proporciona una URL'
      });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { foto: fotoUrl },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      usuario
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Obtener todos los usuarios
// ============================================
// Ruta: GET /api/auth/usuarios
// Acceso: Privado (solo admin)

exports.getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.status(200).json({
      success: true,
      usuarios
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Eliminar usuario
// ============================================
// Ruta: DELETE /api/auth/usuarios/:id
// Acceso: Privado (solo admin)

exports.deleteUsuario = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir que un admin se elimine a sí mismo
    if (usuario._id.toString() === req.usuario.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta de administrador'
      });
    }

    await usuario.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Actualizar Rol de Usuario
// ============================================
// Ruta: PUT /api/auth/usuarios/:id/rol
// Acceso: Privado (solo admin)

exports.actualizarRol = async (req, res, next) => {
  try {
    const { rol, cursosIds } = req.body;

    // Validar el rol
    if (!['usuario', 'profesor', 'admin'].includes(rol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol no válido'
      });
    }

    // Datos a actualizar
    const updateData = { rol };

    // Si es profesor, podemos asignar cursos
    if (rol === 'profesor' && cursosIds) {
      updateData.cursosImpartidos = cursosIds;
    } else if (rol !== 'profesor') {
      // Si deja de ser profesor, limpiamos sus cursos impartidos
      updateData.cursosImpartidos = [];
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Si es profesor, actualizar también los cursos para que apunten a este profesor
    if (rol === 'profesor' && cursosIds) {
      const Curso = require('../models/Curso');

      // Primero quitamos a este profesor de cualquier curso del que fuera profesor antes (si no está en la nueva lista)
      await Curso.updateMany(
        { profesor: usuario._id, _id: { $nin: cursosIds } },
        { $unset: { profesor: "" } }
      );

      // Luego lo asignamos a los nuevos cursos
      await Curso.updateMany(
        { _id: { $in: cursosIds } },
        { profesor: usuario._id }
      );
    }

    res.status(200).json({
      success: true,
      usuario
    });
  } catch (error) {
    next(error);
  }
};

