'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { API_CONFIG, getImageUrl } from '@/lib/config'
import { ServiceImage } from '@/components/OptimizedImage'

// Registrar el plugin de ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Servicios por defecto como fallback
const defaultServices = [
  {
    id: '1',
    title: 'Merchandising Tradicional',
    description: 'Ponemos tu marca en todo tipo de objetos promocionales. Termos, botellas, lápices, biromes, lanyards, pins, llaveros, gorros, sombreros, medias, tazas, cuadernos, auriculares, mates, vasos térmicos.',
    image: 'https://static.landkit.engeni.com/assets/3024/a5104cf2-4317-4aab-9461-600f6b8deadd/baa6691a236939a18e77.png?v=1'
  },
  {
    id: '2',
    title: 'Textiles',
    description: 'Hace más de 20 años que fabricamos Textiles, desarrollamos líneas de producto, molderías a medida. Producimos en pequeña escala para personal o publicidad. También FASON para reconocidas marcas.',
    image: 'https://static.landkit.engeni.com/assets/3024/4a97e670-3882-4471-83ba-584bcfe2c097/f6d2a30409a6ddac0db6.png?v=1'
  },
  {
    id: '3',
    title: 'Packaging',
    description: 'Nuestros PACKAGINGS llevan tu concepto hasta los límites! Packs primarios y secundarios. Cajas, tubos, cofres, blisters y mucho más.',
    image: 'https://static.landkit.engeni.com/assets/3024/3b63580e-fbe4-47af-a397-afaafe8f0702/e79321e9a6eb4a5fc5c9.png?v=1'
  },
  {
    id: '4',
    title: 'Imprenta',
    description: 'Ofrecemos soluciones de IMPRENTA en todos los soportes, cartulinas, cartones, vinilos, etc. Bolsas, cuadernos, trípticos, brochures, tarjetones, tent cards, credenciales, blisters, stickers, banners, posters, banderas, etc.',
    image: 'https://static.landkit.engeni.com/assets/3024/7c22dc66-6502-46e0-b40d-6ae13ed1ca86/85d145a4b9aaddd5aa6a.png?v=1'
  }
]

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar servicios del backend
  useEffect(() => {
    let isMounted = true

    const fetchServices = async () => {
      try {
        const apiUrl = API_CONFIG.BASE_URL
        console.log('Fetching services from:', `${apiUrl}/services`)
        const response = await fetch(`${apiUrl}/services`)
        
        if (!isMounted) return
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Services data:', data)
        
        if (isMounted) {
          if (data.length > 0) {
            setServices(data)
          } else {
            // Si no hay datos del backend, usar los por defecto
            setServices(defaultServices)
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        // Solo usar servicios por defecto si hay error
        if (isMounted) {
          setServices(defaultServices)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchServices()

    return () => {
      isMounted = false
    }
  }, [])

  // Configurar ScrollTrigger cuando los servicios cambien
  useEffect(() => {
    if (!containerRef.current || loading) return

    // Limpiar triggers existentes
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())

    // Crear el efecto de apilamiento con GSAP ScrollTrigger
    const serviceElements = containerRef.current.querySelectorAll('.service-item')
    
    // Verificar que los elementos existen antes de crear ScrollTriggers
    if (serviceElements.length === 0) {
      console.warn('No service items found for ScrollTrigger')
      return
    }
    
    serviceElements.forEach((service, index) => {
      if (service) {
        ScrollTrigger.create({
          trigger: service,
          start: 'top 60px',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
          markers: false // Cambia a true para debug
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [services, loading])

  if (loading) {
    return (
      <section className="relative py-28">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return (
      <section className="relative py-28">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">No hay servicios disponibles</h2>
            <p className="text-gray-300">Los servicios se cargarán desde el panel de administración.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="services-section relative py-28 min-h-screen">
    
        
        {/* Overlay semitransparente para mejorar legibilidad */}
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        
        <div className="container mx-auto px-4 relative z-20">
        {/* Header - Centrado */}
        <div className="services-header mb-20 text-center">
          <h2 className="text-white text-4xl lg:text-5xl xl:text-6xl font-heading font-light leading-tight mb-6">
            <span className="text-blue">Nuestros</span> Servicios Destacados
          </h2>
          <p className="text-gray-300 text-lg lg:text-xl max-w-4xl mx-auto">
            Explorá Nuestras Soluciones de Merchandising y Diseño Premium | Atendemos Empresas y Negocios de todos los tamaños
          </p>
        </div>

        {/* Services Stack - Cada elemento se pega al anterior */}
        <div ref={containerRef} className="relative">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="service-item w-full py-20"
              style={{
                height: 'auto',
                zIndex: index + 1, // Invert z-index so later items appear on top
                backgroundColor: '#000'
              }}
            >
              <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Content */}
                  <div className="w-full">
                    <div className="mb-14">
                      <h2 className="text-white text-5xl lg:text-6xl xl:text-7xl uppercase mb-14 leading-none">
                          {service.title}
                      </h2>
                      <p className="text-gray-300 text-lg mb-14 leading-relaxed">
                        {service.description}
                      </p>
                      
                      {/* Button */}
                      <div className="mb-20">
                        <a 
                          href="#" 
                          className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full text-sm font-medium uppercase tracking-wider hover:bg-gray-200 transition-all duration-300 group"
                        >
                          <span className="mr-3">Ver Servicio</span>
                          <svg 
                            width="25" 
                            height="10" 
                            viewBox="0 0 25 10" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="group-hover:translate-x-1 transition-transform duration-300"
                          >
                            <path d="M18.675 9.91054L24.72 5.63362C24.806 5.56483 24.8766 5.47086 24.9255 5.36023C24.9744 5.2496 25 5.12579 25 5C25 4.87421 24.9744 4.7504 24.9255 4.63977C24.8766 4.52914 24.806 4.43518 24.72 4.36638L18.675 0.0894619C18.5572 0.0111909 18.4215 -0.0168364 18.2892 0.00979851C18.157 0.0364334 18.0358 0.116215 17.9446 0.236567C17.8535 0.356918 17.7977 0.510993 17.7859 0.674501C17.7742 0.838009 17.8072 1.00165 17.8798 1.13963L19.633 4.26665L0.598757 4.26665C0.439957 4.26665 0.287661 4.34391 0.175371 4.48144C0.0630817 4.61897 0 4.8055 0 5C0 5.1945 0.0630817 5.38103 0.175371 5.51856C0.287661 5.65609 0.439957 5.73335 0.598757 5.73335L19.633 5.73335L17.8798 8.86038C17.8072 8.99835 17.7742 9.16199 17.7859 9.3255C17.7977 9.48901 17.8535 9.64308 17.9446 9.76343C18.0358 9.88378 18.157 9.96357 18.2892 9.9902C18.4215 10.0168 18.5572 9.98881 18.675 9.91054Z" fill="currentColor" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="w-full">
                    <div className="text-right">
                      <div className="aspect-square w-full max-w-md mx-auto lg:mx-0 rounded-lg overflow-hidden">
                        <ServiceImage 
                          src={service.image ? getImageUrl(service.image) : service.image} 
                          alt={service.title}
                          className="w-full h-full hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    </>
  )
}