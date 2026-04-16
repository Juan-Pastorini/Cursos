# ⚙️ Backend - CursoPro Academy API

API REST robusta construida con **Node.js**, **Express** y **MongoDB**, actuando como el motor principal de la plataforma educativa CursoPro.

## 📋 Funcionalidades Core

- **Autenticación Segura:** Registro y Login con contraseñas encriptadas (Bcrypt) y tokens JWT.
- **Gestión de Cursos:** API completa para el catálogo, creación y edición de cursos.
- **Sistema de Testimonios:** Backend para recolección y visualización de reviews con valoración.
- **Manejo de Compras:** Registro de transacciones y asociación de cursos a usuarios.
- **Cloud Ready:** Preparado para despliegue y conexión con bases de datos en la nube (MongoDB Atlas).
- **Manejo de Archivos:** Configuración de Multer para la gestión de fotos de perfil y banners.

## 🛠️ Stack Tecnológico

- **Node.js**
- **Express.js** (Framework)
- **MongoDB** (Base de Datos NoSQL)
- **Mongoose** (ODM)
- **JsonWebToken** (Seguridad)
- **Multer** (Gestión de Archivos)

## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura el archivo `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cursopro
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

3. Inicia el servidor:
```bash
npm run dev
```

## 📚 Endpoints Principales

### Auth
- `POST /api/auth/registro` - Alta de usuario.
- `POST /api/auth/login` - Inicio de sesión.
- `GET /api/auth/me` - Perfil del usuario autenticado.

### Cursos
- `GET /api/cursos` - Listado completo.
- `GET /api/cursos/:id` - Detalle de curso.
- `POST /api/cursos` - Crear curso (Requiere permisos Admin).

### Testimonios
- `GET /api/testimonios` - Obtener reviews de alumnos.
- `POST /api/testimonios` - Publicar nueva review (Requiere login).

### Compras
- `POST /api/compras` - Registrar nueva inscripción.
- `GET /api/compras/mis-compras` - Cursos adquiridos por el usuario.

---

Desarrollado como parte del ecosistema CursoPro Academy.
