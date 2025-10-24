'use client'

import { memo } from 'react'
import { Button } from '@/components/ui/button'

interface TitleStyleEditorProps {
  formData: {
    titleColor: string
    titleSize: string
    titleShadow: string
    title: string
  }
  onStyleChange: (field: string, value: string) => void
  onReset: () => void
  onExample: () => void
}

const TitleStyleEditor = memo(function TitleStyleEditor({ 
  formData, 
  onStyleChange, 
  onReset, 
  onExample 
}: TitleStyleEditorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-3">
        Estilos del Título
      </label>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Color</label>
          <div className="flex gap-1">
            <input
              type="color"
              value={formData.titleColor || '#1E4BA6'}
              onChange={(e) => onStyleChange('titleColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer hover:opacity-80"
            />
            <input
              type="text"
              value={formData.titleColor || '#1E4BA6'}
              onChange={(e) => onStyleChange('titleColor', e.target.value)}
              className="w-20 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Tamaño</label>
          <input
            type="text"
            value={formData.titleSize || '4rem'}
            onChange={(e) => onStyleChange('titleSize', e.target.value)}
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="4rem"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Sombra</label>
          <input
            type="text"
            value={formData.titleShadow || 'none'}
            onChange={(e) => onStyleChange('titleShadow', e.target.value)}
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="none"
          />
        </div>
      </div>

      {/* Vista Previa del Título */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">• Vista Previa del Título</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-xs"
          >
            Reset
          </Button>
        </div>
        <div 
          className="text-center p-4 bg-white rounded border overflow-hidden"
          style={{
            color: formData.titleColor || '#1E4BA6',
            fontSize: formData.titleSize || '4rem',
            textShadow: formData.titleShadow || 'none',
            fontWeight: 'bold'
          }}
        >
          {formData.title || 'Título de ejemplo'}
        </div>
      </div>
    </div>
  )
})

export default TitleStyleEditor