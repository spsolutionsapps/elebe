'use client'

import { useEffect, useState } from 'react'
import { getImageUrl, API_CONFIG } from '@/lib/config'

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

export function BrandsGrid() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

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

        {/* Grid de marcas - Diseño simple sin slider */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow duration-300"
              style={{ height: '120px' }}
            >
              <img
                src={getImageUrl(brand.logo)}
                alt={brand.name}
                className="max-h-16 max-w-full object-contain transition-all duration-300 hover:scale-105"
                onError={(e) => {
                  // Reemplazar con un placeholder elegante sin logs de error
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDE0IDE0LjY4NjMgMTQgMThDMTQgMjEuMzEzNyAxNi42ODYzIDI0IDIwIDI0QzIzLjMxMzcgMjQgMjYgMjEuMzEzNyAyNiAxOEMyNiAxNC42ODYzIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo='
                  e.currentTarget.alt = `${brand.name} logo`
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
