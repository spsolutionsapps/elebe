'use client'

import { toast } from 'react-hot-toast'

export default function ToastExample() {
  const showSuccessToast = () => {
    toast.success('¡Operación exitosa!')
  }

  const showErrorToast = () => {
    toast.error('Algo salió mal')
  }

  const showLoadingToast = () => {
    toast.loading('Cargando...')
  }

  const showPromiseToast = () => {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('¡Éxito!') : reject('Error')
      }, 2000)
    })

    toast.promise(myPromise, {
      loading: 'Procesando...',
      success: '¡Completado!',
      error: 'Algo falló',
    })
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Ejemplos de Toast</h2>
      
      <div className="space-x-2">
        <button 
          onClick={showSuccessToast}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Success Toast
        </button>
        
        <button 
          onClick={showErrorToast}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Error Toast
        </button>
        
        <button 
          onClick={showLoadingToast}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Loading Toast
        </button>
        
        <button 
          onClick={showPromiseToast}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Promise Toast
        </button>
      </div>
    </div>
  )
}
