'use client'

import { useEffect, useRef, useState } from 'react'
import { getImageUrl, API_CONFIG } from '@/lib/config'
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
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Disney%2B_logo.svg/2560px-Disney%2B_logo.svg.png',
      isActive: true,
      order: 1
    },
    {
      id: 'la-saltena',
      name: 'La Salteña',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/La_Salte%C3%B1a_logo.svg/1200px-La_Salte%C3%B1a_logo.svg.png',
      isActive: true,
      order: 2
    },
    {
      id: 'brubank',
      name: 'Brubank',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Brubank_logo.svg/1200px-Brubank_logo.svg.png',
      isActive: true,
      order: 3
    },
    {
      id: 'stockcenter',
      name: 'Stockcenter',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Stockcenter_logo.svg/1200px-Stockcenter_logo.svg.png',
      isActive: true,
      order: 4
    },
    {
      id: 'uber',
      name: 'Uber',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Uber_logo_2018.png/1200px-Uber_logo_2018.png',
      isActive: true,
      order: 5
    },
    {
      id: 'honda',
      name: 'Honda',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Honda_logo.svg/1200px-Honda_logo.svg.png',
      isActive: true,
      order: 6
    },
    {
      id: 'dexter',
      name: 'Dexter',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Dexter_logo.svg/1200px-Dexter_logo.svg.png',
      isActive: true,
      order: 7
    }
  ]
}

export function BrandsSlider() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Dividir las marcas en 3 filas
  const brandsPerRow = Math.ceil(brands.length / 3)
  const row1 = brands.slice(0, brandsPerRow)
  const row2 = brands.slice(brandsPerRow, brandsPerRow * 2)
  const row3 = brands.slice(brandsPerRow * 2)
  
  // Duplicar cada fila para crear un loop infinito
  const duplicatedRow1 = [...row1, ...row1]
  const duplicatedRow2 = [...row2, ...row2]
  const duplicatedRow3 = [...row3, ...row3]

  // Crear refs para cada fila
  const sliderRef1 = useRef<HTMLDivElement>(null)
  const sliderRef2 = useRef<HTMLDivElement>(null)
  const sliderRef3 = useRef<HTMLDivElement>(null)

  // Animación para cada fila
  useEffect(() => {
    const animateRow = (ref: React.RefObject<HTMLDivElement>, delay: number) => {
      if (!ref.current) return
      
      const animate = () => {
        if (ref.current) {
          ref.current.style.animation = 'none'
          ref.current.offsetHeight // Trigger reflow
          ref.current.style.animation = 'scroll 20s linear infinite'
        }
      }
      
      return setTimeout(animate, delay)
    }

    const timeout1 = animateRow(sliderRef1, 0)
    const timeout2 = animateRow(sliderRef2, 100)
    const timeout3 = animateRow(sliderRef3, 200)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      if (sliderRef1.current) sliderRef1.current.style.animation = 'none'
      if (sliderRef2.current) sliderRef2.current.style.animation = 'none'
      if (sliderRef3.current) sliderRef3.current.style.animation = 'none'
    }
  }, [brands])

  const renderRow = (rowBrands: Brand[], rowRef: React.RefObject<HTMLDivElement>, rowIndex: number) => {
    if (rowBrands.length === 0) return null
    
    return (
      <div 
        key={rowIndex}
        className="relative overflow-hidden w-full mb-4"
      >
        <div 
          ref={rowRef}
          className="flex md:animate-scroll"
          style={{
            animation: 'scroll 20s linear infinite',
            gap: '6px'
          }}
        >
          {rowBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${rowIndex}-${index}`}
              className="flex-shrink-0 flex items-center justify-center w-[120px] md:w-[120px]"
              style={{ height: '96px' }}
            >
              <div className="flex items-center justify-center w-full h-full p-2 transition-colors duration-300">
                <img
                  src={getImageUrl(brand.logo)}
                  alt={brand.name}
                  className="max-h-16 max-w-full object-contain transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDE0IDE0LjY4NjMgMTQgMThDMTQgMjEuMzEzNyAxNi42ODYzIDI0IDIwIDI0QzIzLjMxMzcgMjQgMjYgMjEuMzEzNyAyNiAxOEMyNiAxNC42ODYzIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo='
                    e.currentTarget.alt = `${brand.name} logo`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

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

        {/* Slider de marcas con 3 filas */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden w-full"
        >
          {renderRow(duplicatedRow1, sliderRef1, 1)}
          {renderRow(duplicatedRow2, sliderRef2, 2)}
          {renderRow(duplicatedRow3, sliderRef3, 3)}
        </div>
      </div>

    </div>
  )
}
