const express = require('express');
const {
    getTutorias,
    createTutoria,
    updateTutoria
} = require('../controllers/tutoriaController');

const router = express.Router();
const { proteger } = require('../middleware/auth');

router.use(proteger);

router.route('/')
    .get(getTutorias)
    .post(createTutoria);

router.route('/:id')
    .put(updateTutoria);

module.exports = router;
