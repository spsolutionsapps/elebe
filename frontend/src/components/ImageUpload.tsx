'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getImageUrl, getApiUrl } from '@/lib/imageUtils'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  currentImage?: string
  className?: string
}

export default function ImageUpload({ onImageUpload, currentImage, className = '' }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [displayImage, setDisplayImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sincronizar el estado interno con el prop currentImage
  useEffect(() => {
    setDisplayImage(currentImage || '')
  }, [currentImage])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona solo archivos de imagen')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('El archivo es demasiado grande. Máximo 5MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const apiUrl = getApiUrl()
      console.log('API URL:', apiUrl)
      console.log('Upload URL:', `${apiUrl}/upload`)

      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setDisplayImage(data.imageUrl)
        onImageUpload(data.imageUrl)
      } else {
        alert('Error al subir la imagen')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setDisplayImage('')
    onImageUpload('')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {displayImage ? (
        <div className="flex gap-4">
          {/* Área de carga - más compacta */}
          <div className="flex-1">
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="space-y-2">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm text-gray-600">
                    {isUploading ? (
                      'Subiendo imagen...'
                    ) : (
                      <>
                        Cambiar imagen o{' '}
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-700 underline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          seleccionar archivo
                        </button>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF hasta 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vista previa de la imagen */}
          <div className="flex-1">
            <div className="relative group">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={getImageUrl(displayImage)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {/* Overlay con icono de eliminar */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="space-y-2">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm text-gray-600">
                {isUploading ? (
                  'Subiendo imagen...'
                ) : (
                  <>
                    Arrastra una imagen aquí o{' '}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 underline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      selecciona un archivo
                    </button>
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF hasta 5MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
