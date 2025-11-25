# Edición Limitada (React + Vite)

Pequeño proyecto React creado con Vite. Este README explica cómo ejecutar el proyecto en Windows PowerShell, qué cambios hice y cómo probar la navegación/componentes.

## Requisitos
- Node.js (v18+ recomendado)
# Edición Limitada (React + Vite)

**Descripción General**
- **Proyecto**: Frontend React creado con Vite para la tienda "Edición Limitada". Implementa páginas públicas, autenticación con Xano, área de administración (productos, diseñadores, usuarios, órdenes) y un flujo básico de carrito.
- **Estructura**: código principal en `src/` (componentes en `src/componentes/`, páginas en `src/pages/`, helpers API en `src/api/xano.js`, contexto de autenticación en `src/context/AuthContext.jsx`).

**Requisitos**
- **Node.js**: v18+ recomendado.
- **npm**: v9+.

**Instalación y ejecución (PowerShell)**
- Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
npm install
npm run dev
```

- Si PowerShell lanza errores con `npm` (política de ejecución), usa `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run dev
```

- Vite mostrará la URL local (por defecto `http://localhost:5173/`).

**Variables de entorno**
- Define en `.env` o en tu entorno:
  - `VITE_XANO_AUTH_BASE` — Base URL del grupo Auth de Xano (ejemplo: `https://x8ki-letl-twmt.n7.xano.io/api:YNCB1DWl`).
  - `VITE_XANO_STORE_BASE` — Base URL del grupo de API de tienda (productos, usuarios, etc.).

**Detalle del backend**
- **Proveedor**: Xano (API REST). El proyecto usa endpoints públicos y de auth expuestos por un workspace de Xano.
- **Base (ejemplo)**: `https://x8ki-letl-twmt.n7.xano.io/api:YNCB1DWl`
- **Notas**: El frontend intenta primero los endpoints de autenticación del grupo `auth` (`/auth/signup`, `/auth/login`, `/auth/login_cliente`) y, si no están disponibles, cae en endpoints CRUD genéricos (`/user`) como fallback.

**Usuarios de prueba (credenciales dummy)**
- **Administrador (ejemplo)**:
  - **Email**: `admin@example.com`
  - **Password**: `AdminPass123!`
  - **Nota**: Asegúrate de crear este usuario en Xano dentro del grupo Auth con rol `administrador` o en la tabla `user` + asignar rol/credenciales.
- **Cliente (ejemplo)**:
  - **Email**: `cliente@example.com`
  - **Password**: `ClientPass123!`
  - **Nota**: El endpoint de `signup` guarda credenciales; si tu Xano no expone `/auth/signup`, crear el usuario en `/user` puede no generar contraseña usable — ver sección Backend.

**Rutas (frontend)**
- **Públicas**:
  - `/` — Home
  - `/productos` — Lista de productos
  - `/contacto` — Formulario de contacto
  - `/sesion` — Login cliente
  - `/sesion-admin` — Login admin
  - `/registro` — Formulario de registro
  - `/blog/editorial`, `/blog/eventos` — Secciones de blog
  - `/nosotros/edicion-limitada`, `/nosotros/disenadores`
  - `/perfil/datos-personales` — Página para ver/editar datos del cliente (requiere login)

- **Área de administración (requiere login)**:
  - `/administrador` — Dashboard admin
  - `/administrador/productos`
  - `/administrador/usuarios`
  - `/administrador/ordenes`
  - `/administrador/disenadores`

**Endpoints (backend Xano used by the frontend)**
- **Auth** (grupo `auth` en Xano):
  - `POST /auth/signup` — Registrar usuario (se envía `name`, `email`, `password`, `password_confirmation`).
  - `POST /auth/login` o `POST /auth/login_cliente` — Login (acepta `email` o `identifier` según configuración).
  - `GET /auth/me` — Obtener usuario actual a partir del token.

- **Store / CRUD** (grupo API principal):
  - `GET /producto` — Listar productos
  - `POST /producto` — Crear producto
  - `PATCH /producto/:id` — Actualizar producto (se usa para adjuntar imágenes)
  - `GET /disenador`, `POST /disenador`, `PATCH /disenador/:id`, `DELETE /disenador/:id`
  - `GET /categoria` — Listar categorías
  - `GET /user`, `POST /user`, `PUT /user/:id`, `DELETE /user/:id` — CRUD usuarios (nota: en algunos Xano la tabla `user` es solo datos, no credenciales)
  - `POST /upload/image` — Subir imágenes (se suben primero y luego se adjuntan con `PATCH /producto/:id` o `PATCH /disenador/:id`)
  - `GET /orden` — Listado de órdenes

**Comportamiento importante**
- El frontend guarda el token en `localStorage` con la clave `auth_token` y el usuario en `auth_user`.
- El helper central `src/api/xano.js` normaliza respuestas (token, usuario, subida de imágenes) y contiene adaptadores para distintos formatos de Xano.
- En registro/login el código prueba varias combinaciones (p. ej. `identifier` vs `email`) para adaptarse a diferentes configuraciones de Xano.

**Pruebas rápidas y verificación**
- 1) Arranca el dev server: `npm run dev`.
- 2) Ve a `http://localhost:5173/registro` y crea un usuario de prueba.
- 3) Inicia sesión en `/sesion` con las credenciales usadas.
- 4) En Admin: entra a `/sesion-admin` con credenciales de admin.

**Problemas comunes**
- `404 /auth/signup` o `Unable to locate request.`: tu workspace de Xano no tiene ese endpoint. Solución: crea un endpoint `POST /auth/signup` en el API group Auth que use la función "Create User" de Xano.
- Usuario creado en `/user` pero sin contraseña usable: significa que la creación fue en la tabla `user` directamente y no en el Auth system — debes crear el usuario a través del flujo de Auth de Xano para que tenga credenciales.
- `Invalid password syntax.`: añade validación en el formulario o ajusta la contraseña para cumplir reglas (mayúscula, número, símbolo, longitud mínima) según la configuración de tu Xano.

**Contribuir / Desarrollo**
- Si vas a modificar el backend en Xano, actualiza `VITE_XANO_AUTH_BASE` y `VITE_XANO_STORE_BASE` en tu entorno.
- Si quieres que haga el commit y abra un branch con cambios limpios, indícame el nombre del branch y lo preparo.

---

Si necesitas que adapte el README con credenciales concretas o un listado más detallado de endpoints (por ejemplo con ejemplos de request/response), dímelo y lo completo.
