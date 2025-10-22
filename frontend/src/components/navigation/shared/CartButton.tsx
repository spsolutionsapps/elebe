'use client'

import { ShoppingCart } from 'lucide-react'
import { CartButtonProps } from './types'

export function CartButton({ itemCount, onToggle }: CartButtonProps) {
  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#004CAC' }}
      >
        <ShoppingCart className="h-6 w-6 text-white" />
      </button>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </div>
  )
}
