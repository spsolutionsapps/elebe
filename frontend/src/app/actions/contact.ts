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
    // Simular suscripción (aquí conectarías con tu servicio de email marketing)
    console.log('Nueva suscripción a newsletter:', {
      email,
      timestamp: new Date().toISOString()
    })
    
    revalidatePath('/')
    redirect('/?newsletter=success')
    
  } catch (error) {
    console.error('Error suscribiendo a newsletter:', error)
    throw new Error('Error al suscribirse. Inténtalo de nuevo.')
  }
}
