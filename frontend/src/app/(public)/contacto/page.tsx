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

export default function ContactoPage() {
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

      const response = await fetch(`http://localhost:3001/api/inquiries`, {
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
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="text-center py-16 py-header contact-header-overlay">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-blue font-semibold mb-4 font-body text-5xl contact-title">
            Contáctanos
          </h1>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="mx-auto pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="p-8 rounded-2xl contact-form-bg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white text-lg font-medium mb-3 font-body">
                      Tu Nombre*
                    </label>
                    <input
                      id="name"
                      {...register('name')}
                      placeholder="Tu Nombre Completo"
                      className="w-full h-14 px-4 text-white text-lg bg-gray-800 input-custom placeholder-gray-400 font-body"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-2 font-body">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white text-lg font-medium mb-3 font-body">
                      Tu Email*
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="tu@email.com"
                      className="w-full h-14 px-4 text-white text-lg bg-gray-800 input-custom placeholder-gray-400 font-body"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-2 font-body">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                    <label htmlFor="phone" className="block text-white text-lg font-medium mb-3 font-body">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      placeholder="Tu número de teléfono"
                      className="w-full h-14 px-4 text-white text-lg bg-gray-800 input-custom placeholder-gray-400 font-body"
                    />
                </div>

                {/* Message Field */}
                <div>
                    <label htmlFor="message" className="block text-white text-lg font-medium mb-3 font-body">
                      Escribe tu mensaje*
                    </label>
                    <textarea
                      id="message"
                      {...register('message')}
                      placeholder="Cuéntanos más sobre tu consulta..."
                    rows={6}
                    className="w-full px-4 py-4 text-white text-lg bg-gray-800 input-custom placeholder-gray-400 resize-none font-body"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitInquiry.isPending}
                  className="w-full h-14 bg-blue hover:opacity-90 text-white font-bold text-lg rounded-xl transition-colors duration-300 font-body disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitInquiry.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Enviando...
                    </div>
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
          >
            <div className="p-8 rounded-2xl contact-form-bg">
              <h3 className="text-white text-2xl font-bold mb-8 flex items-center font-heading">
                <ShoppingCart className="mr-3 h-6 w-6" />
                Productos en tu consulta
              </h3>

              {state.items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-500 mx-auto mb-6" />
                  <p className="text-gray-400 text-lg mb-6 font-body">No hay productos en tu carrito</p>
                  <a 
                    href="/catalogo"
                    className="inline-block bg-blue text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-body"
                  >
                    Ver Colección
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {state.items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                      <div className="flex-shrink-0 w-16 h-16">
                        {item.product.image ? (
                          <img
                            src={getImageUrl(item.product.image)}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <ProductPlaceholder className="w-full h-full" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate font-body">
                          {item.product.name}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="text-white font-medium w-8 text-center font-body">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="w-8 h-8 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Info */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <h4 className="text-white text-xl font-bold mb-6 font-heading">Información de Contacto</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-white font-body">Email</h5>
                    <p className="text-gray-400 font-body">info@lbpremium.com</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white font-body">Teléfono</h5>
                    <p className="text-gray-400 font-body">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-white font-body">Horario de atención</h5>
                    <p className="text-gray-400 font-body">Lunes a Sábado: 10:00 AM - 8:00 PM</p>
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
