# Edición Limitada (React + Vite)

Pequeño proyecto React creado con Vite. Este README explica cómo ejecutar el proyecto en Windows PowerShell, qué cambios hice y cómo probar la navegación/componentes.

## Requisitos
- Node.js (v18+ recomendado)
- npm (v9+)

## Comandos (PowerShell)
Abre PowerShell en la carpeta raíz del proyecto y ejecuta:

```powershell
npm install
npm run dev
```

Si `npm` lanza un error relacionado con `npm.ps1` en PowerShell, usa `npm.cmd` en su lugar:

```powershell
npm.cmd install
npm.cmd run dev
```

Vite te mostrará la URL local (por defecto `http://localhost:5173/`, si ese puerto está en uso puede cambiar a `5174` u otro).


## Siguientes pasos sugeridos
- Implementar estado de carrito en contexto y mostrar contador en el Header.
- Poblar `DesignersPage` con datos reales o crear fichas desde `src/componentes/Designers/`.
- Añadir tests unitarios básicos para componentes críticos.
- Implementar roles cliente/administrador
- Cliente: Debe poder registrarse, añadir productos al carrito y realizar compras de manera simulada
- Administrador: Debe poder iniciar sesion, agregar productos y administrar usuarios


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
