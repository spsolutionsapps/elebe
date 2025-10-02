'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, UserPlus } from 'lucide-react'
import { Inquiry, Client } from '@/types'

interface ConvertToClientModalProps {
  isOpen: boolean
  onClose: () => void
  inquiry: Inquiry | null
  onConvert: (clientData: Partial<Client>) => Promise<void>
}

export function ConvertToClientModal({
  isOpen,
  onClose,
  inquiry,
  onConvert,
}: ConvertToClientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    notes: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  // Llenar el formulario con los datos del inquiry cuando se abre
  useEffect(() => {
    if (inquiry && isOpen) {
      const defaultNotes = inquiry.message 
        ? `Cliente convertido desde consulta. Mensaje original: "${inquiry.message}"`
        : 'Cliente convertido desde consulta'
      
      setFormData({
        name: inquiry.name || '',
        email: inquiry.email || '',
        phone: inquiry.phone || '',
        address: '',
        city: '',
        country: '',
        notes: defaultNotes,
      })
    }
  }, [inquiry, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onConvert(formData)
      onClose()
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        notes: '',
      })
    } catch (error) {
      console.error('Error convirtiendo a cliente:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      notes: '',
    })
  }

  if (!isOpen || !inquiry) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between bg-blue-600 text-white p-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-white" />
            <h2 className="text-lg font-semibold text-white">Convertir a Cliente</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 text-white hover:bg-blue-700 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-full"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 rounded-full"
            >
              {isLoading ? 'Convirtiendo...' : 'Convertir a Cliente'}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
