// ============================================
// CONTROLADOR: Compras
// ============================================
// Este archivo contiene la lógica de negocio para:
// - Crear nuevas compras
// - Listar compras del usuario
// - Gestionar compras (solo admin)

const Compra = require('../models/Compra');
const Curso = require('../models/Curso');
const Usuario = require('../models/Usuario');

// ============================================
// ENDPOINT: Crear nueva compra
// ============================================
// Ruta: POST /api/compras
// Acceso: Privado (usuario autenticado)

exports.crearCompra = async (req, res, next) => {
  try {
    // PASO 1: Obtener datos de la petición
    const { cursoId, metodoPago, datosFacturacion } = req.body;
    const usuarioId = req.usuario.id;  // Viene del middleware 'proteger'

    // PASO 2: Verificar que el curso existe
    const curso = await Curso.findById(cursoId);

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // PASO 3: Verificar si el usuario ya compró este curso
    const usuario = await Usuario.findById(usuarioId);

    // Buscamos en el array de cursosComprados si ya tiene este curso
    const yaComprado = usuario.cursosComprados.some(
      compra => compra.curso.toString() === cursoId
    );

    if (yaComprado) {
      return res.status(400).json({
        success: false,
        message: 'Ya has comprado este curso'
      });
    }

    // PASO 4: Crear la compra en la base de datos
    const compra = await Compra.create({
      usuario: usuarioId,
      curso: cursoId,
      precioCompra: curso.precio,  // Guardamos el precio actual del curso
      metodoPago,
      datosFacturacion,
      // Generamos un ID único para la transacción
      transaccionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    // PASO 5: Agregar el curso a la lista de cursos comprados del usuario
    usuario.cursosComprados.push({
      curso: cursoId,
      fechaCompra: new Date()
    });
    await usuario.save();

    // PASO 6: Incrementar el contador de inscriptos del curso
    curso.inscriptos += 1;
    await curso.save();

    // PASO 7: Enviar respuesta exitosa
    res.status(201).json({
      success: true,
      compra
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Obtener compras del usuario
// ============================================
// Ruta: GET /api/compras/mis-compras
// Acceso: Privado (usuario autenticado)

exports.getMisCompras = async (req, res, next) => {
  try {
    // PASO 1: Buscar todas las compras del usuario actual
    const compras = await Compra.find({ usuario: req.usuario.id })
      .populate('curso')      // Traer también los datos del curso
      .sort('-createdAt');    // Ordenar por fecha (más reciente primero)

    // PASO 2: Enviar respuesta con las compras
    res.status(200).json({
      success: true,
      count: compras.length,
      compras
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Obtener todas las compras (Admin)
// ============================================
// Ruta: GET /api/compras
// Acceso: Privado (solo administradores)

exports.getCompras = async (req, res, next) => {
  try {
    // PASO 1: Buscar todas las compras del sistema
    const compras = await Compra.find()
      .populate('usuario', 'nombre email')   // Traer nombre y email del usuario
      .populate('curso', 'titulo precio')    // Traer título y precio del curso
      .sort('-createdAt');                   // Ordenar por fecha

    // PASO 2: Enviar respuesta con todas las compras
    res.status(200).json({
      success: true,
      count: compras.length,
      compras
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ENDPOINT: Actualizar estado de compra
// ============================================
// Ruta: PUT /api/compras/:id
// Acceso: Privado (solo administradores)

exports.actualizarCompra = async (req, res, next) => {
  try {
    // PASO 1: Obtener el nuevo estado del pago
    const { estadoPago } = req.body;

    // PASO 2: Buscar y actualizar la compra
    const compra = await Compra.findByIdAndUpdate(
      req.params.id,
      { estadoPago },
      {
        new: true,           // Devolver el documento actualizado
        runValidators: true  // Validar que el estado sea válido
      }
    );

    // PASO 3: Verificar si la compra existe
    if (!compra) {
      return res.status(404).json({
        success: false,
        message: 'Compra no encontrada'
      });
    }

    // PASO 4: Enviar respuesta con la compra actualizada
    res.status(200).json({
      success: true,
      compra
    });
  } catch (error) {
    next(error);
  }
};

