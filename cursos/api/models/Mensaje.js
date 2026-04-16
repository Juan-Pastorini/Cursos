const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso',
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    texto: {
        type: String,
        required: [true, 'El mensaje no puede estar vacío'],
        trim: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Mensaje', mensajeSchema);
