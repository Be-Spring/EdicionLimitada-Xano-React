# Edición Limitada – Frontend

## Descripción general
Este proyecto corresponde al frontend de **Edición Limitada**, una tienda desarrollada con **React + Vite**.  
Los usuarios pueden navegar productos, registrarse, iniciar sesión y revisar diseñadores.  
El sistema cuenta además con un panel administrativo para gestionar productos, diseñadores, usuarios y órdenes.

El backend fue implementado con **Xano**, dividido en dos grupos principales:  
- **Authentication**  
- **E-commerce API**

## Tecnologías utilizadas
- React JS con componentes funcionales
- Vite como entorno de desarrollo
- React Router DOM para la navegación
- Bootstrap / React-Bootstrap para el diseño visual
- Fetch API con async/await para el consumo de endpoints REST
- Context / LocalStorage para persistencia de sesión

## Características principales del sistema
- Autenticación con roles (Cliente y Administrador)
- Persistencia de la sesión mediante Context y LocalStorage
- Vista Cliente:
  - Catálogo de productos
  - Carrito editable
  - Pago simulado
  - Estado del pedido
  - Edición de datos personales
- Vista Administrador:
  - CRUD de productos (incluye múltiples imágenes)
  - CRUD de usuarios (bloquear/desbloquear)
  - Gestión de órdenes y pagos simulados


# Instalación y ejecución

### 1. Requisitos
- Node.js (LTS)
- Visual Studio Code o editor equivalente
- Git (opcional)

Verificación:
node -v
npm -v

### 2. Variables de entorno
El archivo `.env` contiene:

VITE_XANO_AUTH_BASE=
VITE_XANO_STORE_BASE=

Nota: El archivo `.env` se incluye solo para efectos de evaluación.  
**Posterior a la revisión será reconfigurado de manera segura**, siguiendo la regla de no exponer variables sensibles en el repositorio.


### 3. Instalar dependencias
npm install

### 4. Ejecutar el proyecto
npm run dev

Abrir la URL indicada por Vite, generalmente:
http://localhost:5173/


---

## Backend utilizado (Xano)

El proyecto utiliza Xano bajo el **Free Build Plan**.  
Este plan no permite configurar manualmente CORS, pero permite acceso desde cualquier origen, lo que facilita la ejecución local del frontend.

Se utilizan dos grupos de API:

### Authentication (`${VITE_XANO_AUTH_BASE}`)
- **POST** `/auth/login` – Login administrador  
- **POST** `/auth/login_cliente` – Login cliente  
- **POST** `/auth/signup` – Registro  
- **GET** `/auth/me` – Usuario autenticado

### E-commerce API (`${VITE_XANO_STORE_BASE}`)

#### Productos
- **GET** `/producto`
- **GET** `/producto/{id}`
- **POST** `/upload/image`

#### Diseñadores
- **GET** `/disenador`
- **POST** `/disenador`
- **PATCH** `/disenador/{id}`
- **DELETE** `/disenador/{id}`

#### Categorías
- **GET** `/categoria`

#### Usuarios (admin)
- **GET** `/user`
- **GET** `/user/{id}`
- **DELETE** `/user/{id}`

#### Órdenes
- **GET** `/orden`
- **GET** `/orden/{id}`

---

## Usuarios de prueba

### Administrador
- Email: `admin@ejemplo.com`  
- Password: `Admin123.`  
- Rol: administrador  
- Estado: activo

### Cliente
- Email: `cliente@ejemplo.com`  
- Password: `Cliente123.`  
- Rol: cliente  
- Estado: activo

También se pueden registrar nuevos usuarios desde el formulario correspondiente, estos son creados con rol de cliente de forma predeterminada.

---

## Rutas principales del frontend

### Públicas
- `/`
- `/productos`
- `/contacto`
- `/session`
- `/session-admin`
- `/registro`
- `/nosotros/edicion-limitada`
- `/nosotros/disenadores`
- `/perfil/datos-personales`
- `/blog/editorial`
- `/blog/eventos`

### Área administrativa
- `/administrador`
- `/administrador/productos`
- `/administrador/usuarios`
- `/administrador/ordenes`
- `/administrador/disenadores`

---

## Autores
Proyecto desarrollado por **Betsabé Spring** y **Anakena Balbontin** como parte de la asignatura Full Stack 2.
