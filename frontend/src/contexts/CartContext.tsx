'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Product, CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  sessionId: string
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'ADD_ITEM_WITH_QUANTITY'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  isOpen: false,
  sessionId: '',
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id)
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      
      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
      }
    }
    
    case 'ADD_ITEM_WITH_QUANTITY': {
      const existingItem = state.items.find(item => item.product.id === action.payload.product.id)
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }
      
      return {
        ...state,
        items: [...state.items, { product: action.payload.product, quantity: action.payload.quantity }],
      }
    }
    
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload),
      }
    }
    
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    }
    
    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
      }
    }
    
    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    }
    
    case 'LOAD_CART': {
      return {
        ...state,
        items: action.payload,
      }
    }
    
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (product: Product) => void
  addItemWithQuantity: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  addToCart: (product: Product) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    // Solo ejecutar en el cliente, no durante SSR
    if (typeof window === 'undefined') {
      return
    }
    
    // Generar sessionId si no existe
    let sessionId = localStorage.getItem('cartSessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('cartSessionId', sessionId)
    }
    
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Solo ejecutar en el cliente, no durante SSR
    if (typeof window === 'undefined') {
      return
    }
    
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }

  const addItemWithQuantity = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', payload: { product, quantity } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    // Los productos ya no tienen precio, retornar 0
    return 0
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        addItemWithQuantity,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        getTotalItems,
        getTotalPrice,
        addToCart: addItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    // Durante SSR, retornar valores por defecto
    if (typeof window === 'undefined') {
      return {
        state: { items: [], isOpen: false, sessionId: '' },
        addItem: () => {},
        addItemWithQuantity: () => {},
        removeItem: () => {},
        updateQuantity: () => {},
        clearCart: () => {},
        toggleCart: () => {},
        getTotalItems: () => 0,
        getTotalPrice: () => 0,
        addToCart: () => {}
      }
    }
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
