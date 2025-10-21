'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { API_CONFIG, getApiUrl } from '@/lib/config'
import { 
  Users, 
  Eye, 
  Trash2, 
  Search, 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  Package, 
  MessageSquare,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  PhoneCall,
  MessageCircle,
  UserCheck,
  FileText
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { ConfirmModal } from '@/components/ConfirmModal'
import { AlertModal } from '@/components/AlertModal'
import { useModal } from '@/hooks/useModal'
import { Pagination } from '@/components/ui/pagination'
import { LeadTags } from '@/components/LeadTags'
import { useInquiriesCount } from '@/hooks/useInquiriesCount'
import CustomSelect from '@/components/ui/select'
import { getImageUrl } from '@/lib/imageUtils'

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status?: string;
  priority?: string;
  products?: Array<{
    product?: {
      id: string;
      name: string;
      description?: string;
      category?: string;
      image?: string;
    };
    quantity?: number;
  }>;
  tags?: string[];
  followUpHistory?: Array<{
    id: string;
    type: string;
    description: string;
    outcome?: string;
    nextAction?: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export default function InquiriesPageContent() {
  const { showSuccess, showError } = useToast()
  const { count: inquiriesCount } = useInquiriesCount()
  const { alertState, showAlert, hideAlert } = useModal()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [loadingInquiryDetails, setLoadingInquiryDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null)
  const [showFollowUpModal, setShowFollowUpModal] = useState(false)
  const [inquiryForFollowUp, setInquiryForFollowUp] = useState<Inquiry | null>(null)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [inquiryToConvert, setInquiryToConvert] = useState<Inquiry | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [inquiryForHistory, setInquiryForHistory] = useState<Inquiry | null>(null)
  const [showAddInquiryModal, setShowAddInquiryModal] = useState(false)
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false)
  
  // Estados para el formulario de seguimiento
  const [followUpForm, setFollowUpForm] = useState({
    type: 'call',
    description: '',
    outcome: 'neutral',
    nextAction: '',
    reminderDate: '',
    reminderTime: ''
  })
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false)
  
  // Estados para el formulario de nueva consulta
  const [newInquiryForm, setNewInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  
  // Estado para las tabs
  const [activeTab, setActiveTab] = useState('all')

  // Opciones para los selects
  const followUpTypeOptions = [
    { value: 'call', label: '📞 Llamada telefónica' },
    { value: 'email', label: '✉️ Email' },
    { value: 'whatsapp', label: '💬 WhatsApp' },
    { value: 'meeting', label: '🤝 Reunión presencial' },
    { value: 'note', label: '📝 Nota interna' }
  ]

  const outcomeOptions = [
    { value: 'positive', label: '✅ Positivo (cliente interesado)' },
    { value: 'negative', label: '❌ Negativo (no interesado)' },
    { value: 'neutral', label: '⚪ Neutral (sin decisión)' },
    { value: 'scheduled', label: '📅 Programado (próxima acción)' }
  ]

  const priorityOptions = [
    { value: 'low', label: '🟢 Baja' },
    { value: 'medium', label: '🟡 Media' },
    { value: 'high', label: '🟠 Alta' },
    { value: 'urgent', label: '🔴 Urgente' }
  ]

  const statusOptions = [
    { value: 'new', label: '🆕 Nueva' },
    { value: 'pending', label: '⏳ Pendiente' },
    { value: 'in_progress', label: '🔄 En Proceso' },
    { value: 'completed', label: '✅ Completada' },
    { value: 'closed', label: '❌ Cerrada' }
  ]

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch(getApiUrl('/inquiries'))
      const data = await response.json()
      setInquiries(data)
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleDeleteClick = (inquiry: Inquiry) => {
    setInquiryToDelete(inquiry)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!inquiryToDelete) return

    try {
      const response = await fetch(getApiUrl(`/inquiries/${inquiryToDelete.id}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        showSuccess('Consulta eliminada correctamente')
        fetchInquiries()
        setShowDeleteModal(false)
        setInquiryToDelete(null)
      } else {
        showError('Error al eliminar la consulta')
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error)
      showError('Error al eliminar la consulta')
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setInquiryToDelete(null)
  }

  const handleFollowUpClick = (inquiry: Inquiry) => {
    setInquiryForFollowUp(inquiry)
    setShowFollowUpModal(true)
  }

  const handleFollowUpCancel = () => {
    setShowFollowUpModal(false)
    setInquiryForFollowUp(null)
    setFollowUpForm({
      type: 'call',
      description: '',
      outcome: 'neutral',
      nextAction: '',
      reminderDate: '',
      reminderTime: ''
    })
  }

  const handleFollowUpSubmit = async () => {
    if (!inquiryForFollowUp || !followUpForm.description.trim()) {
      showError('Por favor completa la descripción del seguimiento')
      return
    }


    setIsSubmittingFollowUp(true)
    try {
      const response = await fetch(getApiUrl(`/inquiries/${inquiryForFollowUp.id}/follow-up`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(followUpForm),
      })


      if (response.ok) {
        const result = await response.json()
        
        let successMessage = 'Seguimiento agregado correctamente'
        if (result.reminderCreated) {
          successMessage += ' y recordatorio creado'
        }
        
        showSuccess(successMessage)
        fetchInquiries() // Refrescar la lista
        
        // Si hay una consulta seleccionada, actualizarla también
        if (selectedInquiry && selectedInquiry.id === inquiryForFollowUp.id) {
          fetchInquiryDetails(inquiryForFollowUp.id)
        }
        
        handleFollowUpCancel()
      } else {
        const errorText = await response.text()
        showError(`Error al agregar el seguimiento: ${response.status}`)
      }
    } catch (error) {
      console.error('Error adding follow-up:', error)
      showError('Error al agregar el seguimiento')
    } finally {
      setIsSubmittingFollowUp(false)
    }
  }

  const handleConvertClick = (inquiry: Inquiry) => {
    setInquiryToConvert(inquiry)
    setShowConvertModal(true)
  }

  const handleConvertCancel = () => {
    setShowConvertModal(false)
    setInquiryToConvert(null)
  }

  const handleHistoryClick = (inquiry: Inquiry) => {
    setInquiryForHistory(inquiry)
    setShowHistoryModal(true)
  }

  const handleHistoryCancel = () => {
    setShowHistoryModal(false)
    setInquiryForHistory(null)
  }

  const handleAddInquiryClick = () => {
    setShowAddInquiryModal(true)
  }

  const handleAddInquiryCancel = () => {
    setShowAddInquiryModal(false)
    setNewInquiryForm({
      name: '',
      email: '',
      phone: '',
      message: ''
    })
  }

  const handleAddInquirySubmit = async () => {
    if (!newInquiryForm.name.trim() || !newInquiryForm.email.trim()) {
      showError('Por favor completa el nombre y email del cliente')
      return
    }

    setIsSubmittingInquiry(true)
    try {
      const response = await fetch(getApiUrl('/inquiries'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInquiryForm),
      })

      if (response.ok) {
        showSuccess('Consulta agregada correctamente')
        fetchInquiries()
        handleAddInquiryCancel()
      } else {
        const errorText = await response.text()
        showError(`Error al agregar la consulta: ${response.status}`)
      }
    } catch (error) {
      console.error('Error adding inquiry:', error)
      showError('Error al agregar la consulta')
    } finally {
      setIsSubmittingInquiry(false)
    }
  }

  const handleConvertToClient = async () => {
    if (!inquiryToConvert) return

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/inquiries/${inquiryToConvert.id}/convert-to-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: inquiryToConvert.name,
          email: inquiryToConvert.email,
          phone: inquiryToConvert.phone,
          notes: `Convertido desde consulta: ${inquiryToConvert.message || 'Sin mensaje'}`
        }),
      })

      if (!response.ok) {
        throw new Error('Error al convertir a cliente')
      }

      const result = await response.json()

      // Actualizar la lista de consultas
      await fetchInquiries()
      
      // Cerrar el modal
      setShowConvertModal(false)
      setInquiryToConvert(null)

      // Mostrar mensaje de éxito
      showAlert({
        title: 'Éxito',
        message: 'Cliente convertido exitosamente',
        type: 'success'
      })
      
    } catch (error) {
      console.error('Error convirtiendo a cliente:', error)
      showAlert({
        title: 'Error',
        message: 'Error al convertir a cliente',
        type: 'error'
      })
    }
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: 'Nueva', className: 'bg-white text-blue-600 border border-blue-600', icon: Plus },
      pending: { label: 'Pendiente', className: 'bg-white text-yellow-600 border border-yellow-600', icon: Clock },
      in_progress: { label: 'En Proceso', className: 'bg-white text-orange-600 border border-orange-600', icon: AlertCircle },
      completed: { label: 'Completada', className: 'bg-white text-green-600 border border-green-600', icon: CheckCircle },
      closed: { label: 'Cerrada', className: 'bg-white text-gray-600 border border-gray-600', icon: X },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <config.icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'Baja', className: 'bg-white text-gray-600 border border-gray-600' },
      medium: { label: 'Media', className: 'bg-white text-blue-600 border border-blue-600' },
      high: { label: 'Alta', className: 'bg-white text-orange-600 border border-orange-600' },
      urgent: { label: 'Urgente', className: 'bg-white text-red-600 border border-red-600' },
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  // Función para filtrar consultas según la tab activa
  const getFilteredInquiries = () => {
    switch (activeTab) {
      case 'new':
        return inquiries.filter(inquiry => inquiry.status === 'new')
      case 'with-followup':
        return inquiries.filter(inquiry => inquiry.followUpHistory && inquiry.followUpHistory.length > 0)
      case 'closed':
        return inquiries.filter(inquiry => inquiry.status === 'closed')
      default:
        return inquiries
    }
  }

  const filteredInquiries = getFilteredInquiries()

  // Paginación
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInquiries = filteredInquiries.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Reset página cuando cambie la tab
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  const fetchInquiryDetails = async (inquiryId: string) => {
    setLoadingInquiryDetails(true)
    try {
      const response = await fetch(getApiUrl(`/inquiries/${inquiryId}`))
      const data = await response.json()
      setSelectedInquiry(data)
    } catch (error) {
      console.error('Error fetching inquiry details:', error)
      showError('Error al cargar los detalles de la consulta')
    } finally {
      setLoadingInquiryDetails(false)
    }
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
      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Consultas desde el sitio web</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Total: {filteredInquiries.length} consulta{filteredInquiries.length !== 1 ? 's' : ''}
          </div>
          <Button
            onClick={() => setShowAddInquiryModal(true)}
            className="text-white rounded-full"
            style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8'
              e.currentTarget.style.borderColor = '#1d4ed8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb'
              e.currentTarget.style.borderColor = '#2563eb'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Consulta
          </Button>
        </div>
      </div>

      {/* Tabs de filtrado */}
      <div>
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'all', label: 'Todas', icon: MessageSquare, count: inquiries.length },
            { id: 'new', label: 'Nuevas', icon: Plus, count: inquiries.filter(i => i.status === 'new').length },
            { id: 'with-followup', label: 'Con Seguimiento', icon: Clock, count: inquiries.filter(i => i.followUpHistory && i.followUpHistory.length > 0).length },
            { id: 'closed', label: 'Cerradas', icon: CheckCircle, count: inquiries.filter(i => i.status === 'closed').length }
          ].map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 whitespace-nowrap py-2 px-1 border-b-2 text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-800'
                    : 'bg-white text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tabla de consultas */}
      <Card className="bg-white border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {inquiry.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{inquiry.email}</div>
                    {inquiry.phone && (
                      <div className="text-sm text-gray-500">{inquiry.phone}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(inquiry.status || 'new')}
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(inquiry.priority || 'medium')}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {inquiry.products ? inquiry.products.length : 0} producto{(inquiry.products ? inquiry.products.length : 0) !== 1 ? 's' : ''}
                      {inquiry.products && inquiry.products.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Total: {inquiry.products.reduce((sum, p) => sum + (p.quantity || 1), 0)} unidades
                        </div>
                      )}
                    </div>
                    {inquiry.tags && inquiry.tags.length > 0 && (
                      <div className="mt-1">
                        <LeadTags tags={inquiry.tags} maxVisible={2} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {formatDate(inquiry.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fetchInquiryDetails(inquiry.id)}
                        title="Ver detalles de la consulta"
                        disabled={loadingInquiryDetails}
                        className="rounded-full aspect-square h-8 w-8 p-0 flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFollowUpClick(inquiry)}
                        className="rounded-full aspect-square h-8 w-8 p-0 flex items-center justify-center"
                        style={{ backgroundColor: '#06b6d4', color: 'white', borderColor: '#06b6d4' }}
                        title="Agregar seguimiento"
                      >
                        <Plus className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleHistoryClick(inquiry)}
                        className="rounded-full aspect-square h-8 w-8 p-0 flex items-center justify-center"
                        style={{ backgroundColor: '#8b5cf6', color: 'white', borderColor: '#8b5cf6' }}
                        title="Ver historial de seguimientos"
                      >
                        <Clock className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConvertClick(inquiry)}
                        className="rounded-full aspect-square h-8 w-8 p-0 flex items-center justify-center"
                        style={{ backgroundColor: '#16a34a', color: 'white', borderColor: '#16a34a' }}
                        title="Convertir a cliente"
                      >
                        <Users className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(inquiry)}
                        className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 rounded-full aspect-square h-8 w-8 p-0 flex items-center justify-center"
                        title="Eliminar consulta"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      {filteredInquiries.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="text-sm text-gray-600">
              {filteredInquiries.length > itemsPerPage && (
                <span className="text-blue-600">
                  Página {currentPage} de {totalPages} - {itemsPerPage} por página
                </span>
              )}
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredInquiries.length}
            showInfo={true}
            showItemsPerPage={true}
            itemsPerPageOptions={[5, 10, 20, 50]}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}

      {filteredInquiries.length === 0 && inquiries.length > 0 && (
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay consultas en esta categoría
            </h3>
            <p className="text-gray-600">
              {activeTab === 'new' && 'No hay consultas nuevas pendientes.'}
              {activeTab === 'with-followup' && 'No hay consultas con seguimiento.'}
              {activeTab === 'closed' && 'No hay consultas cerradas.'}
              {activeTab === 'all' && 'Las consultas que lleguen desde el sitio web aparecerán aquí.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalles sin border radius */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ marginTop: '-24px' }} onClick={() => setSelectedInquiry(null)}>
          <div className="w-full max-w-3xl max-h-[95vh] overflow-hidden">
            <Card className="h-full flex flex-col shadow-2xl border-0 bg-white !p-0 rounded-none" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <CardHeader className="text-white border-b-0 p-8 rounded-none" style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)' }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl hidden md:block">
                      <Users className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-2xl font-bold text-white">
                        Detalles de la Consulta
                      </CardTitle>
                      <h3 className="text-lg font-semibold flex items-center">
                  
                    Información del Cliente
                  </h3>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedInquiry(null)}
                    className="text-white hover:bg-white/20 hover:text-white rounded-full p-3"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </CardHeader>
              
              {/* Contenido simplificado */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {loadingInquiryDetails ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    {/* Información del cliente */}
                <div className="bg-white rounded-lg p-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Users className="h-4 w-4 text-gray-400 hidden md:block" />
                        <span className="text-sm text-gray-600">Nombre completo</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{selectedInquiry.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Email</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{selectedInquiry.email}</span>
                    </div>
                    
                    {selectedInquiry.phone && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Teléfono</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{selectedInquiry.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Estado</span>
                      </div>
                      <div className="flex items-center">
                        {getStatusBadge(selectedInquiry.status || 'pending')}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Fecha de envío</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formatDate(selectedInquiry.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Productos de interés</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedInquiry.products && selectedInquiry.products.length > 0 ? (
                          selectedInquiry.products.map((inquiryProduct, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {inquiryProduct.product?.name || 'Producto no disponible'}
                              {inquiryProduct.quantity && inquiryProduct.quantity > 1 && (
                                <span className="ml-1">({inquiryProduct.quantity})</span>
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm font-medium text-gray-900">Sin productos</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mensaje */}
                {selectedInquiry.message && (
                  <div className="bg-white rounded-lg p-2 md:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Mensaje del Cliente</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-900 leading-relaxed">{selectedInquiry.message}</p>
                    </div>
                  </div>
                )}

                {/* Productos */}
                {selectedInquiry.products && selectedInquiry.products.length > 0 && (
                  <div className="bg-white rounded-lg p-2 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Productos de Interés</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">({selectedInquiry.products.length} productos)</span>
                    </div>
                    <div className="space-y-3">
                      {selectedInquiry.products.map((inquiryProduct, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {inquiryProduct.product?.image ? (
                              <img
                                src={getImageUrl(inquiryProduct.product.image)}
                                alt={inquiryProduct.product.name || 'Producto'}
                                className="w-8 h-8 object-contain rounded-md bg-transparent"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                                <Package className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {inquiryProduct.product?.name || 'Producto no disponible'}
                              </span>
                              {inquiryProduct.product?.category && (
                                <p className="text-xs text-gray-500">
                                  {inquiryProduct.product.category}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {inquiryProduct.quantity || 1} unidad{(inquiryProduct.quantity || 1) !== 1 ? 'es' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedInquiry.tags && selectedInquiry.tags.length > 0 && (
                  <div className="bg-white rounded-lg p-2 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Star className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Etiquetas</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedInquiry.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Historial de seguimientos */}
                {selectedInquiry.followUpHistory && selectedInquiry.followUpHistory.length > 0 && (
                  <div className="bg-white rounded-lg p-2 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Historial de Seguimientos</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">({selectedInquiry.followUpHistory.length} seguimientos)</span>
                    </div>
                    <div className="space-y-3">
                      {selectedInquiry.followUpHistory.map((followUp, index) => (
                        <div key={followUp.id} className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            {followUp.type === 'call' && <PhoneCall className="h-4 w-4 text-gray-400" />}
                            {followUp.type === 'email' && <Mail className="h-4 w-4 text-gray-400" />}
                            {followUp.type === 'whatsapp' && <MessageCircle className="h-4 w-4 text-gray-400" />}
                            {followUp.type === 'meeting' && <UserCheck className="h-4 w-4 text-gray-400" />}
                            {followUp.type === 'note' && <FileText className="h-4 w-4 text-gray-400" />}
                            <div>
                              <span className="text-sm font-medium text-gray-900 capitalize block">
                                {followUp.type === 'call' && 'Llamada telefónica'}
                                {followUp.type === 'email' && 'Email'}
                                {followUp.type === 'whatsapp' && 'WhatsApp'}
                                {followUp.type === 'meeting' && 'Reunión presencial'}
                                {followUp.type === 'note' && 'Nota interna'}
                              </span>
                              <span className="text-xs text-gray-600">
                                {formatDate(followUp.createdAt)}
                              </span>
                            </div>
                          </div>
                          {followUp.outcome && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              followUp.outcome === 'positive' ? 'bg-orange-100 text-orange-800' :
                              followUp.outcome === 'negative' ? 'bg-red-100 text-red-800' :
                              followUp.outcome === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {followUp.outcome === 'positive' && '✅ Positivo'}
                              {followUp.outcome === 'negative' && '❌ Negativo'}
                              {followUp.outcome === 'scheduled' && '📅 Programado'}
                              {followUp.outcome === 'neutral' && '⚪ Neutral'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación personalizado */}
      {showDeleteModal && inquiryToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ marginTop: '-24px' }} onClick={handleDeleteCancel}>
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0 bg-white rounded-none !p-0" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="text-white border-b-0 p-6 rounded-none" style={{ background: 'linear-gradient(to right, #dc2626, #b91c1c)' }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Trash2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-white">
                        Eliminar Consulta
                      </CardTitle>
                      <p className="text-red-100 text-sm mt-1">
                        Esta acción no se puede deshacer
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteCancel}
                    className="text-white hover:bg-white/20 hover:text-white rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  
                  <div className="flex-1">
                    <h4 className="font-body text-gray-900 mb-2">
                      ¿Estás seguro de que quieres eliminar esta consulta?
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{inquiryToDelete.name}</p>
                          <p className="text-sm text-gray-500">{inquiryToDelete.email}</p>
                        </div>
                      </div>
                    </div>
                 
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleDeleteCancel}
                    className="px-6 rounded-full"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    className="px-6 bg-red-600 hover:bg-red-700 text-white rounded-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Consulta
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de seguimiento sin border radius */}
      {showFollowUpModal && inquiryForFollowUp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ marginTop: '-24px' }} onClick={handleFollowUpCancel}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <Card className="h-full flex flex-col shadow-2xl border-0 bg-white rounded-none !p-0" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="text-white border-b-0 p-6 rounded-none" style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)' }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-white">
                        Agregar Seguimiento
                      </CardTitle>
                      <p className="text-green-100 text-sm mt-1">
                        {inquiryForFollowUp.name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFollowUpCancel}
                    className="text-white hover:bg-white/20 hover:text-white rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleFollowUpSubmit(); }} className="space-y-6">
                  {/* Tipo de seguimiento y Resultado en la misma línea */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de seguimiento
                      </label>
                      <CustomSelect
                        options={followUpTypeOptions}
                        value={followUpForm.type}
                        onChange={(value) => setFollowUpForm({ ...followUpForm, type: value })}
                        placeholder="Seleccionar tipo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resultado del seguimiento
                      </label>
                      <CustomSelect
                        options={outcomeOptions}
                        value={followUpForm.outcome}
                        onChange={(value) => setFollowUpForm({ ...followUpForm, outcome: value })}
                        placeholder="Seleccionar resultado"
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción del seguimiento *
                    </label>
                    <Textarea
                      value={followUpForm.description}
                      onChange={(e) => setFollowUpForm({ ...followUpForm, description: e.target.value })}
                      placeholder="Describe qué se habló, acordó o resolvió en este seguimiento..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  {/* Próxima acción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Próxima acción (opcional)
                    </label>
                    <Input
                      value={followUpForm.nextAction}
                      onChange={(e) => setFollowUpForm({ ...followUpForm, nextAction: e.target.value })}
                      placeholder="Ej: Llamar en 3 días, enviar cotización, etc."
                    />
                  </div>

                  {/* Recordatorio */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Recordarme contactar al cliente
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Fecha
                        </label>
                        <Input
                          type="date"
                          value={followUpForm.reminderDate}
                          onChange={(e) => setFollowUpForm({ ...followUpForm, reminderDate: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Hora
                        </label>
                        <Input
                          type="time"
                          value={followUpForm.reminderTime}
                          onChange={(e) => setFollowUpForm({ ...followUpForm, reminderTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Si completas estos campos, se creará un recordatorio automáticamente
                    </p>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFollowUpCancel}
                      disabled={isSubmittingFollowUp}
                      className="rounded-full"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 rounded-full"
                      disabled={isSubmittingFollowUp}
                    >
                      {isSubmittingFollowUp ? 'Guardando...' : 'Agregar Seguimiento'}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de conversión sin border radius */}
      {showConvertModal && inquiryToConvert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ marginTop: '-24px' }} onClick={handleConvertCancel}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <Card className="h-full flex flex-col shadow-2xl border-0 bg-white rounded-none !p-0" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="text-white border-b-0 p-6 rounded-none" style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)' }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-white">
                        Convertir a Cliente
                      </CardTitle>
                      <p className="text-blue-100 text-sm mt-1">
                        {inquiryToConvert.name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleConvertCancel}
                    className="text-white hover:bg-white/20 hover:text-white rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <div className="flex-1 overflow-y-auto p-6" style={{ paddingTop: '0' }}>
                
                
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Información del Cliente:</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Nombre:</span> {inquiryToConvert.name}</div>
                      <div><span className="font-medium">Email:</span> {inquiryToConvert.email}</div>
                      {inquiryToConvert.phone && <div><span className="font-medium">Teléfono:</span> {inquiryToConvert.phone}</div>}
                      {inquiryToConvert.message && <div><span className="font-medium">Mensaje:</span> {inquiryToConvert.message}</div>}
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-yellow-100 rounded-full">
                        <svg className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-yellow-800 text-sm">
                        <strong>Nota:</strong> Una vez convertido, la consulta se marcará como cerrada y aparecerá en la lista de clientes.
                      </p>
                    </div>
                  </div>
               
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleConvertCancel}
                    className="px-6 rounded-full"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleConvertToClient}
                    className="px-6 bg-green-600 hover:bg-green-700 text-white rounded-full"
                  >
                    Convertir a Cliente
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de historial de seguimientos sin border radius */}
      {showHistoryModal && inquiryForHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ marginTop: '-24px' }} onClick={handleHistoryCancel}>
          <div className="w-full max-w-4xl max-h-[90vh]">
            <Card className="h-full flex flex-col shadow-2xl border-0 bg-white rounded-none !p-0" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="text-white border-b-0 p-6 rounded-none" style={{ background: 'linear-gradient(to right, #8b5cf6, #7c3aed)' }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-white">
                        Historial de Seguimientos
                      </CardTitle>
                      <p className="text-purple-100 text-sm mt-1">
                        {inquiryForHistory.name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleHistoryCancel}
                    className="text-white hover:bg-white/20 hover:text-white rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <div 
                className="flex-1 p-6 relative history-scroll" 
                style={{ 
                  maxHeight: 'calc(90vh - 120px)',
                  overflowY: 'auto',
                  paddingRight: '12px' // 4px de separación + 8px de padding original
                }}
              >
                {inquiryForHistory.followUpHistory && inquiryForHistory.followUpHistory.length > 0 ? (
                  <div className="relative" style={{ paddingRight: '8px' }}>
                    {/* Timeline vertical */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {inquiryForHistory.followUpHistory.map((followUp, index) => (
                      <div 
                        key={followUp.id} 
                        className="timeline-item relative flex items-start pb-6 last:pb-0"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: 'fadeInUp 0.5s ease-out forwards'
                        }}
                      >
                        {/* Icono del timeline */}
                        <div className="timeline-icon relative z-10 flex items-center justify-center w-8 h-8 bg-white border-2 border-purple-500 rounded-full shadow-sm">
                          {followUp.type === 'call' && <PhoneCall className="h-4 w-4 text-purple-600" />}
                          {followUp.type === 'email' && <Mail className="h-4 w-4 text-purple-600" />}
                          {followUp.type === 'whatsapp' && <MessageCircle className="h-4 w-4 text-purple-600" />}
                          {followUp.type === 'meeting' && <UserCheck className="h-4 w-4 text-purple-600" />}
                          {followUp.type === 'note' && <FileText className="h-4 w-4 text-purple-600" />}
                        </div>
                        
                        {/* Contenido del timeline */}
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 capitalize">
                              {followUp.type === 'call' && 'Llamada telefónica'}
                              {followUp.type === 'email' && 'Email'}
                              {followUp.type === 'whatsapp' && 'WhatsApp'}
                              {followUp.type === 'meeting' && 'Reunión presencial'}
                              {followUp.type === 'note' && 'Nota interna'}
                            </h4>
                            {followUp.outcome && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                followUp.outcome === 'positive' ? 'bg-green-100 text-green-800' :
                                followUp.outcome === 'negative' ? 'bg-red-100 text-red-800' :
                                followUp.outcome === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {followUp.outcome === 'positive' && '✅ Positivo'}
                                {followUp.outcome === 'negative' && '❌ Negativo'}
                                {followUp.outcome === 'scheduled' && '📅 Programado'}
                                {followUp.outcome === 'neutral' && '⚪ Neutral'}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(followUp.createdAt)}
                          </p>
                          
                          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                            {followUp.description}
                          </p>
                          
                          {followUp.nextAction && (
                            <div className="mt-2">
                              <span className="text-xs text-purple-600 font-medium">Próxima acción:</span>
                              <p className="text-xs text-gray-600 mt-1">{followUp.nextAction}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sin historial de seguimientos
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Esta consulta aún no tiene seguimientos registrados.
                    </p>
                    <Button
                      onClick={() => {
                        handleHistoryCancel()
                        handleFollowUpClick(inquiryForHistory)
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar primer seguimiento
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de agregar consulta sin border radius */}
      {showAddInquiryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ marginTop: '-24px' }} onClick={handleAddInquiryCancel}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <Card className="h-full flex flex-col shadow-2xl border-0 bg-white rounded-none !p-0" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="text-white border-b-0 p-6 rounded-none" style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)' }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-white">
                        Agregar Nueva Consulta
                      </CardTitle>
                      <p className="text-blue-100 text-sm mt-1">
                        Crear consulta manualmente
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddInquiryCancel}
                    className="text-white hover:bg-white/20 hover:text-white rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleAddInquirySubmit(); }} className="space-y-6">
                  {/* Información básica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del cliente *
                      </label>
                      <Input
                        value={newInquiryForm.name}
                        onChange={(e) => setNewInquiryForm({ ...newInquiryForm, name: e.target.value })}
                        placeholder="Nombre completo del cliente"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={newInquiryForm.email}
                        onChange={(e) => setNewInquiryForm({ ...newInquiryForm, email: e.target.value })}
                        placeholder="email@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono (opcional)
                    </label>
                    <Input
                      value={newInquiryForm.phone}
                      onChange={(e) => setNewInquiryForm({ ...newInquiryForm, phone: e.target.value })}
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje o consulta
                    </label>
                    <Textarea
                      value={newInquiryForm.message}
                      onChange={(e) => setNewInquiryForm({ ...newInquiryForm, message: e.target.value })}
                      placeholder="Describe la consulta del cliente..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddInquiryCancel}
                      disabled={isSubmittingInquiry}
                      className="rounded-full"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="text-white rounded-full"
                      style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
                      onMouseEnter={(e) => {
                        if (!isSubmittingInquiry) {
                          e.currentTarget.style.backgroundColor = '#1d4ed8'
                          e.currentTarget.style.borderColor = '#1d4ed8'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmittingInquiry) {
                          e.currentTarget.style.backgroundColor = '#2563eb'
                          e.currentTarget.style.borderColor = '#2563eb'
                        }
                      }}
                      disabled={isSubmittingInquiry}
                    >
                      {isSubmittingInquiry ? 'Creando...' : 'Crear Consulta'}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}