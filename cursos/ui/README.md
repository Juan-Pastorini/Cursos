# 💻 Frontend - CursoPro Academy UI

Esta es la interfaz de usuario de la plataforma **CursoPro Academy**, construida con **Next.js 15** y **Tailwind CSS 4**.

## 🚀 Características del Frontend

- **Arquitectura Moderna:** Uso de App Router y Server Components para máximo rendimiento.
- **Premium Dark Design:** Interfaz refinada con glassmorphism, gradientes dinámicos y estética nocturna.
- **Gestión de Estado:** Context API para autenticación y persistencia de sesión.
- **Animaciones:** Integración profunda con `framer-motion` para una experiencia fluida.
- **Filtros Avanzados:** Buscador de cursos y filtrado por nivel con feedback instantáneo.
- **Responsive:** Diseño adaptativo para dispositivos móviles, tablets y escritorio.

## 🛠️ Tecnologías

- **Next.js 15** (Framework)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4** (Estilos)
- **Framer Motion** (Animaciones)
- **Lucide React** (Iconografía)

## 📦 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno:
Crea un archivo `.env.local` con:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## 📁 Estructura de Carpetas

- `app/`: Rutas y páginas de la aplicación.
  - `(auth)/`: Login y Registro.
  - `checkout/`: Proceso de pago.
  - `plataforma/`: Dashboard y contenido de clases.
  - `profesor/`: Gestión para instructores.
- `components/`: Componentes reutilizables (Hero, CursosList, Testimonios, etc.).
- `context/`: Proveedores de estado global (AuthContext).
- `lib/`: Utilidades, tipos y configuración de API.
- `public/`: Archivos estáticos e imágenes.

---

Desarrollado para ofrecer la mejor experiencia educativa del mercado IT.
