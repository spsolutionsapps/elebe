'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  // Usar any para evitar problemas de TypeScript con react-hot-toast
  const ToastComponent = Toaster as any
  
  return <ToastComponent position="top-right" />
}
