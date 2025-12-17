'use client'

import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getImageUrl } from '@/lib/config'
import ProductPlaceholder from './ProductPlaceholder'

export function CartSidebar() {
  const { 
    state, 
    toggleCart, 
    removeItem, 
    updateQuantity, 
    getTotalPrice,
    clearCart 
  } = useCart()

  if (!state.isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={toggleCart}
        className="fixed inset-0 bg-black bg-opacity-50 z-[99999]"
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-[99999] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Carrito de Consulta</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCart}
            className="h-8 w-8 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Tu carrito está vacío</p>
              <Link href="/catalogo">
                <Button 
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white radius0 border-blue-600"
                  style={{
                    backgroundColor: '#2563eb',
                    borderColor: '#2563eb'
                  }}
                >
                  Ver productos
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-shrink-0 w-16 h-16">
                    {item.product.image ? (
                      <img
                        src={getImageUrl(item.product.image)}
                        alt={item.product.name}
                        className="w-full h-full object-contain rounded-md"
                      />
                    ) : (
                      <ProductPlaceholder className="w-full h-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {Array.isArray(item.product.category) ? item.product.category.join(', ') : item.product.category}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                      className="h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white border-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Productos:</span>
              <span className="text-lg font-semibold">
                {state.items.length} {state.items.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>
            
            <div className="space-y-1">
              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full bg-transparent border-black text-black radius0"
              >
                Vaciar carrito
              </Button>
              
              <Link href="/contacto">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 radius0 text-white border-blue-600 mt-1" 
                  onClick={toggleCart}
                  style={{
                    backgroundColor: '#2563eb',
                    borderColor: '#2563eb',
                    marginTop: '5px'
                  }}
                >
                  Enviar consulta
                </Button>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}
