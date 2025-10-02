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
      <div className="text-center">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-white font-medium">¡Suscrito correctamente!</p>
        <p className="text-gray-300 text-sm">Gracias por unirte a nuestro newsletter</p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <div className="flex-1">
        <Input
          name="email"
          type="email"
          required
          placeholder="tu@email.com"
          className="bg-transparent border-white/20 text-white placeholder-gray-300 focus:border-white/40"
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-lime-400 hover:bg-lime-500 text-black font-medium px-6 py-2 rounded-full transition-colors"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Suscribirse
          </>
        )}
      </Button>
    </form>
  )
}
