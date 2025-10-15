'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { subscribeNewsletter } from '@/app/actions/contact'
import { toast } from 'react-hot-toast'
import { Loader2, Mail, CheckCircle } from 'lucide-react'

export function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      await subscribeNewsletter(formData)
      setIsSuccess(true)
      toast.success('¡Te has suscrito correctamente!')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al suscribirse')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-3 py-4">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
        <p className="text-gray-900 font-medium font-body">¡Suscrito correctamente!</p>
        <p className="text-gray-600 text-sm font-body">Gracias por unirte a nuestro newsletter</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center">
      <div className="relative max-w-md w-full">
        <input
          name="email"
          type="email"
          required
          placeholder="Ingresa tu email..."
          className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-lg"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Suscribirse'
          )}
        </button>
      </div>
    </form>
  )
}
