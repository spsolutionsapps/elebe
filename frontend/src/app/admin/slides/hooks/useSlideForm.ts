import { useState } from 'react'
import { Slide } from '@/types'

export interface SlideFormData {
  title: string
  buttonText: string
  buttonLink: string
  buttonBackgroundColor: string
  buttonTextColor: string
  buttonBorderColor: string
  buttonBorderWidth: string
  buttonBorderRadius: string
  buttonBoxShadow: string
  titleColor: string
  titleSize: string
  titleShadow: string
  image: string
  order: number
}

const initialFormData: SlideFormData = {
  title: '',
  buttonText: '',
  buttonLink: '',
  buttonBackgroundColor: '#F7DA4D',
  buttonTextColor: '#005DB9',
  buttonBorderColor: '',
  buttonBorderWidth: '2px',
  buttonBorderRadius: '0px',
  buttonBoxShadow: '',
  titleColor: '#1E4BA6',
  titleSize: '4rem',
  titleShadow: 'none',
  image: '',
  order: 1
}

export function useSlideForm() {
  const [formData, setFormData] = useState<SlideFormData>(initialFormData)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [showForm, setShowForm] = useState(false)

  const updateFormData = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setEditingSlide(null)
    setShowForm(false)
    console.log('🔄 Frontend: Form reset')
  }

  const openNewSlideForm = () => {
    setFormData(initialFormData)
    setEditingSlide(null)
    setShowForm(true)
    console.log('✅ Frontend: New slide form opened')
  }

  const openEditForm = (slide: Slide) => {
    console.log('✏️ Frontend: Edit slide clicked for ID:', slide.id)
    setFormData({
      title: slide.title || '',
      buttonText: slide.buttonText || '',
      buttonLink: slide.buttonLink || '',
      buttonBackgroundColor: slide.buttonBackgroundColor || '#F7DA4D',
      buttonTextColor: slide.buttonTextColor || '#005DB9',
      buttonBorderColor: slide.buttonBorderColor || '',
      buttonBorderWidth: slide.buttonBorderWidth || '2px',
      buttonBorderRadius: slide.buttonBorderRadius || '0px',
      buttonBoxShadow: slide.buttonBoxShadow || '',
      titleColor: slide.titleColor || '#1E4BA6',
      titleSize: slide.titleSize || '4rem',
      titleShadow: slide.titleShadow || 'none',
      image: slide.image || '',
      order: slide.order || 1
    })
    setEditingSlide(slide)
    setShowForm(true)
    console.log('✅ Frontend: Edit form opened with slide data')
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingSlide(null)
  }

  return {
    formData,
    editingSlide,
    showForm,
    updateFormData,
    resetForm,
    openNewSlideForm,
    openEditForm,
    closeForm
  }
}
