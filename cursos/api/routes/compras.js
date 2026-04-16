// ============================================
// RUTAS: Compras
// ============================================
// Este archivo define las rutas para gestionar compras de cursos

const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador
const {
  crearCompra,
  getMisCompras,
  getCompras,
  actualizarCompra
} = require('../controllers/compraController');

// Importamos los middlewares de autenticación
const { proteger, autorizarRol } = require('../middleware/auth');

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

// POST /api/compras - Crear una nueva compra (cualquier usuario autenticado)
router.post('/', proteger, crearCompra);

// GET /api/compras/mis-compras - Ver mis propias compras
router.get('/mis-compras', proteger, getMisCompras);

// ============================================
// RUTAS DE ADMINISTRADOR
// ============================================

// GET /api/compras - Ver todas las compras (solo admin)
router.get('/', proteger, autorizarRol('admin'), getCompras);

// PUT /api/compras/:id - Actualizar estado de una compra (solo admin)
router.put('/:id', proteger, autorizarRol('admin'), actualizarCompra);

// Exportamos el router
module.exports = router;

