'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCart } from '@/contexts/CartContext'

interface AddToCartButtonProps {
  productId: string
  productName: string
  productDescription: string
  productImage?: string
  productPrice?: number
  quantity?: number
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
}

export function AddToCartButton({
  productId,
  productName,
  productDescription,
  productImage,
  productPrice,
  quantity = 1,
  className = '',
  variant = 'default',
  size = 'default'
}: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const { addItemWithQuantity } = useCart()

  const handleAddToCart = async () => {
    try {
      // Crear objeto Product para el contexto
      const product = {
        id: productId,
        name: productName,
        description: productDescription,
        image: productImage,
        price: productPrice,
        category: 'Oficina',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      addItemWithQuantity(product, quantity)
      setIsAdded(true)
      toast.success('Producto agregado a consultas')
      
      // Resetear estado después de 2 segundos
      setTimeout(() => {
        setIsAdded(false)
      }, 2000)
    } catch (error) {
      toast.error('Error al agregar producto')
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdded}
      variant="default"
      size={size}
      className={`rounded-full transition-all duration-200 ${
        isAdded 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      } ${className}`}
      style={{
        backgroundColor: isAdded ? '#004CAC' : '#2563eb',
      }}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Agregado
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Agregar al Carrito
        </>
      )}
    </Button>
  )
}

// Botón compacto para sliders
export function AddToCartButtonCompact({
  productId,
  productName,
  productDescription,
  productImage,
  productPrice,
  quantity = 1,
  className = ''
}: Omit<AddToCartButtonProps, 'variant' | 'size'>) {
  const [isAdded, setIsAdded] = useState(false)
  const { addItemWithQuantity } = useCart()

  const handleAddToCart = async () => {
    try {
      // Crear objeto Product para el contexto
      const product = {
        id: productId,
        name: productName,
        description: productDescription,
        image: productImage,
        price: productPrice,
        category: 'Oficina',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      addItemWithQuantity(product, quantity)
      setIsAdded(true)
      toast.success('Producto agregado a consultas')
      
      setTimeout(() => {
        setIsAdded(false)
      }, 2000)
    } catch (error) {
      toast.error('Error al agregar producto')
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdded}
      size="sm"
      className={`w-full rounded-full transition-all duration-200 ${
        isAdded 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      } ${className}`}
      style={{
        backgroundColor: isAdded ? '#16a34a' : '#2563eb',
        borderColor: isAdded ? '#16a34a' : '#2563eb'
      }}
    >
      {isAdded ? (
        <>
          <Check className="w-3 h-3 mr-1" />
          Agregado
        </>
      ) : (
        <>
          <Plus className="w-3 h-3 mr-1" />
          Agregar
        </>
      )}
    </Button>
  )
}