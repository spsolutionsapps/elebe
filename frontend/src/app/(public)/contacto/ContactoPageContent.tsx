'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/contexts/CartContext'
import { motion } from 'framer-motion'
import { Send, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { getApiUrl } from '@/lib/config'
import ProductPlaceholder from '@/components/ProductPlaceholder'
import { useToast } from '@/hooks/useToast'
import { getImageUrl } from '@/lib/imageUtils'

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().optional(),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactoPageContent() {
  const { showSuccess, showError } = useToast()
  const { state, clearCart, updateQuantity, removeItem } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const submitInquiry = useMutation({
    mutationFn: async (data: ContactFormData) => {
      // Incluir productos con sus cantidades del carrito
      const products = state.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity
      }))
      
      // Debug: verificar productos en el carrito
      console.log('Productos en el carrito:', state.items.length)
      console.log('Productos con cantidades a enviar:', products)

      const response = await fetch(getApiUrl('/inquiries'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          products: products,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Error al enviar la consulta')
      }

      return response.json()
    },
    onSuccess: () => {
      reset()
      clearCart()
      showSuccess('Consulta enviada correctamente. Nos pondremos en contacto contigo pronto.')
    },
    onError: (error) => {
      showError('Error al enviar la consulta. Por favor, intenta nuevamente.')
      console.error('Error submitting inquiry:', error)
    },
  })

  const onSubmit = (data: ContactFormData) => {
    submitInquiry.mutate(data)
  }

  return (
    <div className="min-h-screen paddingDesktop62 mt-[62px] md:mt-0" style={{ backgroundColor: '#F3E9CD' }}>
     
      {/* Banner Section */}
      <div className="w-full p-8 relative overflow-hidden flexCentradoContacto" style={{ backgroundColor: '#4FBED5' }}>
        
          <h1 className="text-4xl font-bold text-white mb-4">
            Contáctanos
          </h1>
          <p className="text-lg text-white text-center max-w-2xl mx-auto">
           <em>¿Tienes una idea en mente? </em>
           <br /> Te ayudamos a hacerla realidad con nuestros productos personalizados.
          </p>
       

        <div className='shapeCatalogoIzq'>
          <img src="/catalogo-izquierda.svg" alt="shape catalogo izq" />
        </div>

        <div className='shapeGatoDerecha slideInRight hidden md:block'>
          <img src="/gatoCaja.svg" alt="ShapeCatalogoDer" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex"
          >
            <div className="bg-white p-8 flex-1 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos tu consulta</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                      Tu Nombre*
                    </label>
                    <input
                      id="name"
                      {...register('name')}
                      placeholder="Tu Nombre Completo"
                      className="w-full h-12 px-4 text-gray-900 text-base bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                      Tu Email*
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="tu@email.com"
                      className="w-full h-12 px-4 text-gray-900 text-base bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      placeholder="Tu número de teléfono"
                      className="w-full h-12 px-4 text-gray-900 text-base bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                    />
                </div>

                {/* Message Field */}
                <div>
                    <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">
                      Escribe tu mensaje*
                    </label>
                    <textarea
                      id="message"
                      {...register('message')}
                      placeholder="Cuéntanos más sobre tu consulta..."
                    rows={6}
                    className="w-full px-4 py-3 text-gray-900 text-base bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitInquiry.isPending}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitInquiry.isPending ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    'Enviar Consulta'
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Cart Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex"
          >
            <div className="bg-white p-8 flex-1 flex flex-col">
              <h3 className="text-gray-900 text-2xl font-bold mb-8 flex items-center">
                <ShoppingCart className="mr-3 h-6 w-6 text-blue-600" />
                Productos en tu consulta
              </h3>

              <div className="flex-1">
                {state.items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                    <p className="text-gray-600 text-lg mb-6">No hay productos en tu carrito</p>
                    <a 
                      href="/catalogo"
                      className="inline-block bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors"
                    >
                      Ver Colección
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200">
                        <div className="flex-shrink-0 w-16 h-16">
                          {item.product.image ? (
                            <img
                              src={getImageUrl(item.product.image)}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ProductPlaceholder className="w-full h-full" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 font-medium truncate">
                            {item.product.name}
                          </h4>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center justify-center"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <span className="text-gray-900 font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="w-8 h-8 bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h4 className="text-gray-900 text-xl font-bold mb-6">Información de Contacto</h4>
                <div className="space-y-4">
                  {/* Email y Teléfono en la misma fila en desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 text-sm">Email</h5>
                      <p className="text-gray-600 text-sm">info@lbpremium.com</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 text-sm">Teléfono</h5>
                      <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">Horario de atención</h5>
                    <p className="text-gray-600 text-sm">Lunes a Sábado: 10:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
