// ============================================
// CONTROLADOR: Cursos
// ============================================
// Este archivo contiene la lógica de negocio para:
// - Listar cursos
// - Ver detalle de un curso
// - Crear, actualizar y eliminar cursos (solo admin)

const Curso = require('../models/Curso');

// ============================================
// ENDPOINT: Obtener todos los cursos
// ============================================
// Ruta: GET /api/cursos
// Acceso: Público

exports.getCursos = async (req, res, next) => {
  try {
    // PASO 1: Buscar todos los cursos activos en la base de datos
    const cursos = await Curso.find({ activo: true });

    // PASO 2: Enviar respuesta con los cursos encontrados
    res.status(200).json({
      success: true,
      count: cursos.length,  // Cantidad de cursos
      cursos
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Obtener un curso por ID
// ============================================
// Ruta: GET /api/cursos/:id
// Acceso: Público

exports.getCurso = async (req, res, next) => {
  try {
    // PASO 1: Buscar el curso por ID
    // El ID viene en los parámetros de la URL (req.params.id)
    const curso = await Curso.findById(req.params.id);

    // PASO 2: Verificar si el curso existe
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // PASO 3: Enviar respuesta con el curso encontrado
    res.status(200).json({
      success: true,
      curso
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Crear nuevo curso
// ============================================
// Ruta: POST /api/cursos
// Acceso: Privado (solo administradores)

exports.crearCurso = async (req, res, next) => {
  try {
    // Si el usuario es profesor, se asigna automáticamente como el profesor del curso
    if (req.usuario.rol === 'profesor') {
      req.body.profesor = req.usuario.id;
    }

    const curso = await Curso.create(req.body);

    res.status(201).json({
      success: true,
      curso
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Actualizar curso
// ============================================
// Ruta: PUT /api/cursos/:id
// Acceso: Privado (solo administradores)

exports.actualizarCurso = async (req, res, next) => {
  try {
    let curso = await Curso.findById(req.params.id);

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar propiedad si es profesor (los admins pueden todo)
    if (req.usuario.rol === 'profesor' && curso.profesor?.toString() !== req.usuario.id) {
      return res.status(401).json({
        success: false,
        message: 'No tienes permiso para actualizar este curso'
      });
    }

    curso = await Curso.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      curso
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Eliminar curso (soft delete)
// ============================================
// Ruta: DELETE /api/cursos/:id
// Acceso: Privado (solo administradores)
// Nota: No eliminamos el curso de la BD, solo lo marcamos como inactivo

exports.eliminarCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findById(req.params.id);

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar propiedad si es profesor
    if (req.usuario.rol === 'profesor' && curso.profesor?.toString() !== req.usuario.id) {
      return res.status(401).json({
        success: false,
        message: 'No tienes permiso para eliminar este curso'
      });
    }

    // Aplicar soft delete
    curso.activo = false;
    await curso.save();

    res.status(200).json({
      success: true,
      message: 'Curso eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Obtener cursos destacados
// ============================================
// Ruta: GET /api/cursos/destacados
// Acceso: Público

exports.getCursosDestacados = async (req, res, next) => {
  try {
    // PASO 1: Buscar cursos que estén destacados y activos
    const cursos = await Curso.find({
      destacado: true,
      activo: true
    });

    // PASO 2: Enviar respuesta con los cursos destacados
    res.status(200).json({
      success: true,
      count: cursos.length,
      cursos
    });
  } catch (error) {
    next(error);
  }
};

