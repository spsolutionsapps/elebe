'use client'

import { useState } from 'react'
import { Slide } from '@/types'
import { ConfirmModal } from '@/components/ConfirmModal'
import { SuccessModal } from '@/components/SuccessModal'
import { useModal } from '@/hooks/useModal'
import { useSlides } from './hooks/useSlides'
import { useSlideForm } from './hooks/useSlideForm'
import SlideList from './components/SlideList'
import SlideForm from './components/SlideForm'
import SlidePreview from './components/SlidePreview'

export default function SlidesPage() {
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useModal()
  const { slides, loading, createSlide, updateSlide, deleteSlide } = useSlides()
  const { 
    formData, 
    editingSlide, 
    showForm, 
    updateFormData, 
    resetForm, 
    openNewSlideForm, 
    openEditForm, 
    closeForm 
  } = useSlideForm()
  
  const [previewSlide, setPreviewSlide] = useState<Slide | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  
  // Estado para el modal de éxito
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: '',
    message: ''
  })

  const handleDelete = (id: string) => {
    console.log('🗑️ Frontend: Delete slide clicked for ID:', id)
    setDeleteId(id)
    showConfirm({
      title: '¿Estás seguro de que quieres eliminar este slide?',
      message: 'Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger'
    })
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    
    try {
      console.log('🗑️ Frontend: Confirming delete for slide ID:', deleteId)
      await deleteSlide(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error('❌ Frontend: Error deleting slide:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📝 Frontend: Form submitted with data:', formData)
    
    try {
      const slideData = {
        title: formData.title,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
        buttonBackgroundColor: formData.buttonBackgroundColor,
        buttonTextColor: formData.buttonTextColor,
        buttonBorderColor: formData.buttonBorderColor,
        buttonBorderRadius: formData.buttonBorderRadius,
        buttonBoxShadow: formData.buttonBoxShadow,
        titleColor: formData.titleColor,
        titleSize: formData.titleSize,
        titleShadow: formData.titleShadow,
        image: formData.image,
        mobileImage: formData.mobileImage || null,
        videoUrl: formData.videoUrl || null,
        mobileVideoUrl: formData.mobileVideoUrl || null,
        order: formData.order,
        isActive: true
      }

      let success = false
      if (editingSlide) {
        success = await updateSlide(editingSlide.id, slideData)
        if (success) {
          setSuccessModal({
            isOpen: true,
            title: 'Slide Actualizado',
            message: 'El slide se ha actualizado exitosamente y ya está visible en el carrusel.'
          })
        }
      } else {
        success = await createSlide(slideData)
        if (success) {
          setSuccessModal({
            isOpen: true,
            title: 'Slide Publicado',
            message: 'El slide se ha creado exitosamente y ya está visible en el carrusel.'
          })
        }
      }
      
      if (success) {
        resetForm()
      }
    } catch (error) {
      console.error('❌ Frontend: Error saving slide:', error)
    }
  }

  const handlePreview = (slide: Slide) => {
    setPreviewSlide(slide)
  }

  const handleFormPreview = () => {
    // Crear un objeto slide temporal para la vista previa
    const tempSlide: Slide = {
      id: 'preview',
      title: formData.title,
      subtitle: '',
      description: '',
      buttonText: formData.buttonText,
      buttonLink: formData.buttonLink,
      buttonBackgroundColor: formData.buttonBackgroundColor,
      buttonTextColor: formData.buttonTextColor,
      buttonBorderColor: formData.buttonBorderColor,
      buttonBorderRadius: formData.buttonBorderRadius,
      buttonBoxShadow: formData.buttonBoxShadow,
      titleColor: formData.titleColor,
      titleSize: formData.titleSize,
      titleShadow: formData.titleShadow,
      image: formData.image,
      mobileImage: formData.mobileImage || null,
      videoUrl: formData.videoUrl || null,
      mobileVideoUrl: formData.mobileVideoUrl || null,
      order: formData.order,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setPreviewSlide(tempSlide)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirmDelete}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
      />

      {!showForm && (
        <SlideList
          slides={slides}
          onNewSlide={openNewSlideForm}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onPreview={handlePreview}
        />
      )}

      {showForm && (
        <SlideForm
          formData={formData}
          editingSlide={editingSlide}
          onFormDataChange={updateFormData}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          onPreview={handleFormPreview}
        />
      )}

      <SlidePreview
        slide={previewSlide}
        onClose={() => setPreviewSlide(null)}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
        autoCloseDelay={4000}
      />
    </div>
  )
}