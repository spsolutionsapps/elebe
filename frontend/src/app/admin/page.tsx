'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, 
  Image, 
  Settings, 
  Users, 
  TrendingUp,
  Eye,
  ShoppingCart,
  RefreshCw
} from 'lucide-react'

interface Slide {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  image: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface Product {
  id: string
  name: string
  description: string
  price?: number | null
  image?: string | null
  images?: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface Service {
  id: string
  name: string
  description: string
  image?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string | null
  message: string
  products: any[]
  status?: 'pending' | 'contacted' | 'closed'
  createdAt: Date
  updatedAt: Date
}

export default function AdminDashboard() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [slidesRes, productsRes, servicesRes, inquiriesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/slides`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/inquiries`)
      ])

      if (slidesRes.ok) setSlides(await slidesRes.json())
      if (productsRes.ok) setProducts(await productsRes.json())
      if (servicesRes.ok) setServices(await servicesRes.json())
      if (inquiriesRes.ok) setInquiries(await inquiriesRes.json())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const stats = [
    {
      name: 'Slides Activos',
      value: slides.filter(slide => slide.isActive).length,
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Productos',
      value: products.length,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Servicios',
      value: services.length,
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Consultas',
      value: inquiries.length,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const recentInquiries = inquiries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bienvenido al panel de administración</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bienvenido al panel de administración</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <Card className="border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center pl-4">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Consultas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentInquiries.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay consultas recientes</p>
            ) : (
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-start justify-between p-3 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{inquiry.name}</p>
                          <p className="text-sm text-gray-600">{inquiry.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            inquiry.status === 'pending' ? 'bg-white text-yellow-600 border border-yellow-600' :
                            inquiry.status === 'contacted' ? 'bg-white text-blue-600 border border-blue-600' :
                            'bg-white text-green-600 border border-green-600'
                          }`}>
                            {inquiry.status === 'pending' ? 'Pendiente' :
                             inquiry.status === 'contacted' ? 'Contactado' : 'Cerrado'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(inquiry.createdAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center pl-4">
              <TrendingUp className="mr-2 h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/slides"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Image className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Gestionar Slides</p>
                  <p className="text-sm text-gray-600">Editar el slider principal</p>
                </div>
              </a>
              
              <a
                href="/admin/products"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Gestionar Productos</p>
                  <p className="text-sm text-gray-600">Agregar o editar productos</p>
                </div>
              </a>
              
              <a
                href="/admin/services"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Gestionar Servicios</p>
                  <p className="text-sm text-gray-600">Configurar servicios</p>
                </div>
              </a>
              
              <a
                href="/admin/about"
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Editar Nosotros</p>
                  <p className="text-sm text-gray-600">Actualizar información</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="pl-4">Estado del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-3 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Base de Datos</p>
                <p className="text-sm text-gray-600">Conectado</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">API</p>
                <p className="text-sm text-gray-600">Funcionando</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Autenticación</p>
                <p className="text-sm text-gray-600">Activa</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
