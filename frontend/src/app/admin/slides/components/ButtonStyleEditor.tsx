'use client'

import { Button } from '@/components/ui/button'

interface ButtonStyleEditorProps {
  formData: {
    buttonBackgroundColor: string
    buttonTextColor: string
    buttonBorderColor: string
    buttonBorderWidth: string
    buttonBorderRadius: string
    buttonBoxShadow: string
    buttonText: string
  }
  onStyleChange: (field: string, value: string) => void
  onReset: () => void
  onExample: () => void
}

export default function ButtonStyleEditor({ 
  formData, 
  onStyleChange, 
  onReset, 
  onExample 
}: ButtonStyleEditorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-3">
        Estilos del Botón
      </label>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Fondo</label>
          <div className="flex gap-1">
            <input
              type="color"
              value={formData.buttonBackgroundColor}
              onChange={(e) => onStyleChange('buttonBackgroundColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer hover:opacity-80"
            />
            <input
              type="text"
              value={formData.buttonBackgroundColor}
              onChange={(e) => onStyleChange('buttonBackgroundColor', e.target.value)}
              className="w-20 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Texto</label>
          <div className="flex gap-1">
            <input
              type="color"
              value={formData.buttonTextColor}
              onChange={(e) => onStyleChange('buttonTextColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer hover:opacity-80"
            />
            <input
              type="text"
              value={formData.buttonTextColor}
              onChange={(e) => onStyleChange('buttonTextColor', e.target.value)}
              className="w-20 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Borde</label>
          <div className="flex gap-1">
            <input
              type="color"
              value={formData.buttonBorderColor}
              onChange={(e) => onStyleChange('buttonBorderColor', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer hover:opacity-80"
            />
            <input
              type="text"
              value={formData.buttonBorderColor}
              onChange={(e) => onStyleChange('buttonBorderColor', e.target.value)}
              className="w-20 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Grosor</label>
          <input
            type="text"
            value={formData.buttonBorderWidth || '2px'}
            onChange={(e) => onStyleChange('buttonBorderWidth', e.target.value)}
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="2px"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Radio</label>
          <input
            type="text"
            value={formData.buttonBorderRadius}
            onChange={(e) => onStyleChange('buttonBorderRadius', e.target.value)}
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0px"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">Sombra</label>
          <input
            type="text"
            value={formData.buttonBoxShadow}
            onChange={(e) => onStyleChange('buttonBoxShadow', e.target.value)}
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0 4px 8px rgba(0,0,0,0.1)"
          />
        </div>
      </div>

      {/* Vista Previa del Botón */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mt-6 border border-gray-200 shadow-sm">
        <h4 className="text-sm font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Vista Previa del Botón
        </h4>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div
            className="px-8 py-4 font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer transform hover:-translate-y-1"
            style={{
              backgroundColor: formData.buttonBackgroundColor,
              color: formData.buttonTextColor,
              borderColor: formData.buttonBorderColor,
              borderWidth: formData.buttonBorderColor ? (formData.buttonBorderWidth || '2px') : '0px',
              borderStyle: 'solid',
              borderRadius: formData.buttonBorderRadius,
              boxShadow: formData.buttonBoxShadow || '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {formData.buttonText || 'Texto del Botón'}
          </div>
          <div className="flex gap-2 md:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-xs bg-white hover:bg-gray-50 border-gray-300 w-full md:w-auto"
            >
              🔄 Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
