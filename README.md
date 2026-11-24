# Na-Ni-Nu — Imprenta y Librería (E-Commerce React JS)

Proyecto de E-commerce desarrollado para el curso **React JS 2026-2C** (Prof. Joaquín Navarro), evolucionado progresivamente desde la preentrega aprobada hasta el cumplimiento integral de las consignas de la **Entrega Final**.

---

## 📋 Descripción del Proyecto

**Na-Ni-Nu** es una tienda online especializada en servicios de **Imprenta** (impresiones, fotocopias, folletos, stickers y trabajos personalizados) y productos de **Librería** (artículos escolares, papelería y archivo).

La aplicación está construida sobre una arquitectura Single Page Application (SPA) con React 19 y Vite, utilizando **Context API** para la gestión de estados globales, **Cloud Firestore** como base de datos en tiempo real, **Firebase Authentication** para autenticación y autorización con control de roles, y estilos elaborados con **CSS nativo responsive**.

---

## 🚀 Tecnologías Principales

- **React 19** (`^19.2.8`)
- **React Router DOM 7** (`^7.18.4`)
- **Firebase SDK Modular 12** (`firebase`)
  - Cloud Firestore
  - Firebase Authentication
- **Vite 8** (`^8.3.0`)
- **CSS3 Nativo** (5 breakpoints responsive: 1100px, 900px, 768px, 650px, 480px)
- **ESLint 10**

---

## ✨ Funcionalidades Implementadas

### 1. Carrito de Compras Global (`useCarrito`)
- Estado global centralizado con `CarritoContexto` y `CarritoProveedor`.
- Operaciones obligatorias: `agregarAlCarrito`, `aumentarCantidad`, `disminuirCantidad`, `eliminarDelCarrito` y `vaciarCarrito`.
- Selección de productos individual mediante checkboxes y selector masivo.
- Cálculo diferenciado de cantidad total, unidades seleccionadas y monto a pagar.
- Funcionalidad **DESHACER** con temporizador automático de 5 segundos.
- Control visual con confirmación para vaciado completo del carrito.

### 2. Autenticación, Roles y Rutas Protegidas (`useAuth`)
- Estado global de autenticación conectado con Firebase Authentication.
- Formularios controlados de **Inicio de Sesión** (`/login`) y **Registro de Clientes** (`/registro`).
- Diferenciación de roles: Visitante, Cliente registrado y **Administrador**.
- Componente `<RutaProtegida requiereAdmin>` que impide el acceso a usuarios no autorizados a la ruta `/admin`.
- Botón de autocompletado con las credenciales académicas en la pantalla de login.

### 3. Catálogo y Detalle con Cloud Firestore
- Lectura en tiempo real del catálogo desde la colección `productos` de Firestore.
- Filtrado por secciones: Catálogo general (`/productos`), Librería (`/libreria`) e Imprenta (`/imprenta`).
- Vista de detalle dinámico (`/producto/:id`) con consulta individual vía `getDoc`.
- Soporte para atributos exclusivos de Imprenta (`gramos` y `tipoHoja`).
- Normalización de identificadores que prioriza el ID de documento de Firestore sobre cualquier campo interno.

### 4. Panel de Administración y CRUD Completo
- Ruta protegida `/admin` accesible exclusivamente para usuarios con rol administrador.
- **Creación de productos**: formulario controlado con validaciones y campos condicionales según la sección (gramaje y tipo de hoja solo para Imprenta).
- **Lectura**: grilla/tabla administrativa con miniaturas, badges, detalles y acciones.
- **Edición**: precarga de valores del producto seleccionado y actualización en Firestore.
- **Eliminación**: borrado de documentos con confirmación previa obligatoria (`window.confirm`).

### 5. Buscador en Tiempo Real (`useBusqueda`)
- Búsqueda interactiva en el Header mientras el usuario escribe.
- Filtrado insensible a mayúsculas, minúsculas y tildes (`normalize`).
- Coincidencias parciales por nombre, descripción y categoría.
- Integrado con la sección activa y con botón para limpiar la búsqueda.

### 6. Paginación Funcional (`usePaginacion`)
- Paginación local fluida (12 productos por página).
- Botones de página Anterior, Siguiente y acceso directo por número de página.
- Recálculo automático y reinicio a la primera página al aplicar filtros o búsquedas.

### 7. Página de Inicio y Galería de Trabajos
- Preservación íntegra de la galería de trabajos realizados (`trabajos.json`).
- Carrusel interactivo con autorreproducción automática, controles manuales y visor modal ampliado.
- Enlaces de acceso directo a Librería e Imprenta.

---

## 🔑 Credenciales Académicas Oficiales

Para la corrección docente del panel administrativo:

- **Usuario:** `admin@gmail.com`
- **Contraseña:** `admin123`

---

## 🛠️ Instalación y Ejecución Local

1. Clonar el repositorio o ingresar a la carpeta del proyecto:
   ```bash
   cd "naninu react"
   ```

2. Instalar las dependencias exactas:
   ```bash
   npm ci
   ```

3. Configurar las variables de entorno:
   Copiar `.env.example` a un nuevo archivo `.env` y completar los valores con las claves de tu proyecto Firebase:
   ```bash
   cp .env.example .env
   ```

4. Iniciar el servidor de desarrollo en localhost:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en: **http://localhost:5173**

5. Ejecutar compilación de producción:
   ```bash
   npm run build
   ```

6. Previsualizar la versión compilada:
   ```bash
   npm run preview
   ```

---

## 📁 Estructura del Proyecto

```text
naninu react/
├── public/
│   ├── _redirects                 # Reglas de enrutamiento para hosting SPA
│   ├── data/
│   │   ├── productos.json         # Respaldo original (43 productos)
│   │   └── trabajos.json          # 14 trabajos de la galería de inicio
│   └── imagenes/                  # Recursos gráficos oficiales
├── src/
│   ├── assets/
│   ├── componentes/
│   │   ├── administracion/        # Panel, Lista y Formulario CRUD
│   │   ├── autenticacion/         # Login, Registro y RutaProtegida
│   │   ├── carrito/               # Carrito interactivo
│   │   ├── estructura/            # Header, Nav, Footer, Layout
│   │   ├── inicio/                # Carrusel, Trabajos y ComprarHoy
│   │   └── productos/             # Item, ItemLista, ItemListaContenedor, Detalle, Buscador, Paginador
│   ├── contexto/
│   │   ├── AuthContexto.js & AuthProveedor.jsx
│   │   ├── BusquedaContexto.js & BusquedaProveedor.jsx
│   │   └── CarritoContexto.js & CarritoProveedor.jsx
│   ├── firebase/
│   │   ├── configuracion.js       # Inicialización modular de Firebase
│   │   └── migrarProductos.js     # Utilidad controlada de migración a Firestore
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useBusqueda.js
│   │   ├── useCarrito.js
│   │   └── usePaginacion.js
│   ├── servicios/
│   │   ├── productosServicio.js   # Abstracción de datos Firestore
│   │   └── usuariosServicio.js    # Perfiles y roles en Firestore
│   ├── utilidades/
│   │   └── validarProducto.js     # Validaciones de reglas de negocio
│   ├── App.jsx
│   ├── index.css                  # Estilos CSS nativo responsive
│   └── main.jsx
├── .env.example
├── firestore.rules                # Reglas de seguridad de Firestore
├── package.json
└── vite.config.js
```

---

## 🌐 Despliegue en Producción (Firebase Hosting)

La aplicación se encuentra desplegada y accesible públicamente en el plan Spark gratuito de Firebase Hosting:

- **URL de producción:** [https://naninu-academico-2026.web.app](https://naninu-academico-2026.web.app)
- **URL alternativa:** [https://naninu-academico-2026.firebaseapp.com](https://naninu-academico-2026.firebaseapp.com)

El proyecto incluye la configuración en [firebase.json](file:///E:/Descarga/na-ni-nu%20ClasesReact/naninu%20react/firebase.json) y `public/_redirects` para garantizar que el enrutamiento de React Router funcione correctamente (SPA rewrites a `/index.html`), permitiendo el acceso directo a cualquier ruta (ej. `/admin`, `/producto/1`, `/libreria`) y la recarga de página sin errores 404.
