'use client'

import { useState, useEffect } from 'react'
import { getImageUrl } from '@/lib/imageUtils'
import { API_CONFIG } from '@/lib/config'
import { ScrollAnimated } from '@/components/ScrollAnimated'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div style={{borderRadius: '150px'}}  className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
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
            <img src="/shapeAmarilloizq.svg" alt="Shape Catalogo Izq" loading="lazy" />
          </div>

          <div className='logoB slide-in-top'>
            <img src="/letraB.svg" alt="logo B" loading="lazy" />
          </div>

          <div className='logoCorazon slide-in-center'>
            <img src="/logocorazon.svg" alt="logo Corazón" loading="lazy" />
          </div>

          <div className='quienesSomosDerecha slide-in-right'>
            <img src="/quienesSomosDerecha.svg" alt="Shape Catalogo Der" loading="lazy" />
          </div>


        </div>

      {/* Sección de Texto Principal */}
      <section className="py-12 relative z-[110]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[36px] text-center text18Mobile font-blue leading-tight mx-auto mb-12">
            Creamos <em>EXPERIENCIAS</em> para ser vividas, <br /> filmadas y viralizadas.
          </p>

          {/* Texto descriptivo */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 text-center">
              <p className="text-[18px] font-blue leading-relaxed">
                Somos una agencia dedicada al diseño y producción de artículos personalizados. 
                Ofrecemos soluciones creativas para las empresas que necesitan darle exposición a su marca.
              </p>
              
              <p className="text-[18px] font-blue leading-relaxed">
                Nuestra fábrica está homologada por Disney "International Labor Standards The Walt Disney Company Argentina S.A." Trabajamos con las fábricas más avanzadas del mercado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secciones de Servicios */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Kits de Producción */}
          <ScrollAnimated direction="left">
            <div className="mb-20 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-1">
                  <h3 className="text-3xl font-bold font-blue mb-6">Kits de Producción</h3>
                  <p className="text-lg font-blue leading-relaxed">
                    Diseñamos KITS DE PRODUCTOS pensados para ocasiones especiales como eventos, lanzamientos, 
                    inducción de personal, o fechas clave para el calendario de marketing de tu empresa.
                  </p>
                </div>
                <div className="order-2">
                  <img 
                    src="/productos.jpg" 
                    alt="Kits de Producción" 
                    className="w-full h-80 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </ScrollAnimated>

          {/* Textiles */}
          <ScrollAnimated direction="right">
            <div className="mb-20 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <img 
                    src="/textiles.jpg" 
                    alt="Textiles" 
                    className="w-full h-80 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-3xl font-bold font-blue mb-6">Textiles</h3>
                  <p className="text-lg font-blue leading-relaxed">
                    Hace más de 20 años que FABRICAMOS TEXTILES, desarrollamos líneas de producto, molderias a medida. 
                    Producimos en pequeña escala para personal o publicidad. También FASÓN para reconocidas marcas.
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimated>

          {/* Marroquinería */}
          <ScrollAnimated direction="left">
            <div className="mb-20 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-1">
                  <h3 className="text-3xl font-bold font-blue mb-6">Marroquinería</h3>
                  <p className="text-lg font-blue leading-relaxed">
                    Desarrollos productos de MARROQUINERÍA con el concepto de tu emprendimiento. Mochilas, materas, 
                    riñoneras, fundas para dispositivos, bolsos, nécessaires, billeteras, porta documentos, bolsas, etc.
                  </p>
                </div>
                <div className="order-2">
                  <img 
                    src="/marroquineria.jpg" 
                    alt="Marroquinería" 
                    className="w-full h-80 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </ScrollAnimated>

          {/* Packaging */}
          <ScrollAnimated direction="right">
            <div className="mb-20 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <img 
                    src="/packaging.jpg" 
                    alt="Packaging" 
                    className="w-full h-80 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-3xl font-bold font-blue mb-6">Packaging</h3>
                  <p className="text-lg font-blue leading-relaxed">
                    Nuestros PACKAGINGS llevan tu concepto hasta los límites! Packs primarios y secundarios. 
                    Cajas, tubos, cofres, blisters y mucho más.
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimated>

          {/* Imprenta */}
          <ScrollAnimated direction="left">
            <div className="mb-20 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-1">
                  <h3 className="text-3xl font-bold font-blue mb-6">Imprenta</h3>
                  <p className="text-lg font-blue leading-relaxed">
                    Ofrecemos soluciones de IMPRENTA en todos los soportes, cartulinas, cartones, vinilos, etc. 
                    Bolsas, cuadernos, trípticos, brochures, tarjetones, tent cards, credenciales, blisters, 
                    stickers, banners, posters, banderas, etc.
                  </p>
                </div>
                <div className="order-2">
                  <img 
                    src="/imprenta.jpg" 
                    alt="Imprenta" 
                    className="w-full h-80 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </ScrollAnimated>

          {/* Merchandising */}
          <ScrollAnimated direction="right">
            <div className="mb-20 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <img 
                    src="/merchandising.jpg" 
                    alt="Merchandising" 
                    className="w-full h-80 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-3xl font-bold font-blue mb-6">Merchandising</h3>
                  <p className="text-lg font-blue leading-relaxed">
                    MERCHANDISING tradicional. Ponemos tu marca en todo tipo de objetos promocionales. 
                    Termos, botellas, lápices, biromes, lanyards, pins, llaveros, gorros, sombreros, medias, 
                    tazas, cuadernos, auriculares, mates, vasos térmicos.
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimated>
        </div>
      </section>

    </div>  
   
   
  )
}
