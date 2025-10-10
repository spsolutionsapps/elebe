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

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    
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
    <form action={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          name="email"
          type="email"
          required
          placeholder="Ingresa tu email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-body"
          disabled={isSubmitting}
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-900 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors duration-300 flex items-center justify-center font-body"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Mail className="w-5 h-5" />
        )}
      </Button>
    </form>
  )
}
