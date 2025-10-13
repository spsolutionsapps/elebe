'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitContact } from '@/app/actions/contact'
import { toast } from 'react-hot-toast'
import { Loader2, Send, CheckCircle } from 'lucide-react'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      await submitContact(formData)
      setIsSuccess(true)
      toast.success('¡Mensaje enviado correctamente!')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al enviar el mensaje')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
          <p className="text-gray-300 mb-6">
            Gracias por contactarnos. Te responderemos pronto.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black"
          >
            Enviar otro mensaje
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white text-center">
          Contáctanos
        </CardTitle>
        <p className="text-gray-300 text-center">
          Cuéntanos sobre tu proyecto y te ayudaremos a hacerlo realidad
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nombre *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                className="bg-transparent border-gray-600 text-white placeholder-gray-400"
                placeholder="Tu nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-transparent border-gray-600 text-white placeholder-gray-400"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Teléfono
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              className="bg-transparent border-gray-600 text-white placeholder-gray-400"
              placeholder="+54 9 11 1234-5678"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              Mensaje *
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={5}
              className="bg-transparent border-gray-600 text-white placeholder-gray-400 resize-none"
              placeholder="Cuéntanos sobre tu proyecto, cantidad de artículos, fechas importantes, etc."
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
