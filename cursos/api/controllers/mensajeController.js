const Mensaje = require('../models/Mensaje');

// @desc    Obtener mensajes de un curso
// @route   GET /api/mensajes/:cursoId
// @access  Privado (Solo compradores del curso)
exports.getMensajes = async (req, res, next) => {
    try {
        const mensajes = await Mensaje.find({ curso: req.params.cursoId })
            .populate('usuario', 'nombre foto rol')
            .sort({ fecha: 1 }); // Orden cronológico

        res.status(200).json({
            success: true,
            data: mensajes
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Enviar un mensaje
// @route   POST /api/mensajes
// @access  Privado
exports.enviarMensaje = async (req, res, next) => {
    try {
        const { cursoId, texto } = req.body;

        const mensaje = await Mensaje.create({
            curso: cursoId,
            usuario: req.usuario.id,
            texto
        });

        const mensajePoblado = await Mensaje.findById(mensaje._id)
            .populate('usuario', 'nombre foto rol');

        res.status(201).json({
            success: true,
            data: mensajePoblado
        });
    } catch (error) {
        next(error);
    }
};
