# 🎓 CursoPro Academy - Plataforma Premium de Educación IT

¡Bienvenido a **CursoPro Academy**! Esta es una plataforma educativa Fullstack diseñada para ofrecer una experiencia de aprendizaje de élite. Transformada con una estética **"Premium Dark"**, la aplicación combina potencia técnica con un diseño visualmente impactante.

---

## ✨ Características Principales

### 🔐 Seguridad y Autenticación
- **JWT Authentication:** Sistema robusto de login y registro.
- **Sesiones Persistentes:** Manejo de estado global con React Context.
- **Roles de Usuario:** Diferenciación entre Estudiantes, Profesores y Administradores.

### 📚 Experiencia del Estudiante
- **Catálogo Inteligente:** Filtros por nivel (Principiante, Intermedio, Avanzado) y buscador en tiempo real.
- **Checkout de Alta Conversión:** Proceso de pago optimizado con múltiples métodos (Tarjeta, PayPal, MercadoPago).
- **Mis Cursos:** Dashboard personal con acceso inmediato al contenido tras la compra.
- **Plataforma de Clases:** Interfaz de visualización de contenido multimedia y chat de comunidad.

### 👨‍🏫 Panel del Profesor
- **Gestión de Contenido:** Subida de clases, gestión de alumnos y estadísticas de cursos.
- **Feedback Real:** Sistema de testimonios y valoraciones de 5 estrellas.

### 🎨 Diseño y UX
- **Premium Dark Mode:** Estética basada en Glassmorphism, gradientes vibrantes y luces ambientales.
- **Framer Motion:** Micro-animaciones y transiciones fluidas para una experiencia "Premium".
- **Responsive Design:** Optimizado para dispositivos móviles y tablets.

---

## 🛠️ Stack Tecnológico

| Área | Tecnologías |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| **Backend** | Node.js, Express.js, Mongoose |
| **Base de Datos** | MongoDB |
| **Seguridad** | JWT (JSON Web Tokens), Bcryptjs |
| **Gestión de Archivos** | Multer |

---

## 🚀 Instalación y Guía Rápida

### 1. Clonar y Preparar
Asegúrate de tener **Node.js 18+** y **MongoDB** funcionando.

### 2. Configuración del Backend (API)
1. Entra a la carpeta `api`:
   ```bash
   cd api
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env`:
   ```env
   PORT=5000
   MONGODB_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_secreto_aleatorio
   JWT_EXPIRE=30d
   ```
4. Inicia el servidor:
   ```bash
   npm run dev
   ```

### 3. Configuración del Frontend (UI)
1. Abre otra terminal y entra a `ui`:
   ```bash
   cd ui
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm run dev
   ```

---

## 🗺️ Roadmap de Próximas Versiones
- [ ] Integración con Stripe para pagos reales en producción.
- [ ] Sistema de exámenes y certificaciones PDF dinámicas.
- [ ] Streaming de video optimizado con AWS S3 o Cloudinary.
- [ ] App móvil nativa con React Native.

