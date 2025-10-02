'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  FileText,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  updateCartItemNotes,
  clearCart,
  getCartItems,
  submitInquiry,
  CartItem
} from '@/app/actions/cart'
import { toast } from 'react-hot-toast'
import { OptimizedImage } from './OptimizedImage'

interface CartProps {
  initialItems?: CartItem[]
}

export function Cart({ initialItems = [] }: CartProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Cargar items del carrito
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const cartItems = await getCartItems()
        setItems(cartItems)
      } catch (error) {
        console.error('Error cargando carrito:', error)
      }
    }
    loadCartItems()
  }, [])

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      await updateCartItemQuantity(productId, newQuantity)
      setItems(prev => 
        prev.map(item => 
          item.id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        ).filter(item => item.quantity > 0)
      )
      toast.success('Cantidad actualizada')
    } catch (error) {
      toast.error('Error actualizando cantidad')
    }
  }

  const handleNotesChange = async (productId: string, notes: string) => {
    try {
      await updateCartItemNotes(productId, notes)
      setItems(prev => 
        prev.map(item => 
          item.id === productId 
            ? { ...item, notes }
            : item
        )
      )
    } catch (error) {
      toast.error('Error actualizando notas')
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId)
      setItems(prev => prev.filter(item => item.id !== productId))
      toast.success('Producto eliminado')
    } catch (error) {
      toast.error('Error eliminando producto')
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart()
      setItems([])
      toast.success('Carrito vaciado')
    } catch (error) {
      toast.error('Error vaciando carrito')
    }
  }

  const handleSubmitInquiry = async (formData: FormData) => {
    setIsSubmitting(true)
    
    try {
      await submitInquiry(formData)
      setIsSuccess(true)
      setItems([])
      toast.success('¡Consulta enviada correctamente!')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al enviar consulta')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">¡Consulta Enviada!</h3>
          <p className="text-gray-300 mb-6">
            Hemos recibido tu consulta con los productos seleccionados. Te contactaremos pronto.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black"
          >
            Hacer nueva consulta
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Carrito Vacío</h3>
          <p className="text-gray-300 mb-6">
            Agrega productos para hacer una consulta personalizada
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Ver Productos
          </Button>
        </CardContent>
      </Card>
    )
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header del Carrito */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-2xl font-bold text-white">
                Carrito de Consulta
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
              </span>
              <Button
                onClick={handleClearCart}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vaciar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de Productos */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Imagen del Producto */}
                <div className="w-full md:w-32 h-32 flex-shrink-0">
                  {item.image ? (
                    <OptimizedImage
                      src={item.image}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Sin imagen</span>
                    </div>
                  )}
                </div>

                {/* Información del Producto */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                    {item.price && (
                      <p className="text-blue-400 font-medium">
                        ${item.price.toLocaleString()} c/u
                      </p>
                    )}
                  </div>

                  {/* Controles de Cantidad */}
                  <div className="flex items-center space-x-3">
                    <Label className="text-white">Cantidad:</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-white font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Notas del Producto */}
                  <div>
                    <Label htmlFor={`notes-${item.id}`} className="text-white text-sm">
                      Notas específicas (opcional):
                    </Label>
                    <Textarea
                      id={`notes-${item.id}`}
                      value={item.notes || ''}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      placeholder="Especificaciones, colores, tamaños, etc."
                      className="bg-transparent border-gray-600 text-white placeholder-gray-400 resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Botón Eliminar */}
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleRemoveItem(item.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulario de Consulta */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Información de Contacto
          </CardTitle>
          <p className="text-gray-300">
            Completa tus datos para que podamos contactarte con la cotización
          </p>
        </CardHeader>
        <CardContent>
          <form action={handleSubmitInquiry} className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="company" className="text-white">
                  Empresa
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  className="bg-transparent border-gray-600 text-white placeholder-gray-400"
                  placeholder="Nombre de tu empresa"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">
                Mensaje adicional *
              </Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={4}
                className="bg-transparent border-gray-600 text-white placeholder-gray-400 resize-none"
                placeholder="Cuéntanos más detalles sobre tu proyecto, fechas importantes, cantidades aproximadas, etc."
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
                  Enviando Consulta...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Enviar Consulta ({totalItems} productos)
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
