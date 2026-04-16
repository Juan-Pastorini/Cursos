// ============================================
// RUTAS: Cursos
// ============================================
// Este archivo define las rutas para gestionar cursos

const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador
const {
  getCursos,
  getCurso,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  getCursosDestacados
} = require('../controllers/cursoController');

// Importamos los middlewares de autenticación
const { proteger, autorizarRol } = require('../middleware/auth');

// ============================================
// RUTAS PÚBLICAS (cualquiera puede acceder)
// ============================================

// GET /api/cursos - Obtener todos los cursos activos
router.get('/', getCursos);

// GET /api/cursos/destacados - Obtener cursos destacados
router.get('/destacados', getCursosDestacados);

// GET /api/cursos/:id - Obtener un curso específico por ID
router.get('/:id', getCurso);

// ============================================
// RUTAS PROTEGIDAS (solo administradores)
// ============================================

// POST /api/cursos - Crear un nuevo curso
router.post('/', proteger, autorizarRol('admin', 'profesor'), crearCurso);

// PUT /api/cursos/:id - Actualizar un curso existente
router.put('/:id', proteger, autorizarRol('admin', 'profesor'), actualizarCurso);

// DELETE /api/cursos/:id - Eliminar un curso (soft delete)
router.delete('/:id', proteger, autorizarRol('admin', 'profesor'), eliminarCurso);

// Exportamos el router
module.exports = router;

