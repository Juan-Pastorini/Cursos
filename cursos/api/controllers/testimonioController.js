const Testimonio = require('../models/Testimonio');

// @desc    Obtener todos los testimonios activos
// @route   GET /api/testimonios
// @access  Público
exports.getTestimonios = async (req, res, next) => {
    try {
        const testimonios = await Testimonio.find({ activo: true }).sort('-createdAt');
        res.status(200).json({
            success: true,
            count: testimonios.length,
            data: testimonios
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear un nuevo testimonio
// @route   POST /api/testimonios
// @access  Privado
exports.crearTestimonio = async (req, res, next) => {
    try {
        // Añadir usuario a req.body
        req.body.usuario = req.usuario.id;
        req.body.nombre = req.usuario.nombre;
        req.body.avatar = req.usuario.foto;

        const testimonio = await Testimonio.create(req.body);

        res.status(201).json({
            success: true,
            data: testimonio
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar testimonio (Admin)
// @route   DELETE /api/testimonios/:id
// @access  Privado/Admin
exports.eliminarTestimonio = async (req, res, next) => {
    try {
        const testimonio = await Testimonio.findById(req.params.id);

        if (!testimonio) {
            return res.status(404).json({ success: false, message: 'Testimonio no encontrado' });
        }

        // Verificar que sea el dueño o admin
        if (testimonio.usuario.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
            return res.status(401).json({ success: false, message: 'No autorizado' });
        }

        await testimonio.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
