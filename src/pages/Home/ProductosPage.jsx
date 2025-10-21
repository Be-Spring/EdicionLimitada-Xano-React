import React from 'react'
import ProductGridFetch from '../../componentes/Products/ProductGridFetch.jsx'

// Página de productos que muestra el grid de productos desde Xano
const ProductosPage = () => {
  // Obtener el token de autenticación desde localStorage si existe
  const authUser = localStorage.getItem('auth_user')
  let token = null
  
  try {
    if (authUser) {
      const user = JSON.parse(authUser)
      token = user?.authToken || null
    }
  } catch (e) {
    console.error('Error al parsear auth_user:', e)
  }

  return (
    <div className="productos-page py-4">
      <ProductGridFetch token={token} />
    </div>
  )
}

export default ProductosPage
