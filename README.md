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

## Qué cambié / añadí
- Envolví la app en `BrowserRouter` y configuré rutas (SPA):
  - `src/main.jsx` — ahora importa `BrowserRouter`.
  - `src/App.jsx` — ahora usa `Routes` / `Route` y mantiene el estado global mínimo y el modal.
- Páginas creadas en `src/pages/`:
  - `Home.jsx` (Hero + ProductsSection + FormularioContacto)
  - `ProductsPage.jsx` (muestra `ProductGridFetch`)
  - `DesignersPage.jsx` (placeholder para diseñadores)
- Componentes añadidos/ajustados en `src/componentes/`:
  - `ProductCard.jsx`, `ProductGridFetch.jsx`, `ProductModal.jsx` (modal controlado por React)
  - `Header.jsx` actualizado para usar `Link`/`NavLink` de `react-router-dom`
  - `Products/ProductsSection.jsx` y `Products/ProductModal.jsx` (modularizado)
  - `FormularioContacto.jsx` ya incluido como componente reutilizable
- Se estandarizaron exportaciones (se añadieron `export default` donde era práctico) para evitar errores de importación en tiempo de ejecución.
- Apliqué correcciones temporales y luego las revertí; también añadí overrides seguros en CSS para evitar overlays por defecto que oculten la UI.

## Cómo probar rápidamente
1. Arranca el dev server (`npm run dev`).
2. Abre `http://localhost:5173/` (o el puerto que indique Vite).
3. Navega por las rutas (en el header):
   - `/` → Home
   - `/productos` → lista de productos (demo con items de ejemplo)
   - `/disenadores` → página de diseñadores (placeholder)
4. En la página de productos haz click en una tarjeta para abrir el modal.

## Troubleshooting
- Si la página aparece en blanco: abre DevTools (F12) y mira la consola para errores JS. Copia cualquier error y pégalo en la conversación.
- Si ves problemas con `npm` en PowerShell: usa `npm.cmd` como se indica arriba.
- Si el modal no abre: confirma que no haya overlays invisibles (en `src/App.css` hay overrides seguros para `.sidebar-overlay` y `.toast-container`).

## Siguientes pasos sugeridos
- Implementar estado de carrito en contexto y mostrar contador en el Header.
- Poblar `DesignersPage` con datos reales o crear fichas desde `src/componentes/Designers/`.
- Añadir tests unitarios básicos para componentes críticos.

Si quieres, hago el commit por ti con estos cambios y preparo un branch listo para revisión. Actualmente voy a crear un commit "limpio" con los cambios aplicados.
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
