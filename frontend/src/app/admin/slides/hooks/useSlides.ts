import { useState, useEffect } from 'react'
import { Slide } from '@/types'
import { getApiUrl } from '@/lib/config'

export function useSlides() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSlides = async () => {
    try {
      console.log('🔄 Frontend: Fetching slides...')
      const response = await fetch(getApiUrl('/slides'))
      console.log('📡 Frontend: Response status:', response.status)
      
      const data = await response.json()
      console.log('📊 Frontend: Slides data:', data)
      
      if (response.ok) {
        setSlides(data)
        console.log('✅ Frontend: Slides loaded successfully')
      } else {
        console.error('❌ Frontend: Error loading slides:', data.message)
      }
    } catch (error) {
      console.error('❌ Frontend: Error fetching slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSlide = async (slideData: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('📝 Frontend: Creating slide with data:', slideData)
      const response = await fetch(getApiUrl('/slides'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      })
      
      if (response.ok) {
        console.log('✅ Frontend: Slide created successfully')
        await fetchSlides()
        return true
      } else {
        console.error('❌ Frontend: Error creating slide')
        return false
      }
    } catch (error) {
      console.error('❌ Frontend: Error creating slide:', error)
      return false
    }
  }

  const updateSlide = async (id: string, slideData: Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('✏️ Frontend: Updating slide with ID:', id)
      const response = await fetch(getApiUrl(`/slides/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      })
      
      if (response.ok) {
        console.log('✅ Frontend: Slide updated successfully')
        await fetchSlides()
        return true
      } else {
        console.error('❌ Frontend: Error updating slide')
        return false
      }
    } catch (error) {
      console.error('❌ Frontend: Error updating slide:', error)
      return false
    }
  }

  const deleteSlide = async (id: string) => {
    try {
      console.log('🗑️ Frontend: Deleting slide with ID:', id)
      const response = await fetch(getApiUrl(`/slides/${id}`), {
        method: 'DELETE',
      })
      
      if (response.ok) {
        console.log('✅ Frontend: Slide deleted successfully')
        await fetchSlides()
        return true
      } else {
        console.error('❌ Frontend: Error deleting slide')
        return false
      }
    } catch (error) {
      console.error('❌ Frontend: Error deleting slide:', error)
      return false
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  return {
    slides,
    loading,
    fetchSlides,
    createSlide,
    updateSlide,
    deleteSlide
  }
}
