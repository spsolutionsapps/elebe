import { Settings, CheckCircle } from 'lucide-react'
import { getImageUrl } from '@/lib/imageUtils'
import { API_CONFIG } from '@/lib/config'

interface Service {
  id: string
  title: string
  description: string
  image?: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

async function getServices(): Promise<Service[]> {
  try {
    // Usar localhost para el fetch desde el cliente
    const apiUrl = 'http://localhost:3001/api'
    
    console.log('🔍 Fetching services from:', apiUrl)
    const response = await fetch(`${apiUrl}/services`, { 
      cache: 'no-store' // Para evitar caché durante desarrollo
    })
    if (response.ok) {
      const data = await response.json()
      console.log('📊 Services data:', data)
      return data
    } else {
      console.error('❌ Error response:', response.status, response.statusText)
      return []
    }
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

export default async function ServiciosPage() {
  const services = await getServices()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios de moda y consultoría de estilo
          </p>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="text-center py-16">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No hay servicios disponibles
            </h3>
            <p className="text-gray-600">
              Pronto tendremos nuevos servicios para ti
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gray-200">
                  {service.image ? (
                    <img
                      src={getImageUrl(service.image)}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                      <Settings className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Servicio Disponible
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Necesitas un servicio personalizado?
            </h2>
            <p className="text-gray-600 mb-6">
              Contáctanos para discutir tus necesidades específicas y crear un plan a medida
            </p>
            <a
              href="/contacto"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Contactar Ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
