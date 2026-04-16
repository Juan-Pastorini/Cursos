// ============================================
// RUTAS: Autenticación
// ============================================
// Este archivo define las rutas relacionadas con autenticación
// (registro, login, obtener perfil)

const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador
const { registro, login, getMe, actualizarFoto } = require('../controllers/authController');

// Importamos los middlewares
const { proteger } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ============================================
// RUTAS PÚBLICAS (no requieren autenticación)
// ============================================

// POST /api/auth/registro - Registrar un nuevo usuario
router.post('/registro', registro);

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', proteger, getMe);

// PUT /api/auth/updatefoto - Actualizar foto de perfil (con archivo local)
router.put('/updatefoto', proteger, upload.single('foto'), actualizarFoto);

// GET /api/auth/usuarios - Obtener todos los usuarios (Solo Admin)
const { autorizarRol } = require('../middleware/auth');
const { getUsuarios, deleteUsuario, actualizarRol } = require('../controllers/authController');
router.get('/usuarios', proteger, autorizarRol('admin'), getUsuarios);
router.delete('/usuarios/:id', proteger, autorizarRol('admin'), deleteUsuario);
router.put('/usuarios/:id/rol', proteger, autorizarRol('admin'), actualizarRol);

// Exportamos el router
module.exports = router;

