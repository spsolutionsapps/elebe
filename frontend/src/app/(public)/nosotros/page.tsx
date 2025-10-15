'use client'

import { useState, useEffect } from 'react'
import { Users, Award, Target, Heart, TrendingUp, Globe, Zap, Shield, Star, ArrowRight, CheckCircle, Play } from 'lucide-react'
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
        setAbout({
          id: 'default',
          title: 'Sobre LB Premium',
          content: 'LB Premium nació de la visión de crear soluciones integrales de impresión y merchandising que conecten marcas con sus audiencias de manera impactante.',
          images: [],
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    } catch (error) {
      console.error('Error fetching about:', error)
      setAbout({
        id: 'default',
        title: 'Sobre LB Premium',
        content: 'LB Premium nació de la visión de crear soluciones integrales de impresión y merchandising que conecten marcas con sus audiencias de manera impactante.',
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src="/logo.svg" 
            alt="LB Premium" 
            className="h-16 w-auto mx-auto mb-6 filter brightness-0 invert"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {about?.content || "LB Premium es una empresa líder en soluciones de impresión y merchandising, comprometida con la excelencia y la innovación."}
          </p>
        </div>
      </section>

      {/* Historia - Texto Izquierda, Imagen Derecha */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nuestra Historia
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Desde 2009, LB Premium ha sido pionera en la industria de la impresión y el merchandising en Argentina. 
                Nacimos con la visión de revolucionar la forma en que las marcas se conectan con sus audiencias.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                A lo largo de más de 15 años, hemos crecido hasta convertirnos en líderes del mercado, 
                sirviendo a más de 500 clientes y completando más de 1,200 proyectos exitosos.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-blue-600 font-semibold">15+ Años</span>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-blue-600 font-semibold">500+ Clientes</span>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-blue-600 font-semibold">1,200+ Proyectos</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
              <img 
                src="/nosotros-historia.jpg" 
                alt="Historia LB Premium" 
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                         const nextElement = e.currentTarget.nextElementSibling as any
                  if (nextElement) {
                    nextElement.style.display = 'flex'
                  }
                }}
              />
              <div className="hidden w-full h-full items-center justify-center text-gray-400">
                <div className="text-center">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p>Imagen de nuestra historia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores - Imagen Izquierda, Texto Derecha */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center order-2 lg:order-1">
              <img 
                src="/nosotros-valores.jpg" 
                alt="Valores LB Premium" 
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                         const nextElement = e.currentTarget.nextElementSibling as any
                  if (nextElement) {
                    nextElement.style.display = 'flex'
                  }
                }}
              />
              <div className="hidden w-full h-full items-center justify-center text-gray-400">
                <div className="text-center">
                  <Heart className="h-16 w-16 mx-auto mb-4" />
                  <p>Nuestros valores</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nuestros Valores
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 rounded-lg p-3 flex-shrink-0">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Pasión</h3>
                    <p className="text-gray-600">Amamos lo que hacemos y eso se refleja en cada proyecto que entregamos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 rounded-lg p-3 flex-shrink-0">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Calidad</h3>
                    <p className="text-gray-600">Nos comprometemos con la excelencia en cada detalle y proceso.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 rounded-lg p-3 flex-shrink-0">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovación</h3>
                    <p className="text-gray-600">Siempre buscamos nuevas tecnologías y formas creativas de sorprender.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-600 rounded-lg p-3 flex-shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Confianza</h3>
                    <p className="text-gray-600">Construimos relaciones duraderas basadas en la transparencia y el respeto.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios - Texto Izquierda, Imagen Derecha */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nuestros Servicios
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Ofrecemos soluciones integrales de impresión y merchandising para empresas de todos los tamaños. 
                Desde material promocional hasta productos corporativos, tenemos todo lo que necesitas.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Impresión digital de alta calidad</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Merchandising corporativo</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Diseño gráfico personalizado</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Entrega rápida y confiable</span>
                </div>
              </div>
              <div className="mt-8">
                <a
                  href="/catalogo"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver Catálogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
              <img 
                src="/nosotros-servicios.jpg" 
                alt="Servicios LB Premium" 
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                         const nextElement = e.currentTarget.nextElementSibling as any
                  if (nextElement) {
                    nextElement.style.display = 'flex'
                  }
                }}
              />
              <div className="hidden w-full h-full items-center justify-center text-gray-400">
                <div className="text-center">
                  <Award className="h-16 w-16 mx-auto mb-4" />
                  <p>Nuestros servicios</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para trabajar con nosotros?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contáctanos y descubre cómo podemos ayudar a tu empresa a destacar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/catalogo"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Ver Catálogo
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/contacto"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Contactar
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
