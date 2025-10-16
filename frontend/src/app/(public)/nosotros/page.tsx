'use client'

import { useState, useEffect } from 'react'
import { Users, Award, Target, Heart, TrendingUp, Globe, Zap, Shield, Star, ArrowRight, CheckCircle, Play } from 'lucide-react'
import { getImageUrl } from '@/lib/imageUtils'
import { API_CONFIG } from '@/lib/config'
import { GSAPScrollCards } from '@/components/GSAPScrollCards'

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
    <div className="min-h-screen paddingDesktop62 marginTop62 ">

      {/* Header con buscador - 100% width */}
      <div className="w-full p-8 mb-12 relative overflow-hidden" style={{ backgroundColor: '#4FBED5',height: '335px' }}>
         
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-4">
              
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              
            </p>
          </div>


          
          <div className='shapeAmarilloIzq slide-in-left'>
            <img src="/shapeAmarilloizq.svg" alt="Shape Catalogo Izq" />
          </div>

          <div className='logoB slide-in-top'>
            <img src="/letraB.svg" alt="logo B" />
          </div>

          <div className='logoCorazon slide-in-center'>
            <img src="/logocorazon.svg" alt="logo Corazón" />
          </div>

          <div className='quienesSomosDerecha slide-in-right'>
            <img src="/quienesSomosDerecha.svg" alt="Shape Catalogo Der" />
          </div>


        </div>

      {/* GSAP Scroll Cards Section */}
      <section className="py-0">
        <GSAPScrollCards 
            cards={[
              {
                id: 'branding-design',
                title: 'Branding Design',
                description: 'Branding es más que solo un logo—es la base de la identidad de tu empresa. Creamos identidades visuales que conectan con tu audiencia.',
                image: '/imprenta.jpg'
              },
              {
                id: 'digital-printing',
                title: 'Digital Printing',
                description: 'Impresión digital de alta calidad para todos tus proyectos. Desde material promocional hasta productos corporativos con la mejor tecnología.',
                image: '/marroquineria.jpg'
              },
              {
                id: 'merchandising',
                title: 'Merchandising',
                description: 'Productos promocionales que fortalecen tu marca. Desde tazas hasta ropa corporativa, creamos merchandising que tus clientes amarán.',
                image: '/merchandising.jpg'
              },
              {
                id: 'graphic-design',
                title: 'Graphic Design',
                description: 'Diseño gráfico que cuenta tu historia. Nuestros diseñadores especializados crean piezas visuales que destacan y comunican efectivamente.',
                image: '/packaging.jpg'
              },
              {
                id: 'corporate-gifts',
                title: 'Corporate Gifts',
                description: 'Regalos corporativos que dejan una impresión duradera. Personalizamos productos únicos que refuerzan las relaciones comerciales.',
                image: '/productos.jpg'
              },
              {
                id: 'consulting',
                title: 'Consulting',
                description: 'Asesoramiento estratégico para optimizar tu presencia de marca. Te ayudamos a tomar decisiones informadas para el crecimiento de tu empresa.',
                image: '/experiencias.jpg'
              }
            ]}
            className="min-h-screen"
          />
      </section>

    </div>  
   
   
  )
}
