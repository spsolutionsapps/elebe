'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Package, Eye, EyeOff, Grid3X3 } from 'lucide-react'

interface ProductStatsProps {
  total: number
  active: number
  inactive: number
  categoriesCount: number
  totalViews: number
}

export default function ProductStats({ 
  total, 
  active, 
  inactive, 
  categoriesCount, 
  totalViews 
}: ProductStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-600">Total Productos</p>
              <p className="text-2xl font-bold text-blue-700">{total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-600">Activos</p>
              <p className="text-2xl font-bold text-green-700">{active}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center">
            <EyeOff className="h-8 w-8 text-gray-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-gray-700">{inactive}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Grid3X3 className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-600">Categorías</p>
              <p className="text-2xl font-bold text-purple-700">{categoriesCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-orange-600">Total Vistas</p>
              <p className="text-2xl font-bold text-orange-700">{totalViews}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
