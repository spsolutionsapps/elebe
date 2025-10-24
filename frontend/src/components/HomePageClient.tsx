'use client'

import { useState, useEffect } from 'react'
import { Product, Slide } from '@/types'
import { GSAPSlider } from '@/components/GSAPSlider'
import { BrandsSlider } from '@/components/BrandsSlider'
import { FeaturedProductsSlider } from '@/components/FeaturedProductsSlider'
import { ClientOnly } from '@/components/ClientOnly'
import Link from 'next/link'

interface HomePageClientProps {
  slides: Slide[]
  featuredProducts: Product[]
}

export function HomePageClient({ slides: initialSlides, featuredProducts: initialProducts }: HomePageClientProps) {
  const [sliderControls, setSliderControls] = useState<any>(null)
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(true)

  // Cargar datos del backend cuando el componente se monte
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
        const apiUrl = `${baseUrl}/api`
        
        console.log('🔗 Fetching data from:', apiUrl)

        const [slidesResponse, productsResponse] = await Promise.all([
          fetch(`${apiUrl}/slides`),
          fetch(`${apiUrl}/products/featured`)
        ])

        if (slidesResponse.ok) {
          const slidesData = await slidesResponse.json()
          setSlides(slidesData.filter((slide: Slide) => slide.isActive))
          console.log('📈 Loaded slides:', slidesData.length)
        }

        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setFeaturedProducts(productsData.filter((product: Product) => product.isActive))
          console.log('📈 Loaded products:', productsData.length)
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  console.log('HomePageClient - slides:', slides.length, 'products:', featuredProducts.length)

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div style={{borderRadius: '150px'}} className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300 font-body">Cargando contenido...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section with GSAP Slider - Full Width */}
      {slides && slides.length > 0 ? (
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
                      <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-white hover:bg-white/80 transform -translate-y-1/2 rotate-45 origin-left  transition-colors duration-300"></div>
                      <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-white hover:bg-white/80 transform -translate-y-1/2 -rotate-45 origin-left  transition-colors duration-300"></div>
                    </div>
                  </button>

                  {/* Bullets en el centro */}
                  <div className="flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => sliderControls.handleDotClick(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === sliderControls.currentIndex
                          ? 'scale-125 shadow-lg'
                          : 'hover:scale-110'
                          }`}
                        style={{
                          backgroundColor: index === sliderControls.currentIndex 
                            ? 'rgb(23, 106, 123)' 
                            : 'rgba(23, 106, 123, 0.5)'
                        }}
                        onMouseEnter={(e) => {
                          if (index !== sliderControls.currentIndex) {
                            e.currentTarget.style.backgroundColor = 'rgba(23, 106, 123, 0.7)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (index !== sliderControls.currentIndex) {
                            e.currentTarget.style.backgroundColor = 'rgba(23, 106, 123, 0.5)'
                          }
                        }}
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
      ) : (
        // Fallback cuando no hay slides
        <section className="hero-section relative py-8 w-screen flex flex-col items-center" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%),z-index: 1' }}>
          <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-6">
                LB Premium
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Artículos personalizados de alta calidad
              </p>
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/catalogo"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver Catálogo
                </Link>
                <Link 
                  href="/contacto"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sección Quiénes Somos */}
      <section className="quienes-somos-section py-16 relative z-[110]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[36px] text-center text18Mobile text-black leading-tight mx-auto mb-12">
          Creamos <em>EXPERIENCIAS</em> para ser <br /> vividas, filmadas y viralizadas.
          </p>

          {/* Texto e imagen en la misma fila */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
            {/* Lado izquierdo - Textos descriptivos */}
            <div className="space-y-4 lg:max-w-lg">
              <p className="text-[18px] text-black leading-relaxed text-center lg:text-left">
                Somos una agencia dedicada al diseño y producción de artículos personalizados.
                Ofrecemos soluciones creativas para las empresas que necesitan darle exposición a su marca.
              </p>

              {/* Botón para ir a Nosotros */}
              <div className="flex justify-center lg:justify-start mt-6">
                <Link 
                  href="/nosotros"
                  className="bg-[rgb(0,76,172)] text-white px-6 py-3 transition-all duration-300 text-lg font-medium hover:bg-[#003a8a] inline-block rounded-none md:mt-10"
                >
                    Conocé más de la <em>agencia</em>
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

      <div className="space-y-0 relative z-[100]" style={{ backgroundColor: '#f9db46' }}>
        {/* Featured Products */}
        <section className="featured-products-section relative z-[100] py-10" >
          <div className="container mx-auto px-4">
            {featuredProducts && featuredProducts.length > 0 ? (
              <ClientOnly>
                <FeaturedProductsSlider products={featuredProducts} />
              </ClientOnly>
            ) : (
              // Fallback cuando no hay productos destacados
              <div className="text-center py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Productos Destacados
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Descubre nuestra selección de productos más populares
                </p>
                <div className="flex justify-center">
                  <Link 
                    href="/catalogo"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver Todos los Productos
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* envios */}
      <section className="envios relative z-[100] py-16 mt-0 md:mt-20" >
        <div className="container mx-auto px-4">
          <img src="/envios.svg" alt="Envíos" className='hidden md:block mx-auto mb-6' />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center ">
          <img src="/01.svg" alt="Envíos" className='block md:hidden mx-auto mb-6' />
            <p className='verde -mt-8 mb-8 md:mt-0 md:mb-0'>_escuchamos y analizamos <br />
              <strong>qué inspira a cada cliente.</strong></p>

              <img src="/02.svg" alt="Envíos" className='block md:hidden mx-auto mb-6' />

            <p className='verde -mt-8 mb-8 md:mt-0 md:mb-0'>_proyectamos diseños que cuentan <br />
              <strong>historias memorables.</strong></p>

          <img src="/03.svg" alt="Envíos" className='block md:hidden mx-auto mb-6' />

            <p className='verde -mt-8 mb-8 md:mt-0 md:mb-0'>_los desarrollamos y los convertimos <br />
              <strong>en productos que arrancan sonrisas.</strong></p>
          </div>
        </div>
      </section>
    </>
  )
}
