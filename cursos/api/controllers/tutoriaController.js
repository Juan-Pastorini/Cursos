const Tutoria = require('../models/Tutoria');

// @desc    Obtener tutorias del usuario (como estudiante o profesor)
// @route   GET /api/tutorias
// @access  Privado
exports.getTutorias = async (req, res, next) => {
    try {
        const query = req.usuario.rol === 'profesor'
            ? { profesor: req.usuario.id }
            : { estudiante: req.usuario.id };

        const tutorias = await Tutoria.find(query)
            .populate('estudiante', 'nombre email')
            .populate('profesor', 'nombre email')
            .populate('curso', 'titulo')
            .sort('-fechaProgramada');

        res.status(200).json({
            success: true,
            data: tutorias
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Solicitar/Programar tutoría
// @route   POST /api/tutorias
// @access  Privado
exports.createTutoria = async (req, res, next) => {
    try {
        req.body.estudiante = req.usuario.id;
        const tutoria = await Tutoria.create(req.body);

        res.status(201).json({
            success: true,
            data: tutoria
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar estado de tutoría (confirmar, completar, cancelar)
// @route   PUT /api/tutorias/:id
// @access  Privado
exports.updateTutoria = async (req, res, next) => {
    try {
        let tutoria = await Tutoria.findById(req.params.id);

        if (!tutoria) {
            return res.status(404).json({ success: false, message: 'Tutoría no encontrada' });
        }

        // Solo el profesor o el estudiante involucrado pueden modificar
        if (tutoria.profesor.toString() !== req.usuario.id && tutoria.estudiante.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(401).json({ success: false, message: 'No autorizado' });
        }

        tutoria = await Tutoria.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: tutoria
        });
    } catch (error) {
        next(error);
    }
};
