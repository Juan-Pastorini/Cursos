// ============================================
// MODELO: Compra
// ============================================
// Este archivo define la estructura de las compras en MongoDB
// Una compra relaciona un usuario con un curso

const mongoose = require('mongoose');

// ============================================
// ESQUEMA DE COMPRA
// ============================================

const compraSchema = new mongoose.Schema({
  // Campo: Usuario que realizó la compra
  usuario: {
    type: mongoose.Schema.Types.ObjectId,  // ID del usuario
    ref: 'Usuario',                         // Referencia al modelo Usuario
    required: true
  },

  // Campo: Curso que se compró
  curso: {
    type: mongoose.Schema.Types.ObjectId,  // ID del curso
    ref: 'Curso',                           // Referencia al modelo Curso
    required: true
  },

  // Campo: Precio al momento de la compra
  // Guardamos el precio porque puede cambiar en el futuro
  precioCompra: {
    type: Number,
    required: true
  },

  // Campo: Método de pago utilizado
  metodoPago: {
    type: String,
    enum: ['tarjeta', 'paypal', 'transferencia', 'mercadopago'],
    required: true
  },

  // Campo: Estado del pago
  estadoPago: {
    type: String,
    enum: ['pendiente', 'completado', 'rechazado', 'reembolsado'],
    default: 'pendiente'
  },

  // Campo: ID único de la transacción
  transaccionId: {
    type: String,
    unique: true  // No puede haber dos transacciones con el mismo ID
  },

  // Campo: Datos de facturación
  datosFacturacion: {
    nombreCompleto: String,
    email: String,
    pais: String
  }
}, {
  // Opciones del esquema
  timestamps: true  // Agrega createdAt y updatedAt automáticamente
});

// Exportamos el modelo
module.exports = mongoose.model('Compra', compraSchema);

