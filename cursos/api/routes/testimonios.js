const express = require('express');
const {
    getTestimonios,
    crearTestimonio,
    eliminarTestimonio
} = require('../controllers/testimonioController');

const router = express.Router();

const { proteger } = require('../middleware/auth');

router.get('/', getTestimonios);
router.post('/', proteger, crearTestimonio);
router.delete('/:id', proteger, eliminarTestimonio);

module.exports = router;
