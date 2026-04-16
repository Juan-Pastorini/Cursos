# 📚 API de Cursos Online - Guía Educativa

Esta es una API REST para una plataforma de venta de cursos online, diseñada con fines educativos para estudiantes que están aprendiendo desarrollo web backend.

## 🎯 Objetivo Educativo

Este proyecto está diseñado para enseñar los conceptos fundamentales de:
- **Node.js y Express**: Crear un servidor web
- **MongoDB y Mongoose**: Base de datos NoSQL
- **Autenticación JWT**: Manejo de sesiones de usuario
- **API REST**: Arquitectura de servicios web
- **CRUD Operations**: Crear, Leer, Actualizar, Eliminar

## 📁 Estructura del Proyecto

```
api/
├── config/
│   └── database.js          # Configuración de MongoDB
├── controllers/
│   ├── authController.js    # Lógica de autenticación
│   ├── cursoController.js   # Lógica de cursos
│   └── compraController.js  # Lógica de compras
├── middleware/
│   ├── auth.js              # Protección de rutas
│   └── errorHandler.js      # Manejo de errores
├── models/
│   ├── Usuario.js           # Modelo de usuario
│   ├── Curso.js             # Modelo de curso
│   └── Compra.js            # Modelo de compra
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── cursos.js            # Rutas de cursos
│   └── compras.js           # Rutas de compras
└── server.js                # Punto de entrada
```

## 🔑 Conceptos Clave

### 1. **Modelos (Models)**
Los modelos definen la estructura de los datos en MongoDB:
- **Usuario**: Información del usuario, contraseña encriptada, cursos comprados
- **Curso**: Información del curso, precio, contenido
- **Compra**: Relación entre usuario y curso

### 2. **Rutas (Routes)**
Las rutas definen los endpoints de la API:
- `POST /api/auth/registro` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/cursos` - Listar cursos
- `POST /api/compras` - Comprar un curso

### 3. **Controladores (Controllers)**
Los controladores contienen la lógica de negocio:
- Validar datos
- Interactuar con la base de datos
- Enviar respuestas al cliente

### 4. **Middlewares**
Funciones que se ejecutan antes de llegar a los controladores:
- **auth.js**: Verifica que el usuario esté autenticado
- **errorHandler.js**: Maneja errores de forma centralizada

## 🚀 Cómo Funciona

### Flujo de una Petición

```
Cliente → Ruta → Middleware → Controlador → Modelo → Base de Datos
                                                    ↓
Cliente ← Respuesta ← Controlador ← Modelo ← Base de Datos
```

### Ejemplo: Registro de Usuario

1. **Cliente** envía POST a `/api/auth/registro` con datos
2. **Ruta** (`routes/auth.js`) recibe la petición
3. **Controlador** (`authController.js`) procesa:
   - Valida que el email no exista
   - Crea el usuario (la contraseña se encripta automáticamente)
   - Genera un token JWT
4. **Respuesta** se envía al cliente con el token

## 🔐 Autenticación

Esta API usa **JWT (JSON Web Tokens)** para autenticación:

1. Usuario se registra o hace login
2. Servidor genera un token JWT
3. Cliente guarda el token
4. Cliente envía el token en cada petición protegida
5. Servidor verifica el token

### Ejemplo de uso del token:

```javascript
// Headers de la petición
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Base de Datos

### Relaciones entre Modelos

```
Usuario
  ├── cursosComprados[] → Curso
  └── compras[] → Compra

Curso
  └── inscriptos (contador)

Compra
  ├── usuario → Usuario
  └── curso → Curso
```

## 🛠️ Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env`:
```
MONGODB_URI=mongodb://localhost:27017/cursos
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRE=30d
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Iniciar servidor
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## 📝 Endpoints Principales

### Autenticación
- `POST /api/auth/registro` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil (requiere token)

### Cursos
- `GET /api/cursos` - Listar todos los cursos
- `GET /api/cursos/destacados` - Cursos destacados
- `GET /api/cursos/:id` - Ver un curso
- `POST /api/cursos` - Crear curso (admin)
- `PUT /api/cursos/:id` - Actualizar curso (admin)
- `DELETE /api/cursos/:id` - Eliminar curso (admin)

### Compras
- `POST /api/compras` - Comprar un curso (requiere token)
- `GET /api/compras/mis-compras` - Ver mis compras (requiere token)
- `GET /api/compras` - Ver todas las compras (admin)
- `PUT /api/compras/:id` - Actualizar estado (admin)

## 🎓 Conceptos para Aprender

### 1. **Async/Await**
Todas las operaciones de base de datos son asíncronas:
```javascript
const usuario = await Usuario.findById(id);
```

### 2. **Try/Catch**
Manejo de errores:
```javascript
try {
  // Código que puede fallar
} catch (error) {
  // Manejar el error
}
```

### 3. **Middleware**
Funciones que procesan la petición:
```javascript
router.get('/protegida', proteger, miControlador);
```

### 4. **Populate**
Traer datos relacionados:
```javascript
await Usuario.findById(id).populate('cursosComprados.curso');
```

### 5. **Validaciones**
Mongoose valida automáticamente:
```javascript
email: {
  type: String,
  required: [true, 'El email es requerido']
}
```

## 🔍 Debugging

### Ver logs en consola
El servidor muestra información útil:
- ✅ Conexión a MongoDB exitosa
- 🚀 Servidor corriendo en puerto X
- ❌ Errores detallados

### Probar endpoints
Usa herramientas como:
- **Postman**: Cliente HTTP visual
- **Thunder Client**: Extensión de VS Code
- **curl**: Desde la terminal

## 💡 Buenas Prácticas Implementadas

1. ✅ **Separación de responsabilidades**: Rutas, controladores y modelos separados
2. ✅ **Manejo centralizado de errores**: Un solo lugar para manejar errores
3. ✅ **Validaciones**: En los modelos y controladores
4. ✅ **Seguridad**: Contraseñas encriptadas, tokens JWT
5. ✅ **Código comentado**: Explicaciones paso a paso
6. ✅ **Nombres descriptivos**: Variables y funciones con nombres claros

## 📚 Recursos para Aprender Más

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [MongoDB University](https://university.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🤝 Contribuir

Este proyecto es educativo. Siéntete libre de:
- Agregar más comentarios
- Mejorar la documentación
- Crear ejemplos adicionales
- Reportar errores o sugerencias

---

**Nota**: Este código está optimizado para aprendizaje, con comentarios extensos y estructura clara. En producción, algunos comentarios podrían reducirse.
