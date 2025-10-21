'use client'

import { useEffect, useRef, useState } from 'react'
import { getImageUrl } from '@/lib/imageUtils'
import { API_CONFIG } from '@/lib/config'
import { OptimizedImage } from '@/components/OptimizedImage'

interface Brand {
  id: string
  name: string
  logo: string
  website?: string
  isActive: boolean
  order: number
}

// Función para obtener marcas de fallback
function getFallbackBrands(): Brand[] {
  return [
    {
      id: 'disney',
      name: 'Disney',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Disney-Logo.png',
      isActive: true,
      order: 1
    },
    {
      id: 'marvel',
      name: 'Marvel',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Marvel-Logo.png',
      isActive: true,
      order: 2
    },
    {
      id: 'coca-cola',
      name: 'Coca Cola',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/Coca-Cola-Logo.png',
      isActive: true,
      order: 3
    },
    {
      id: 'mercadolibre',
      name: 'Mercado Libre',
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/MercadoLibre-Logo.png',
      isActive: true,
      order: 4
    },
    {
      id: 'globant',
      name: 'Globant',
      logo: 'https://logos-world.net/wp-content/uploads/2021/08/Globant-Logo.png',
      isActive: true,
      order: 5
    }
  ]
}

export function BrandsSlider() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Cargar marcas del backend - solo en el cliente
  useEffect(() => {
    let isMounted = true

    const fetchBrands = async () => {
      try {
        const apiUrl = API_CONFIG.BASE_URL
        const response = await fetch(`${apiUrl}/brands/active`)
        
        if (!isMounted) return

        if (response.ok) {
          const data = await response.json()
          
          // Verificar si las marcas tienen URLs válidas
          const validBrands = data.filter((brand: any) => {
            const hasLogo = brand.logo && brand.logo.trim() !== ''
            return hasLogo
          })
          
          if (validBrands.length > 0) {
            setBrands(validBrands)
          } else {
            // Si no hay URLs válidas, usar fallback
            setBrands(getFallbackBrands())
          }
        } else {
          // Usar fallback data solo si el componente sigue montado
          if (isMounted) {
            setBrands(getFallbackBrands())
          }
        }
      } catch (error) {
        // Usar fallback data solo si el componente sigue montado
        if (isMounted) {
          setBrands(getFallbackBrands())
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchBrands()

    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!sliderRef.current || brands.length === 0) return

    // Crear animación infinita
    const animateSlider = () => {
      if (sliderRef.current) {
        sliderRef.current.style.animation = 'none'
        sliderRef.current.offsetHeight // Trigger reflow
        sliderRef.current.style.animation = 'scroll 20s linear infinite'
      }
    }

    // Iniciar animación con un pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(animateSlider, 100)

    // Limpiar animación al desmontar
    return () => {
      clearTimeout(timeoutId)
      if (sliderRef.current) {
        sliderRef.current.style.animation = 'none'
      }
    }
  }, [brands])

  // Duplicar las marcas para crear un loop infinito
  const duplicatedBrands = [...brands, ...brands]

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-32">
          <div style={{borderRadius: '150px'}} className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300 font-body">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (brands.length === 0) {
    return null // No mostrar nada si no hay marcas
  }

  return (
    <div className="py-12" style={{ marginTop: '20px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título minimalista */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="w-16 h-px bg-gray-600 mr-4"></div>
            <h2 className="text-lg font-bold font-blue uppercase tracking-wider font-heading">
              Clientes con los que trabajamos
            </h2>
            <div className="flex-1 h-px bg-gray-600 ml-4"></div>
          </div>
        </div>

        {/* Slider de marcas - Contenido dentro del contenedor */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden w-full"
        >
          <div 
            ref={sliderRef}
            className="flex md:animate-scroll"
            style={{
              animation: 'scroll 20s linear infinite'
            }}
          >
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 mx-2 flex items-center justify-center w-[120px] md:w-[260px]"
                style={{ height: '96px' }}
              >
                <div className="flex items-center justify-center w-full h-full p-2 transition-colors duration-300">
                    <img
                      src={getImageUrl(brand.logo)}
                      alt={brand.name}
                      className="max-h-16 max-w-full object-contain transition-all duration-300"
                      onError={(e) => {
                        // Reemplazar con un placeholder elegante sin logs de error
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDE0IDE0LjY4NjMgMTQgMThDMTQgMjEuMzEzNyAxNi42ODYzIDI0IDIwIDI0QzIzLjMxMzcgMjQgMjYgMjEuMzEzNyAyNiAxOEMyNiAxNC42ODYzIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo='
                        e.currentTarget.alt = `${brand.name} logo`
                      }}
                    />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
