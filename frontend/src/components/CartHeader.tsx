'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { getCartItems } from '@/app/actions/cart'

export function CartHeader() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const items = await getCartItems()
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalItems)
      } catch (error) {
        console.error('Error cargando carrito:', error)
      }
    }
    
    loadCartCount()
    
    // Recargar cada 5 segundos para mantener sincronizado
    const interval = setInterval(loadCartCount, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Link 
      href="/carrito"
      className="relative flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
    >
      <ShoppingCart className="w-6 h-6" />
      <span className="hidden sm:inline">Carrito</span>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </Link>
  )
}
