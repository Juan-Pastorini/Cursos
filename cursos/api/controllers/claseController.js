const Clase = require('../models/Clase');
const Curso = require('../models/Curso');

// @desc    Obtener todas las clases de un curso
// @route   GET /api/clases/curso/:cursoId
// @access  Privado
exports.getClasesByCurso = async (req, res, next) => {
    try {
        const clases = await Clase.find({ curso: req.params.cursoId }).sort('orden');
        res.status(200).json({
            success: true,
            data: clases
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear una nueva clase
// @route   POST /api/clases
// @access  Privado/Profesor/Admin
exports.createClase = async (req, res, next) => {
    try {
        const { curso: cursoId } = req.body;

        // Verificar que el curso exista
        const curso = await Curso.findById(cursoId);
        if (!curso) {
            return res.status(404).json({ success: false, message: 'Curso no encontrado' });
        }

        // Verificar propiedad si es profesor
        if (req.usuario.rol === 'profesor' && curso.profesor?.toString() !== req.usuario.id) {
            return res.status(401).json({
                success: false,
                message: 'No tienes permiso para agregar contenido a este curso'
            });
        }

        const clase = await Clase.create(req.body);
        res.status(201).json({
            success: true,
            data: clase
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar una clase
// @route   PUT /api/clases/:id
// @access  Privado/Profesor/Admin
exports.updateClase = async (req, res, next) => {
    try {
        let clase = await Clase.findById(req.params.id);

        if (!clase) {
            return res.status(404).json({ success: false, message: 'Clase no encontrada' });
        }

        // Obtener el curso para verificar propiedad
        const curso = await Curso.findById(clase.curso);
        if (req.usuario.rol === 'profesor' && curso?.profesor?.toString() !== req.usuario.id) {
            return res.status(401).json({
                success: false,
                message: 'No tienes permiso para actualizar esta clase'
            });
        }

        clase = await Clase.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: clase
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar una clase
// @route   DELETE /api/clases/:id
// @access  Privado/Profesor/Admin
exports.deleteClase = async (req, res, next) => {
    try {
        const clase = await Clase.findById(req.params.id);

        if (!clase) {
            return res.status(404).json({ success: false, message: 'Clase no encontrada' });
        }

        // Obtener el curso para verificar propiedad
        const curso = await Curso.findById(clase.curso);
        if (req.usuario.rol === 'profesor' && curso?.profesor?.toString() !== req.usuario.id) {
            return res.status(401).json({
                success: false,
                message: 'No tienes permiso para eliminar esta clase'
            });
        }

        await clase.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
