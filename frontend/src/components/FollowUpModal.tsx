'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
// Select components removed - using native select elements instead
import { X, Phone, Mail, MessageSquare, Calendar, FileText } from 'lucide-react'

interface FollowUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: FollowUpData) => void
  inquiryName: string
}

interface FollowUpData {
  type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'note' | ''
  description: string
  outcome: 'positive' | 'negative' | 'neutral' | 'scheduled' | ''
  nextAction?: string
}

export function FollowUpModal({ isOpen, onClose, onSave, inquiryName }: FollowUpModalProps) {
  const [formData, setFormData] = useState<FollowUpData>({
    type: 'call',
    description: '',
    outcome: 'neutral',
    nextAction: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      type: 'call',
      description: '',
      outcome: 'neutral',
      nextAction: '',
    })
    onClose()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return '📞'
      case 'email':
        return '📧'
      case 'whatsapp':
        return '💬'
      case 'meeting':
        return '📅'
      case 'note':
        return '📝'
      default:
        return '📝'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="w-full max-w-md bg-white rounded-none shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="rounded-none">
            <CardHeader className="text-white rounded-none" style={{ background: 'linear-gradient( #2563eb, #1d4ed8)' }}>
              <CardTitle className="flex justify-between items-center text-white">
                <div className="flex items-center">
                  <span className="text-lg">{getTypeIcon(formData.type)}</span>
                  <span className="ml-2 text-white">Seguimiento - {inquiryName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-blue-700">
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Tipo de contacto</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as FollowUpData['type'] })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="call">📞 Llamada</option>
                    <option value="email">📧 Email</option>
                    <option value="whatsapp">💬 WhatsApp</option>
                    <option value="meeting">📅 Reunión</option>
                    <option value="note">📝 Nota</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el contacto realizado..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="outcome">Resultado</Label>
                  <select
                    id="outcome"
                    value={formData.outcome}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value as FollowUpData['outcome'] })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Seleccionar resultado</option>
                    <option value="positive">✅ Positivo</option>
                    <option value="negative">❌ Negativo</option>
                    <option value="neutral">⚪ Neutral</option>
                    <option value="scheduled">📅 Programado</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Guardar Seguimiento
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
