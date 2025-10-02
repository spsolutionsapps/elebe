'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AddToCartButton } from './AddToCartButton'
import { ShoppingCart } from 'lucide-react'

export function CartTest() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const stored = localStorage.getItem('lb-premium-cart')
        if (stored) {
          const items = JSON.parse(stored)
          const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0)
          setCartCount(total)
        }
      } catch (error) {
        console.error('Error reading cart:', error)
      }
    }

    updateCartCount()
    
    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      updateCartCount()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // También verificar cada segundo para cambios internos
    const interval = setInterval(updateCartCount, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const clearCart = () => {
    localStorage.removeItem('lb-premium-cart')
    setCartCount(0)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-600">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-white" />
          <span className="text-white font-medium">
            Carrito: {cartCount} items
          </span>
        </div>
        
        <Button
          onClick={clearCart}
          variant="outline"
          size="sm"
          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
        >
          Limpiar
        </Button>
      </div>
      
      <div className="mt-4 space-y-2">
        <p className="text-white text-sm">Prueba agregar productos:</p>
        <div className="flex space-x-2">
          <AddToCartButton
            productId="test-1"
            productName="Producto Test 1"
            productDescription="Descripción del producto test 1"
            productImage="https://via.placeholder.com/300x200"
            productPrice={100}
            size="sm"
          />
          <AddToCartButton
            productId="test-2"
            productName="Producto Test 2"
            productDescription="Descripción del producto test 2"
            productImage="https://via.placeholder.com/300x200"
            productPrice={200}
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}
