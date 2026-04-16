// ============================================
// CONFIGURACIÓN DE BASE DE DATOS
// ============================================
// Este archivo maneja la conexión a MongoDB

const mongoose = require('mongoose');

// Función para conectar a MongoDB
// Esta función es asíncrona porque la conexión a la base de datos toma tiempo
const connectDB = async () => {
  try {
    // Intentamos conectar a MongoDB usando la URL del archivo .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Si la conexión es exitosa, mostramos un mensaje
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    // Si hay un error, lo mostramos y cerramos la aplicación
    console.error(`❌ Error conectando a MongoDB: ${error.message}`);
    process.exit(1);  // 1 significa que salimos por un error
  }
};

// Exportamos la función para usarla en server.js
module.exports = connectDB;

