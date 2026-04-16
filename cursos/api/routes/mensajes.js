const express = require('express');
const router = express.Router();
const { getMensajes, enviarMensaje } = require('../controllers/mensajeController');
const { proteger } = require('../middleware/auth');

// Todas las rutas de mensajes requieren autenticación
router.use(proteger);

router.get('/:cursoId', getMensajes);
router.post('/', enviarMensaje);

module.exports = router;
