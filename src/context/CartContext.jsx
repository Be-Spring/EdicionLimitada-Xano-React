import React, { createContext, useEffect, useState } from 'react'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart')
      // guard against empty string or whitespace which breaks JSON.parse
      if (!raw || !raw.trim()) return []
      return JSON.parse(raw)
    } catch (e) {
      return []
    }
  })

  // UI state for cart drawer
  const [isOpen, setIsOpen] = useState(false)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen((v) => !v)

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items))
    } catch (e) {}
  }, [items])

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.product.id === product.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: Math.min(copy[idx].quantity + quantity, 99) }
        return copy
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    setItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, it) => sum + (it.product.price || 0) * it.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, isOpen, openCart, closeCart, toggleCart }}>
      {children}
    </CartContext.Provider>
  )
}
