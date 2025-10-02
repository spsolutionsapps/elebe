'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter, Grid3X3, List } from 'lucide-react'
import Select, { SingleValue } from 'react-select'

// Tipo para las opciones de React Select
type SelectOption = {
  value: string
  label: string
}

interface ProductFiltersProps {
  // Estados de filtros
  searchTerm: string
  selectedCategory: string
  statusFilter: string
  viewMode: 'grid' | 'table'
  sortBy: 'name' | 'category' | 'createdAt' | 'views'
  sortOrder: 'asc' | 'desc'
  
  // Handlers
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onViewModeChange: (mode: 'grid' | 'table') => void
  onSortChange: (field: 'name' | 'category' | 'createdAt' | 'views', order: 'asc' | 'desc') => void
  onClearFilters: () => void
  
  // Opciones
  categories: string[]
  hasActiveFilters: boolean
}

export default function ProductFilters({
  searchTerm,
  selectedCategory,
  statusFilter,
  viewMode,
  sortBy,
  sortOrder,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onViewModeChange,
  onSortChange,
  onClearFilters,
  categories,
  hasActiveFilters
}: ProductFiltersProps) {
  
  // Opciones para los selects
  const filterCategoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map(category => ({ value: category, label: category }))
  ]

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Solo activos' },
    { value: 'inactive', label: 'Solo inactivos' }
  ]

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Más recientes' },
    { value: 'createdAt-asc', label: 'Más antiguos' },
    { value: 'name-asc', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
    { value: 'category-asc', label: 'Categoría A-Z' },
    { value: 'category-desc', label: 'Categoría Z-A' }
  ]

  // Estilos personalizados para React Select (flat/minimalista según preferencias)
  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: '#d1d5db',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9ca3af'
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#2563eb' : '#f3f4f6'
      }
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#374151'
    })
  }

  const handleSortChange = (selectedOption: SingleValue<SelectOption>) => {
    if (selectedOption) {
      const [field, order] = selectedOption.value.split('-') as [typeof sortBy, typeof sortOrder]
      onSortChange(field, order)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* Filtro por categoría */}
            <div className="w-48">
              <Select
                value={filterCategoryOptions.find(option => option.value === selectedCategory)}
                onChange={(selectedOption: SingleValue<SelectOption>) => {
                  onCategoryChange(selectedOption?.value || '')
                }}
                options={filterCategoryOptions}
                styles={customSelectStyles}
                placeholder="Todas las categorías"
                isSearchable={false}
              />
            </div>

            {/* Filtro por estado */}
            <div className="w-40">
              <Select
                value={statusOptions.find(option => option.value === statusFilter)}
                onChange={(selectedOption: SingleValue<SelectOption>) => {
                  onStatusChange(selectedOption?.value || 'all')
                }}
                options={statusOptions}
                styles={customSelectStyles}
                placeholder="Todos los estados"
                isSearchable={false}
              />
            </div>

            {/* Botón limpiar filtros */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="text-gray-600 hover:text-gray-800 rounded-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>

          {/* Controles de vista */}
          <div className="flex items-center gap-2">
            {/* Ordenamiento */}
            <div className="w-48">
              <Select
                value={sortOptions.find(option => option.value === `${sortBy}-${sortOrder}`)}
                onChange={handleSortChange}
                options={sortOptions}
                styles={customSelectStyles}
                placeholder="Ordenar por..."
                isSearchable={false}
              />
            </div>

            {/* Botones de vista */}
            <div className="flex border border-gray-300 rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-r-none border-r border-gray-300"
                style={viewMode === 'grid' ? { backgroundColor: '#2563eb' } : {}}
                title="Vista de grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('table')}
                className="rounded-l-none"
                style={viewMode === 'table' ? { backgroundColor: '#2563eb' } : {}}
                title="Vista de tabla"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
