'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ConfirmModal } from '@/components/ConfirmModal'
import { getApiUrl } from '@/lib/config'
import { toast } from 'react-hot-toast'
import { 
  Mail, 
  Trash2, 
  FileSpreadsheet, 
  Users, 
  TrendingUp,
  Search
} from 'lucide-react'

interface NewsletterSubscriber {
  id: string
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface NewsletterStats {
  total: number
  active: number
  inactive: number
  recent: number
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([])
  const [stats, setStats] = useState<NewsletterStats>({ total: 0, active: 0, inactive: 0, recent: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null)

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      // Agregar cache busting con timestamp
      const response = await fetch(getApiUrl('/newsletter') + `?t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Fetched subscribers:', data.length)
        setSubscribers(data)
        setFilteredSubscribers(data)
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      toast.error('Error al cargar los suscriptores')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Agregar cache busting con timestamp
      const response = await fetch(getApiUrl('/newsletter/stats') + `?t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        console.log('📈 Fetched stats:', data)
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchSubscribers()
    fetchStats()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredSubscribers(filtered)
    } else {
      setFilteredSubscribers(subscribers)
    }
  }, [searchTerm, subscribers])


  const handleDelete = async (id: string) => {
    try {
      console.log('🗑️ Deleting subscriber:', id)
      const url = getApiUrl(`/newsletter/${id}`)
      console.log('🔗 DELETE URL:', url)
      
      const response = await fetch(url, {
        method: 'DELETE',
      })

      console.log('📡 DELETE Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ DELETE Success:', result)
        
        // Actualizar el estado local inmediatamente
        setSubscribers(prev => prev.filter(sub => sub.id !== id))
        setFilteredSubscribers(prev => prev.filter(sub => sub.id !== id))
        
        toast.success('Suscriptor eliminado')
        
        // Actualizar las estadísticas
        fetchStats()
      } else {
        const errorText = await response.text()
        console.error('❌ DELETE Error:', response.status, errorText)
        toast.error(`Error al eliminar: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Error deleting subscriber:', error)
      toast.error('Error al eliminar: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSubscriberToDelete(null)
    }
  }

  const exportToCSV = () => {
    const csv = [
      ['Email', 'Estado', 'Fecha de suscripción'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.isActive ? 'Activo' : 'Inactivo',
        new Date(sub.createdAt).toLocaleString('es-ES')
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new (window as any).Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success('CSV descargado')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando suscriptores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Newsletter</h1>
          <p className="text-gray-600 mt-1">Gestiona los suscriptores de tu newsletter</p>
        </div>
        <Button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full"
          style={{
            backgroundColor: '#16a34a',
            borderColor: '#16a34a'
          }}
          disabled={filteredSubscribers.length === 0}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Exportar a Excel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white rounded-lg shadow-sm border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Suscriptores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-lg shadow-sm border-none">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Nuevos (últimos 30 días)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar por email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron suscriptores' : 'Sin suscriptores'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Los suscriptores del newsletter aparecerán aquí'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Fecha de suscripción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {subscriber.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {new Date(subscriber.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setSubscriberToDelete(subscriber.id)}
                          variant="outline"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 rounded-full aspect-square h-8 w-8 p-0 flex items-center justify-center"
                          title="Eliminar suscriptor"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {subscriberToDelete && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setSubscriberToDelete(null)}
          onConfirm={() => handleDelete(subscriberToDelete)}
          title="Eliminar suscriptor"
          message="¿Estás seguro de que deseas eliminar este suscriptor? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}
    </div>
  )
}

