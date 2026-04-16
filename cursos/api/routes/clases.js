const express = require('express');
const {
    getClasesByCurso,
    createClase,
    updateClase,
    deleteClase
} = require('../controllers/claseController');

const router = express.Router();

// Middleware de autenticación (asumiendo que existe uno llamado proteger)
const { proteger, autorizarRol } = require('../middleware/auth');

router.use(proteger); // Todas las rutas de clases requieren login

router.get('/curso/:cursoId', getClasesByCurso);

router.post('/', autorizarRol('profesor', 'admin'), createClase);
router.put('/:id', autorizarRol('profesor', 'admin'), updateClase);
router.delete('/:id', autorizarRol('profesor', 'admin'), deleteClase);

module.exports = router;
