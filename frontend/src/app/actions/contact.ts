'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitContact(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const message = formData.get('message') as string
  
  // Validar datos
  if (!name || !email || !message) {
    throw new Error('Los campos nombre, email y mensaje son requeridos')
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('El email no es válido')
  }
  
  try {
    // Simular envío de email (aquí conectarías con tu servicio de email)
    console.log('Enviando email de contacto:', {
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString()
    })
    
    // En producción, aquí enviarías el email real:
    // await sendEmail({
    //   to: 'info@lbpremium.com',
    //   subject: `Nuevo contacto de ${name}`,
    //   body: `
    //     Nombre: ${name}
    //     Email: ${email}
    //     Teléfono: ${phone || 'No proporcionado'}
    //     Mensaje: ${message}
    //   `
    // })
    
    // Revalidar la página para mostrar el estado actualizado
    revalidatePath('/contacto')
    
    // Redirigir con parámetro de éxito
    redirect('/contacto?success=true')
    
  } catch (error) {
    console.error('Error enviando contacto:', error)
    throw new Error('Error al enviar el mensaje. Inténtalo de nuevo.')
  }
}

export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get('email') as string
  
  if (!email) {
    throw new Error('El email es requerido')
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('El email no es válido')
  }
  
  try {
    // Conectar con el backend
    // En el servidor, usar API_URL (apunta a backend:3001 en Docker)
    // En el cliente, usar NEXT_PUBLIC_API_URL (apunta a localhost:3001)
    const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    
    console.log('🔗 Newsletter: Using API_URL:', API_URL)
    
    const response = await fetch(`${API_URL}/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al suscribirse')
    }
    
    const data = await response.json()
    console.log('✅ Nueva suscripción a newsletter:', data)
    
    revalidatePath('/')
    
    // No hacer redirect, solo retornar éxito para que el componente maneje el estado
    return { success: true, message: data.message }
    
  } catch (error) {
    console.error('Error suscribiendo a newsletter:', error)
    throw error instanceof Error ? error : new Error('Error al suscribirse. Inténtalo de nuevo.')
  }
}
