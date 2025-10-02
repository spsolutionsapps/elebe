'use client'

import { useState, useEffect } from 'react'
import { X, ShoppingCart, Trash2 } from 'lucide-react'

interface CartItem {
  id: string
  productId: string
  name: string
  description: string
  image?: string
  price: number
  quantity: number
  notes?: string
  addedAt: string
}

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Cargar carrito al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadCart()
    }
  }, [isOpen])

  const loadCart = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, productData: any) => {
    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          productData
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Recargar el carrito
          await loadCart()
          return { success: true, message: result.message }
        }
      }
      
      return { success: false, message: 'Error agregando al carrito' }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, message: 'Error agregando al carrito' }
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cart/item/${itemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Recargar el carrito
        await loadCart()
        return { success: true }
      }
      
      return { success: false }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        method: 'DELETE'
      })

      if (response.ok) {
        setCartItems([])
        return { success: true }
      }
      
      return { success: false }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Carrito de Consultas</h2>
            {totalItems > 0 && (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Carrito vacío</h3>
              <p className="text-gray-500">Agrega productos para consultar con el admin</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="text-sm text-blue-600">Cantidad: {item.quantity}</p>
                    {item.price > 0 && (
                      <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    disabled={loading}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total: {totalItems} items</span>
              {totalPrice > 0 && (
                <span className="text-lg font-semibold text-blue-600">
                  ${totalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Limpiar Carrito
              </button>
              <button
                onClick={() => {
                  // Aquí se puede implementar la funcionalidad para enviar consulta
                  alert('Funcionalidad de envío de consulta próximamente')
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                Enviar Consulta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
