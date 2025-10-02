'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getImageUrl, getApiUrl } from '@/lib/imageUtils'

interface MultiImageUploadProps {
  onImagesChange: (images: string[]) => void
  currentImages?: string[]
  maxImages?: number
  className?: string
}

export default function MultiImageUpload({ 
  onImagesChange, 
  currentImages = [], 
  maxImages = 6,
  className = '' 
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [localImages, setLocalImages] = useState<string[]>(currentImages)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sincronizar con las imágenes externas
  useEffect(() => {
    setLocalImages(currentImages)
  }, [currentImages])

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
     if (files.length > 0 && localImages.length < maxImages) {
       handleFileUpload(files[0], localImages.length)
     }
   }

   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files
     if (files && files.length > 0 && localImages.length < maxImages) {
       handleFileUpload(files[0], localImages.length)
     }
   }

  const handleFileUpload = async (file: File, index: number) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona solo archivos de imagen')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('El archivo es demasiado grande. Máximo 5MB')
      return
    }

    setIsUploading(true)
    setUploadingIndex(index)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const apiUrl = getApiUrl()
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
      })

             if (response.ok) {
         const data = await response.json()
         console.log('Image uploaded successfully:', data.imageUrl)
         const newImages = [...localImages]
         newImages[index] = data.imageUrl
         console.log('Updated images array:', newImages)
         // Actualizar estado local inmediatamente
         setLocalImages([...newImages])
         // Notificar al componente padre
         onImagesChange([...newImages])
       } else {
         alert('Error al subir la imagen')
       }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error al subir la imagen')
    } finally {
      setIsUploading(false)
      setUploadingIndex(null)
    }
  }

     const handleRemoveImage = (index: number) => {
     const newImages = localImages.filter((_, i) => i !== index)
     setLocalImages(newImages)
     onImagesChange(newImages)
   }

   const handleAddImage = () => {
     if (localImages.length < maxImages) {
       fileInputRef.current?.click()
     }
   }

     const renderImageSlot = (image: string, index: number) => (
     <div key={index} className="relative group w-[150px]">
       <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
        <img
          src={getImageUrl(image)}
          alt={`Imagen ${index + 1}`}
          className="w-full h-full object-cover"
          onLoad={() => console.log('Image loaded successfully:', image)}
          onError={(e) => {
            console.error('Error loading image:', image)
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.classList.remove('hidden')
          }}
        />
        {/* Fallback cuando la imagen no carga */}
        <div className="hidden w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Error</p>
          </div>
        </div>
        
      </div>
    </div>
  )

     const renderUploadSlot = (index: number) => (
     <div key={index} className="relative w-[150px]">
       <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        {isUploading && uploadingIndex === index ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Subiendo...</p>
          </div>
        ) : (
          <div className="text-center">
            <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Agregar</p>
          </div>
        )}
      </div>
    </div>
  )

     const renderDragDropArea = () => (
     <div
       className={`w-[150px] aspect-square border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
         isDragging
           ? 'border-blue-500 bg-blue-50'
           : 'border-gray-300 hover:border-gray-400'
       }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleAddImage}
    >
      <div className="text-center">
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Arrastra aquí</p>
        <p className="text-xs text-gray-500">o haz clic</p>
      </div>
    </div>
  )

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      
       

       
       <div className="flex flex-wrap gap-4">
         {/* Mostrar imágenes existentes */}
         {localImages.map((image, index) => renderImageSlot(image, index))}
         
         {/* Mostrar slots vacíos o área de upload */}
         {localImages.length < maxImages && (
           localImages.length === 0 ? (
             renderDragDropArea()
           ) : (
             <div
               className="cursor-pointer"
               onClick={handleAddImage}
             >
               {renderUploadSlot(localImages.length)}
             </div>
           )
         )}
       </div>
       
       <div className="text-sm text-gray-500">
         {localImages.length} de {maxImages} imágenes
       </div>
    </div>
  )
}
