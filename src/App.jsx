import React, { createContext, useEffect, useState } from 'react'
import './App.css'

import Header from "./componentes/Header.jsx"
import FlashMessage from './componentes/FlashMessage.jsx'
import Hero from "./componentes/Hero.jsx"
import Footer from "./componentes/Footer.jsx"
import ContentArea from './componentes/ContentArea.jsx'
import Disenadores from './componentes/Diseñadores/Diseñadores.jsx'
import DesignerPage from './componentes/DesignerPage.jsx'
import EdicionLimitada from './componentes/EdicionLimitada/EdicionLimitada.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Carrito from './componentes/Carrito.jsx'
import { Routes, Route, useLocation } from 'react-router-dom'
import InicioSesion from './componentes/Sesion/InicioSesion.jsx'
import RegistroSesion from './componentes/Sesion/RegistroSesion.jsx'
import FormularioContacto from './componentes/FormularioContacto.jsx'
import Administrador from './pages/Administracion/Administrador.jsx'
import ProductosAdmin from './pages/Administracion/ProductosAdmin.jsx'
import DiseñadorAdmin from './pages/Administracion/DiseñadorAdmin.jsx'
import AddDiseñadorAdmin from './pages/Administracion/AddDiseñadorAdmin.jsx'
import InventarioAdmin from './pages/Administracion/InventarioAdmin.jsx'
import AdminDashboard from './pages/Administracion/AdminDashboard.jsx'
import ClientesAdmin from './pages/Administracion/ClientesAdmin.jsx'
import Home from './pages/Home/Home.jsx'
import ProductosPage from './pages/Home/ProductosPage.jsx'


// Simple context example
export const AppContext = createContext()

export default function App() {
  const [user, setUser] = useState(null)
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/administrador')

  useEffect(() => {
    // Simular carga de usuario
    const timer = setTimeout(() => setUser({ name: 'Visitante' }), 300)
    console.log('App useEffect: mounted, starting user load timer')
    return () => clearTimeout(timer)
  }, [])

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <AuthProvider>
        <CartProvider>
          <div className="app-root bg-black text-light min-vh-100">
            {!isAdminRoute && <Header />}
            {!isAdminRoute && <FlashMessage />}

          <ContentArea>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/disenadores" element={<Disenadores />} />
              <Route path="/disenadores/:slug" element={<DesignerPage />} />
              <Route path="/edicionlimitada" element={<EdicionLimitada />} />
              <Route path="/administrador" element={<Administrador />}>
                <Route index element={<AdminDashboard />} />
                <Route path="productos" element={<ProductosAdmin />} />
                <Route path="disenadores" element={<DiseñadorAdmin />} />
                <Route path="disenadores/add" element={<AddDiseñadorAdmin />} />
                <Route path="disenadores/edit/:id" element={<AddDiseñadorAdmin />} />
                <Route path="clientes" element={<ClientesAdmin />} />
                <Route path="inventario" element={<InventarioAdmin />} />
              </Route>
              <Route path="/contacto" element={<FormularioContacto />} />
              <Route path="/sesion/inicioSesion" element={<InicioSesion />} />
              <Route path="/sesion/RegistroSesion" element={<RegistroSesion />} />
              {/* other routes (designers, contacto) can be added here */}
            </Routes>
          </ContentArea>

          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <Carrito />}
        </div>
        </CartProvider>
      </AuthProvider>
    </AppContext.Provider>
  )
}