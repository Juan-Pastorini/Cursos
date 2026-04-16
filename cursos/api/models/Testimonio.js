const mongoose = require('mongoose');

const testimonioSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: null
    },
    comentario: {
        type: String,
        required: [true, 'El comentario es requerido'],
        maxlength: [500, 'El comentario no puede exceder 500 caracteres']
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Testimonio', testimonioSchema);
