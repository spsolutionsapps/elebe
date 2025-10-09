'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, Clock, Plus, Edit, Trash2, CheckCircle, AlertTriangle, Bell, X, Users, DollarSign, MessageSquare, Grid3X3, CalendarDays } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { Pagination } from '@/components/ui/pagination'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { getApiUrl } from '@/lib/config'
import { ConfirmModal } from '@/components/ConfirmModal'
import { useModal } from '@/hooks/useModal'

interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: Date | string; // Puede ser Date o string del backend
  time: string;
  type: 'appointment' | 'follow_up' | 'payment' | 'general';
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  clientId?: string;
  clientName?: string;
  alertMinutes: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Helper function para manejar fechas de manera consistente
const formatDateForInput = (date: Date | string): string => {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0]
  } else if (typeof date === 'string') {
    const parsedDate = new Date(date)
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split('T')[0]
    } else {
      return date.split('T')[0]
    }
  }
  return ''
}

export default function RemindersPage() {
  const { showSuccess, showError, showLoading, dismiss } = useToast()
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useModal()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('cards')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'general' as 'appointment' | 'follow_up' | 'payment' | 'general',
    priority: 'medium' as 'low' | 'medium' | 'high',
    clientName: '',
    alertMinutes: 15
  })
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null)

  useEffect(() => {
    fetchReminders()
  }, [])

  // Verificar recordatorios pendientes cada minuto
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()
      
      reminders.forEach(reminder => {
        if (!reminder.isCompleted) {
          const reminderDate = new Date(reminder.date)
          const reminderTime = reminder.time.split(':')
          const reminderMinutes = parseInt(reminderTime[0]) * 60 + parseInt(reminderTime[1])
          
          // Verificar si es el día correcto y la hora está dentro del rango de alerta
          const isToday = reminderDate.toDateString() === now.toDateString()
          const timeDiff = Math.abs(currentTime - reminderMinutes)
          
          if (isToday && timeDiff <= reminder.alertMinutes) {
            setCurrentReminder(reminder)
            setShowNotificationModal(true)
          }
        }
      })
    }

    // Verificar inmediatamente
    checkReminders()
    
    // Verificar cada minuto
    const interval = setInterval(checkReminders, 60000)
    
    return () => clearInterval(interval)
  }, [reminders])

  const fetchReminders = async () => {
    try {
      const response = await fetch(getApiUrl('/reminders'))
      const data = await response.json()
      setReminders(data)
    } catch (error) {
      console.error('Error fetching reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingReminder 
        ? getApiUrl(`/reminders/${editingReminder.id}`)
        : getApiUrl('/reminders')
      
      const method = editingReminder ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Crear la fecha correctamente combinando date y time
          date: new Date(`${formData.date}T${formData.time || '00:00'}`),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        showSuccess(result.message)
        resetForm()
        fetchReminders()
      }
    } catch (error) {
      console.error('Error saving reminder:', error)
      showError('Error al guardar el recordatorio')
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este recordatorio? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger'
    })

    if (!confirmed) return

    try {
      const response = await fetch(getApiUrl(`/reminders/${id}`), {
        method: 'DELETE',
      })

      if (response.ok) {
        showSuccess('Recordatorio eliminado correctamente')
        fetchReminders()
      }
    } catch (error) {
      console.error('Error deleting reminder:', error)
      showError('Error al eliminar el recordatorio')
    }
  }

  const handleComplete = async (id: string) => {
    try {
      const response = await fetch(getApiUrl(`/reminders/${id}/complete`), {
        method: 'PUT',
      })

      if (response.ok) {
        showSuccess('Recordatorio marcado como completado')
        fetchReminders()
      }
    } catch (error) {
      console.error('Error completing reminder:', error)
      showError('Error al marcar como completado')
    }
  }

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      date: formatDateForInput(reminder.date),
      time: reminder.time,
      type: reminder.type,
      priority: reminder.priority,
      clientName: reminder.clientName || '',
      alertMinutes: reminder.alertMinutes
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'general',
      priority: 'medium',
      clientName: '',
      alertMinutes: 15
    })
    setEditingReminder(null)
    setSelectedDate(null)
    setShowForm(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return '📅'
      case 'follow_up': return '👥'
      case 'payment': return '💰'
      default: return '🔔'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'appointment': return 'Cita'
      case 'follow_up': return 'Seguimiento'
      case 'payment': return 'Pago'
      default: return 'General'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Media'
      case 'low': return 'Baja'
      default: return 'Media'
    }
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isUpcoming = (reminder: Reminder) => {
    const reminderDate = new Date(reminder.date + ' ' + reminder.time)
    const now = new Date()
    const diffMs = reminderDate.getTime() - now.getTime()
    const diffMins = Math.round(diffMs / 60000)
    return diffMins > 0 && diffMins <= reminder.alertMinutes
  }

  const upcomingReminders = reminders.filter(isUpcoming)

  // Pagination logic
  const totalPages = Math.ceil(reminders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedReminders = reminders.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    // Abrir modal de nuevo recordatorio con la fecha seleccionada
    const dateString = formatDateForInput(date)
    setFormData({
      title: '',
      description: '',
      date: dateString,
      time: '',
      type: 'general',
      priority: 'medium',
      clientName: '',
      alertMinutes: 15
    })
    setEditingReminder(null)
    setShowForm(true)
  }

  const handleReminderClick = (reminder: Reminder) => {
    handleEdit(reminder)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recordatorios y Calendario</h1>
        <div className="flex items-center space-x-3">
          {/* Toggle de vista */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('cards')}
              className={`h-8 px-4 border border-[#64748b] text-[#64748b] rounded-full ${
                viewMode === 'cards' 
                  ? 'bg-black text-white border-black hover:bg-black hover:text-white hover:border-black' 
                  : 'bg-transparent hover:bg-black hover:text-white hover:border-black'
              }`}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Tarjetas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('calendar')}
              className={`h-8 px-4 border border-[#64748b] text-[#64748b] rounded-full ${
                viewMode === 'calendar' 
                  ? 'bg-black text-white border-black hover:bg-black hover:text-white hover:border-black' 
                  : 'bg-transparent hover:bg-black hover:text-white hover:border-black'
              }`}
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Calendario
            </Button>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            style={{
              backgroundColor: '#2563eb',
              borderColor: '#2563eb'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Recordatorio
          </Button>
        </div>
      </div>

      {/* Alertas de proximidad mejoradas */}
      {upcomingReminders.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-orange-600 rounded-xl mr-4">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-900">Recordatorios Próximos</h3>
              <p className="text-orange-700">Tienes {upcomingReminders.length} recordatorio{upcomingReminders.length !== 1 ? 's' : ''} próximos</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      {getTypeIcon(reminder.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">{reminder.title}</h4>
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(reminder.priority)}`}>
                          {getPriorityLabel(reminder.priority)}
                        </span>
                        <span className="text-sm text-gray-600">{getTypeLabel(reminder.type)}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(reminder.date)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {reminder.time}
                        </span>
                      </div>
                      {reminder.clientName && (
                        <p className="text-sm text-blue-600 mt-2">Cliente: {reminder.clientName}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleComplete(reminder.id)}
                    className="bg-orange-600 hover:bg-orange-700 rounded-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de formulario mejorado */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ marginTop: '-24px' }} onClick={resetForm}>
          <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <Card className="h-full flex flex-col shadow-2xl border-0 bg-white rounded-none p-0" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <CardHeader className="text-white border-b-0 p-6 rounded-none" style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)' }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Bell className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-white">
                        {editingReminder ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
                      </CardTitle>
                      <p className="text-blue-100 text-sm mt-1">
                        {editingReminder 
                          ? `Editando: ${editingReminder.title}` 
                          : selectedDate 
                            ? `Recordatorio para el ${selectedDate.toLocaleDateString('es-ES')}`
                            : 'Completa la información del recordatorio'
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="text-white hover:bg-white/20 hover:text-white rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              {/* Contenido del formulario */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-6">
                  {/* Título y Tipo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título *
                      </label>
                      <Input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Título del recordatorio"
                        className="border-gray-300 pl-3"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo
                      </label>
                      <select 
                        value={formData.type} 
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'appointment' | 'follow_up' | 'payment' | 'general' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General</option>
                        <option value="appointment">Cita</option>
                        <option value="follow_up">Seguimiento</option>
                        <option value="payment">Pago</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Fecha, Hora, Prioridad y Alerta en una línea */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha *
                      </label>
                      <Input
                        required
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="border-gray-300 pl-3"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora *
                      </label>
                      <Input
                        required
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="border-gray-300 pl-3"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prioridad
                      </label>
                      <select 
                        value={formData.priority} 
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alerta (min)
                      </label>
                      <Input
                        type="number"
                        value={formData.alertMinutes}
                        onChange={(e) => setFormData({ ...formData, alertMinutes: parseInt(e.target.value) })}
                        placeholder="15"
                        className="border-gray-300 pl-3"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente (opcional)
                    </label>
                    <Input
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="Nombre del cliente"
                      className="border-gray-300 pl-3"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descripción del recordatorio..."
                      rows={4}
                      className="border-gray-300 pl-3"
                    />
                  </div>
                </div>

                {/* Botones dentro del formulario */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={resetForm} className="rounded-full">
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                    style={{
                      backgroundColor: '#2563eb',
                      borderColor: '#2563eb'
                    }}
                  >
                    {editingReminder ? 'Actualizar Recordatorio' : 'Crear Recordatorio'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* Vista de Calendario */}
      {viewMode === 'calendar' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {reminders.length} recordatorio{reminders.length !== 1 ? 's' : ''} en total
            </div>
            {selectedDate && (
              <div className="text-sm text-blue-600">
                Fecha seleccionada: {selectedDate.toLocaleDateString('es-ES')}
              </div>
            )}
          </div>
          
          <CalendarComponent
            reminders={reminders}
            onDateClick={handleDateClick}
            onReminderClick={handleReminderClick}
            className="w-full"
          />
        </div>
      ) : (
        /* Vista de Tarjetas */
        <div className="space-y-6">
          {/* Controles y búsqueda */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="text-sm text-gray-600 whitespace-nowrap">
                {reminders.length} recordatorio{reminders.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Grid de tarjetas de recordatorios */}
          {reminders.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Bell className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay recordatorios
              </h3>
              <p className="text-gray-600 mb-6">
                Los recordatorios que crees aparecerán aquí.
              </p>
              <Button onClick={() => setShowForm(true)} className="rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Recordatorio
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {paginatedReminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className={`relative p-3 border rounded-md transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer ${
                    isUpcoming(reminder) 
                      ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {/* Header con icono y prioridad */}
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-1.5 rounded-md ${isUpcoming(reminder) ? 'bg-orange-200' : 'bg-blue-100'}`}>
                      {getTypeIcon(reminder.type)}
                    </div>
                    <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${getPriorityColor(reminder.priority)}`}>
                      {getPriorityLabel(reminder.priority)}
                    </span>
                  </div>

                  {/* Título */}
                  <h4 className="font-bold text-gray-900 mb-1.5 text-xs leading-tight overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {reminder.title}
                  </h4>

                  {/* Tipo */}
                  <div className="mb-2">
                    <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {getTypeLabel(reminder.type)}
                    </span>
                  </div>

                  {/* Fecha y hora */}
                  <div className="space-y-0.5 mb-2">
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="h-2.5 w-2.5 mr-1" />
                      {formatDate(reminder.date)}
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Clock className="h-2.5 w-2.5 mr-1" />
                      {reminder.time}
                    </div>
                  </div>

                  {/* Cliente */}
                  {reminder.clientName && (
                    <div className="mb-2">
                      <div className="flex items-center text-xs text-blue-600">
                        <Users className="h-2.5 w-2.5 mr-1" />
                        <span className="truncate">{reminder.clientName}</span>
                      </div>
                    </div>
                  )}

                  {/* Descripción (truncada) */}
                  {reminder.description && (
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                      {reminder.description}
                    </p>
                  )}

                  {/* Botones de acción */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                    <div className="flex space-x-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(reminder)}
                        className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full aspect-square flex items-center justify-center"
                      >
                        <Edit className="h-2.5 w-2.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleComplete(reminder.id)}
                        className="h-6 w-6 p-0 text-green-600 hover:bg-green-50 rounded-full aspect-square flex items-center justify-center"
                      >
                        <CheckCircle className="h-2.5 w-2.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(reminder.id)}
                        className="h-6 w-6 p-0 bg-red-600 hover:bg-red-700 text-white hover:text-white rounded-full aspect-square flex items-center justify-center"
                      >
                        <Trash2 className="h-2.5 w-2.5 text-white" />
                      </Button>
                    </div>
                    
                    {/* Indicador de proximidad */}
                    {isUpcoming(reminder) && (
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {reminders.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="text-sm text-gray-600">
                  {reminders.length > itemsPerPage && (
                    <span className="text-blue-600">
                      Página {currentPage} de {totalPages} - {itemsPerPage} por página
                    </span>
                  )}
                </div>
                {/* Items per page selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Mostrar:</span>
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-600">por página</span>
                </div>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={reminders.length}
                showInfo={true}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal de notificación de recordatorio */}
      {showNotificationModal && currentReminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recordatorio</h3>
                <p className="text-sm text-gray-600">Es hora de tu recordatorio</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">{currentReminder.title}</h4>
                {currentReminder.description && (
                  <p className="text-sm text-gray-600 mt-1">{currentReminder.description}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(currentReminder.date).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{currentReminder.time}</span>
                </div>
              </div>
              
              {currentReminder.clientName && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Cliente: {currentReminder.clientName}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => {
                  setShowNotificationModal(false)
                  setCurrentReminder(null)
                }}
                variant="outline"
                className="flex-1"
              >
                Recordar más tarde
              </Button>
              <Button
                onClick={async () => {
                  await handleComplete(currentReminder.id)
                  setShowNotificationModal(false)
                  setCurrentReminder(null)
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Marcar como completado
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}