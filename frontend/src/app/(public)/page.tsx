'use client'

import { useEffect, useState } from 'react'
import { Product, Slide } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AddToCartButton } from '@/components/AddToCartButton'
import { GSAPSlider } from '@/components/GSAPSlider'
import { BrandsSlider } from '@/components/BrandsSlider'
import { ServicesSection } from '@/components/ServicesSection'
import { ServicesHighlightedSection } from '@/components/ServicesHighlightedSection'
import { FeaturedProductsSlider } from '@/components/FeaturedProductsSlider'
import { WorkProcessSection } from '@/components/WorkProcessSection'
import { ClientOnly } from '@/components/ClientOnly'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

// Función para obtener la URL de la imagen
import { getImageUrl as getImageUrlFromConfig, getApiUrl } from '@/lib/config';

function getImageUrl(imagePath: string): string {
  return getImageUrlFromConfig(imagePath);
}

// Función para generar slug
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones múltiples
    .trim()
}

export default function HomePage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sliderControls, setSliderControls] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  // Asegurar que solo se ejecute en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])


  useEffect(() => {
    if (!mounted) return

    const fetchData = async () => {
      try {
        // Fetch slides
        const slidesResponse = await fetch(getApiUrl('/slides'))
        if (slidesResponse.ok) {
          const slidesData = await slidesResponse.json()
          setSlides(slidesData.filter((slide: Slide) => slide.isActive))
        }

        // Fetch featured products
        console.log('🌐 Home: Fetching featured products from:', getApiUrl('/products/featured'))
        const productsResponse = await fetch(getApiUrl('/products/featured'))
        console.log('📡 Home: Featured products response status:', productsResponse.status)
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          console.log('📦 Home: Featured products data:', productsData)
          const activeProducts = productsData.filter((product: Product) => product.isActive)
          console.log('✅ Home: Active featured products:', activeProducts.length)
          setFeaturedProducts(activeProducts)
        } else {
          console.error('❌ Home: Error fetching featured products:', productsResponse.status)
        }
      } catch (error) {
        // Error fetching data silently handled
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [mounted])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300 font-body">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section with GSAP Slider - Full Width */}
      {slides.length > 0 && (
        <section className="hero-slider-section relative py-8 w-screen flex flex-col items-center" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%),z-index: 1' }}>
          <div className="w-full max-w-8xl mx-auto">
            <ClientOnly>
              <GSAPSlider
                slides={slides}
                onControls={setSliderControls}
              />
            </ClientOnly>
          </div>

          {/* Controles externos del slider */}
          {sliderControls && slides.length > 1 && (
            <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative w-full mt-[26px]">
              {/* Flechas en los extremos */}
              <div className="flex justify-between items-center">
                {/* Flecha Izquierda - Al inicio */}
                <button
                  onClick={sliderControls.handlePrev}
                  className="group flex items-center justify-center w-10 h-10 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300"
                  style={{ backgroundColor: '#176A7B' }}
                  aria-label="Slide anterior"
                >
                  <div className="relative w-4 h-4">
                    <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-white transform -translate-y-1/2 rotate-45 origin-left group-hover:bg-white/80 transition-colors duration-300"></div>
                    <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-white transform -translate-y-1/2 -rotate-45 origin-left group-hover:bg-white/80 transition-colors duration-300"></div>
                  </div>
                </button>

                {/* Bullets en el centro */}
                <div className="flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => sliderControls.handleDotClick(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === sliderControls.currentIndex
                          ? 'bg-white scale-125 shadow-lg'
                          : 'bg-white/40 hover:bg-white/70 hover:scale-110'
                        }`}
                    />
                  ))}
                </div>

                {/* Flecha Derecha - Al final */}
                <button
                  onClick={sliderControls.handleNext}
                  className="group flex items-center justify-center w-10 h-10 backdrop-blur-sm border border-white/20 rounded-full transition-all duration-300"
                  style={{ backgroundColor: '#176A7B' }}
                  aria-label="Slide siguiente"
                >
                  <div className="relative w-4 h-4">
                    <div className="absolute top-1/2 right-0 w-3 h-0.5 bg-white transform -translate-y-1/2 -rotate-45 origin-right group-hover:bg-white/80 transition-colors duration-300"></div>
                    <div className="absolute top-1/2 right-0 w-3 h-0.5 bg-white transform -translate-y-1/2 rotate-45 origin-right group-hover:bg-white/80 transition-colors duration-300"></div>
                  </div>
                </button>
              </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Sección Quiénes Somos */}
      <section className="quienes-somos-section py-16 relative z-[110]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[36px] text-center text18Mobile font-blue leading-tight mx-auto mb-12">
            Nos Especializamos en el Diseño y <br /> Producción de <em>Artículos Personalizados</em>
          </p>


          {/* Texto e imagen en la misma fila */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
            {/* Lado izquierdo - Textos descriptivos */}
            <div className="space-y-4 lg:max-w-lg">
              <p className="text-[18px] font-blue leading-relaxed text-center lg:text-left">
              Somos una agencia dedicada al diseño y producción de artículos personalizados. 
Ofrecemos soluciones creativas para las empresas que necesitan darle exposición a su marca.

              </p>
              <p className="text-[18px] font-blue leading-relaxed text-center lg:text-left">
              Nuestra fábrica está homologada por Disney "International Labor Standards The Walt Disney Company Argentina S.A." Trabajamos con las fábricas más avanzadas del mercado.
              </p>
              
              {/* Botón para ir a Nosotros */}
              <div className="flex justify-center lg:justify-start mt-6">
                <Link href="/nosotros">
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 hover:text-white  font-medium btnAmarillo transition-colors duration-300">
                    Conocé más de la <em>agencia</em>
                  </button>
                </Link>
              </div>
            </div>
            
            

            {/* Lado derecho - Imagen */}
            <div className="relative max-w-[300px] lg:max-w-[300px] flex items-center justify-center">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src="/quienesSomosLb.png"
                  alt="Quiénes Somos"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>


          {/* Brands Slider */}
          <div className="relative brands-slider-section">
            <ClientOnly>
              <BrandsSlider />
            </ClientOnly>
          </div>

        </div>

        <div className="shapeAmarilloIzq">
              <img
                    src="/shapeAmarilloizq.svg"
                    alt="LB ShapeIzq"
                  />
        </div>

    <div className="shapeAmarilloDer">
            <img
                    src="/blueShape.svg"
                    alt="LB ShapeDer"
                  />
    </div>

      </section>



  {/* Sección de Servicios Destacados
      <div className="space-y-0">
     
          <ClientOnly>
            <ServicesHighlightedSection />
          </ClientOnly>
        
      </div> 
  */}




      <div className="space-y-0 relative z-[100] bgRosa">
        
        {/* Featured Products */}
        <section className="featured-products-section relative z-[100] py-10" >
          <div className="container mx-auto px-4">
            <ClientOnly>
              <FeaturedProductsSlider products={featuredProducts} />
            </ClientOnly>
          </div>
        </section>
     
      </div>



      {/* Sección Proceso de Trabajo 
      <ClientOnly>
        <WorkProcessSection />
      </ClientOnly>
      */}


   
        {/* envios */}
        <section className="envios relative z-[100] py-16" >
          <div className="container mx-auto px-4">
          <img src="/envios.svg" alt="Envíos" className='d-block mx-auto mb-6' />

            <div className="grid grid-cols-3 gap-6 text-center ">
              <p className='verde'>_escuchamos y analizamos <br />
              <strong>qué inspira a cada cliente.</strong></p>

              <p className='verde'>_proyectamos diseños que cuentan <br />
              <strong>historias memorables.</strong></p>
              <p className='verde'>_los desarrollamos y los convertimos <br />
              <strong>en productos que arrancan sonrisas.</strong></p>
            </div>

          </div>
        </section>
     
     




      {/* Sección Let's Talk - Dark Theme */}
      <section className="lets-talk-section bg-black py-24 relative w-screen" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-pattern" style={{
            background: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            width: '100%',
            height: '100%'
          }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Top Section - Get Started */}
          <div className="mb-8 flex items-center justify-center">
            <p className="text-white text-lg font-body mr-3">
              ¿Empezamos un Proyecto?
            </p>
            <div className="w-6 h-6 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-tight mb-12 font-heading">
            HABLEMOS
          </h2>

          {/* Contact Information */}
          <div className="inline-block">
            <div className="bg-black border border-white/20 rounded-full px-8 py-4 hover:border-white/40 transition-colors duration-300">
              <a
                href="mailto:info@lbpremium.com"
                className="text-white text-xl font-body hover:text-gray-300 transition-colors duration-300"
              >
                info@lbpremium.com
              </a>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
