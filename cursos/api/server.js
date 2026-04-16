// ============================================
// SERVIDOR PRINCIPAL DE LA API
// ============================================
// Este archivo es el punto de entrada de nuestra aplicación backend
// Aquí configuramos Express, conectamos a la base de datos y definimos las rutas

// 1. IMPORTAR DEPENDENCIAS
// Traemos las librerías que necesitamos para que funcione el servidor
const express = require('express');        // Framework para crear el servidor web
const dotenv = require('dotenv');          // Para leer variables de entorno (.env)
const cors = require('cors');              // Para permitir peticiones desde el frontend
const connectDB = require('./config/database');  // Función para conectar a MongoDB
const errorHandler = require('./middleware/errorHandler');  // Manejo de errores centralizado
const path = require('path');              // Para manejar rutas de archivos

// 2. CARGAR CONFIGURACIÓN
// Cargamos las variables de entorno desde el archivo .env
// Esto nos permite tener configuraciones diferentes para desarrollo y producción
dotenv.config();

// 3. CONECTAR A LA BASE DE DATOS
// Establecemos conexión con MongoDB antes de iniciar el servidor
connectDB();

// 4. CREAR LA APLICACIÓN EXPRESS
// Express es el framework que nos permite crear el servidor web
const app = express();

// 5. CONFIGURAR MIDDLEWARES
// Los middlewares son funciones que procesan las peticiones antes de llegar a las rutas

// Middleware para leer JSON en el body de las peticiones
// Esto permite que podamos recibir datos en formato JSON desde el frontend
app.use(express.json());

// Middleware para leer datos de formularios
// Esto permite recibir datos enviados desde formularios HTML
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta de subidas estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. CONFIGURAR CORS (Cross-Origin Resource Sharing)
// CORS permite que nuestro frontend (en otro puerto) pueda hacer peticiones a esta API
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',  // URL del frontend
  credentials: true,           // Permite enviar cookies
  optionsSuccessStatus: 200    // Código de éxito para navegadores antiguos
};
app.use(cors(corsOptions));

// 7. RUTA DE BIENVENIDA
// Esta ruta muestra información básica cuando visitamos la raíz de la API
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API de Curso Online funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      cursos: '/api/cursos',
      compras: '/api/compras'
    }
  });
});

// 8. REGISTRAR RUTAS DE LA API
// Aquí conectamos las diferentes rutas de nuestra aplicación
// Cada ruta maneja un recurso diferente (autenticación, cursos, compras)
app.use('/api/auth', require('./routes/auth'));        // Rutas de autenticación (login, registro)
app.use('/api/cursos', require('./routes/cursos'));    // Rutas de cursos (listar, crear, editar)
app.use('/api/compras', require('./routes/compras'));  // Rutas de compras (crear, listar)
app.use('/api/mensajes', require('./routes/mensajes')); // Rutas de chat
app.use('/api/clases', require('./routes/clases'));    // Rutas de contenido multimedia
app.use('/api/tutorias', require('./routes/tutorias')); // Rutas de gestión de tutorías
app.use('/api/testimonios', require('./routes/testimonios')); // Rutas de testimonios

// 9. MIDDLEWARE DE MANEJO DE ERRORES
// Este middleware captura todos los errores y los maneja de forma centralizada
// Debe ir DESPUÉS de todas las rutas
app.use(errorHandler);

// 10. CONFIGURAR PUERTO
// El puerto es el número donde escuchará nuestro servidor
// Si existe PORT en .env lo usa, sino usa el 5000
const PORT = process.env.PORT || 5000;

// 11. INICIAR EL SERVIDOR
// Ponemos el servidor a escuchar en el puerto especificado
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Visita: http://localhost:${PORT}`);
});

// 12. MANEJO DE ERRORES NO CAPTURADOS
// Si hay un error que no fue manejado, cerramos el servidor de forma segura
process.on('unhandledRejection', (err) => {
  console.log(`❌ Error no manejado: ${err.message}`);
  server.close(() => process.exit(1));
});

// Exportamos la aplicación para poder usarla en tests
module.exports = app;
