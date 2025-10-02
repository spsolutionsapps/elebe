'use client'

import { useState, useEffect } from 'react'
import { Users, Award, Target, Heart } from 'lucide-react'
import { getImageUrl } from '@/lib/imageUtils'
import { API_CONFIG } from '@/lib/config'

interface About {
  id: string
  title: string
  content: string
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export default function NosotrosPage() {
  const [about, setAbout] = useState<About | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const apiUrl = API_CONFIG.BASE_URL
      console.log('🔍 Fetching about from:', apiUrl)
      const response = await fetch(`${apiUrl}/about`)
      if (response.ok) {
        const data = await response.json()
        console.log('📊 About data:', data)
        setAbout(data)
      } else {
        console.error('❌ Error response:', response.status, response.statusText)
        // Establecer datos por defecto si no hay datos
        setAbout({
          id: 'default',
          title: 'Sobre Nosotros',
          content: 'Fashion Style nació de la pasión por la moda y el deseo de crear experiencias únicas para nuestros clientes.',
          images: [],
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    } catch (error) {
      console.error('Error fetching about:', error)
      // Establecer datos por defecto en caso de error
      setAbout({
        id: 'default',
        title: 'Sobre Nosotros',
        content: 'Fashion Style nació de la pasión por la moda y el deseo de crear experiencias únicas para nuestros clientes.',
        images: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Sobre Fashion Style
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Somos una empresa líder en moda y estilo, comprometida con la excelencia y la innovación en el mundo de la moda
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Content */}
        {about ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {about.title || 'Sobre Nosotros'}
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p className="whitespace-pre-line">{about.content || 'Información sobre nuestra empresa...'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {about.images && about.images.length > 0 ? (
                about.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={getImageUrl(image)}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))
              ) : (
                // Mostrar placeholders si no hay imágenes
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Nuestra Historia
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Fashion Style nació de la pasión por la moda y el deseo de crear experiencias únicas para nuestros clientes. 
              Desde nuestros inicios, nos hemos comprometido a ofrecer productos de la más alta calidad y un servicio excepcional.
            </p>
          </div>
        )}

        {/* Values Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600">
              Los principios que guían cada decisión que tomamos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pasión
              </h3>
              <p className="text-gray-600">
                Amamos lo que hacemos y eso se refleja en cada producto
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Calidad
              </h3>
              <p className="text-gray-600">
                Nos comprometemos con la excelencia en cada detalle
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Innovación
              </h3>
              <p className="text-gray-600">
                Siempre buscamos nuevas formas de sorprender
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comunidad
              </h3>
              <p className="text-gray-600">
                Construimos relaciones duraderas con nuestros clientes
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white rounded-lg shadow-md">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-gray-600">
              Profesionales apasionados por la moda y el estilo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Diseñadores
              </h3>
              <p className="text-gray-600">
                Expertos en crear tendencias únicas y atemporales
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Consultores de Estilo
              </h3>
              <p className="text-gray-600">
                Ayudan a nuestros clientes a encontrar su estilo único
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Atención al Cliente
              </h3>
              <p className="text-gray-600">
                Siempre disponibles para brindar el mejor servicio
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para descubrir tu estilo?
            </h2>
            <p className="text-xl mb-8">
              Explora nuestra colección y encuentra las prendas perfectas para ti
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/catalogo"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Ver Catálogo
              </a>
              <a
                href="/contacto"
                className="inline-flex items-center justify-center px-8 py-4 border border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contactar
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
