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
import { ClientOnly } from '@/components/ClientOnly'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

// Función para obtener la URL de la imagen
import { getImageUrl as getImageUrlFromConfig } from '@/lib/config';

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
        // Usar localhost para el fetch desde el cliente
        const apiUrl = 'http://localhost:3001/api'

        // Fetch slides
        const slidesResponse = await fetch(`${apiUrl}/slides`)
        if (slidesResponse.ok) {
          const slidesData = await slidesResponse.json()
          setSlides(slidesData.filter((slide: Slide) => slide.isActive))
        }

        // Fetch featured products
        const productsResponse = await fetch(`${apiUrl}/products/featured`)
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setFeaturedProducts(productsData.filter((product: Product) => product.isActive))
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
                Ofrecemos una Solución Creativa para las Empresas que Necesitan Darle Exposición a su Marca. Nos especializamos en el diseño de kits, textiles, marroquinería y servicios de impresión de alta calidad en diversos soportes.
              </p>
              <p className="text-[18px] font-blue leading-relaxed text-center lg:text-left">
                Nuestra experiencia en el sector y nuestra fábrica homologada por Disney, garantizan productos de primera clase. Potenciamos tu marca con nuestra amplia gama de opciones de merchandising tradicional y soluciones de impresión premium.
              </p>
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
                    src="/shapeAmarilloDer.svg"
                    alt="LB ShapeDer"
                  />
    </div>

      </section>



  {/* Sección de Servicios Destacados */}
      <div className="space-y-0">
     
          <ClientOnly>
            <ServicesHighlightedSection />
          </ClientOnly>
        
      </div>




      <div className="space-y-0 relative z-[100]">
        {/* Featured Products */}
        <section className="featured-products-section relative z-[100] py-16" >
          <div className="container mx-auto px-4">
            <ClientOnly>
              <FeaturedProductsSlider products={featuredProducts} />
            </ClientOnly>
          </div>
        </section>
     
      </div>



      {/* Nueva Sección Dark - Proceso de Trabajo - FULL WIDTH */}
      <section className="process-section py-20 relative z-[150] w-screen" style={{
        backgroundColor: '#12161E',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header del Proceso */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

            {/* Lado Izquierdo - Elementos Visuales */}
            <div className="relative">
              {/* Círculo verde grande */}

              {/* Imagen con play button */}
              <div className="relative z-10 ml-8">
                <div className="relative w-full max-w-md mx-auto">
                  <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative group cursor-pointer">
                    {/* Video */}
                    <video
                      className="w-full h-full object-cover"
                      poster="/api/placeholder/400/225"
                      controls={false}
                      muted
                      loop
                    >
                      <source src="/videos/proceso-lb-premium.mp4" type="video/mp4" />
                      Tu navegador no soporta el elemento video.
                    </video>

                    {/* Overlay con botón de reproducción azul */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-all duration-300">
                      <div className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center mx-auto shadow-lg transform group-hover:scale-110 transition-all duration-300">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Derecho - Texto */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Guiados por el Proceso,<br />
                Impulsados por Resultados.
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Seguimos un flujo de trabajo optimizado e inteligente diseñado para
                eliminar fricciones y entregar resultados consistentes.
              </p>
            </div>
          </div>

          {/* Cards del Proceso */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-600/50 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-white mb-3">
                Acerca de Nosotros
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Somos una agencia dedicada al diseño y producción de artículos personalizados. Ofrecemos soluciones creativas para las empresas que necesitan darle exposición a su marca. Nuestra fábrica está homologada por Disney "International Labor Standards The Walt Disney Company Argentina S.A." Trabajamos con las fábricas más avanzadas del mercado.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-600/50 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-white mb-3">
                Servicios
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Ofrecemos diseño de kits, textiles, marroquinería, packaging, y servicios de impresión premium en una amplia gama de soportes. Nuestra experiencia y colaboración con las fábricas más avanzadas garantizan productos de primera clase. Potenciamos tu marca con nuestro merchandising tradicional y soluciones de impresión premium.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-600/50 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-white mb-3">
                Algunos de Nuestros Clientes
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                <span className="block mb-2 font-medium">(Atendemos Empresas y Negocios de todos los tamaños)</span>
                Disney, Marvel, ESPN, Molinos, Mercado Libre, Star+, Globant, Día, KTM, Coca Cola, Stella Artois, Poker Stars, Yamaha, Honda, Alpinestars, Noblex, La Salteña, Bigbox, Cat, Flex, Monster, Patagonia, Perica, Miss Mundo Argentina, Toyota, Cienfuegos, Ansilta, Metalconf, Soulmax, La Plata Clima, Tascani, Brubank, Pani, Molinos Ferba, Uber, Quento Snaks, PHM, Nipro, Lavazza, Gaona, Jugos Tutti, Herencia Custom Garage, Grupo Dabra, Dexter, LG.
              </p>
            </div>

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
