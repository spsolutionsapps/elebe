'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Tipos para el carrito
export interface CartItem {
  id: string
  name: string
  description: string
  image?: string
  price?: number
  quantity: number
  notes?: string
}

// Conectar con el backend usando fetch
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Función para obtener el carrito del usuario desde el backend
async function getUserCart(sessionId: string): Promise<CartItem[]> {
  try {
    // Durante el build, retornar carrito vacío para evitar errores de conexión
    if (process.env.NODE_ENV === 'production' && !process.env.BACKEND_URL) {
      return []
    }
    
    const response = await fetch(`${API_BASE_URL}/cart?sessionId=${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Error obteniendo carrito del backend')
    }
    
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error obteniendo carrito:', error)
    return []
  }
}

// Función para guardar carrito en el backend
async function saveUserCart(sessionId: string, items: CartItem[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId,
        items
      })
    })
    
    if (!response.ok) {
      throw new Error('Error guardando carrito en el backend')
    }
  } catch (error) {
    console.error('Error guardando carrito:', error)
    throw error
  }
}

export async function addToCart(productId: string, productData: {
  name: string
  description: string
  image?: string
  price?: number
}, sessionId?: string) {
  try {
    // Generar sessionId si no se proporciona (para usuarios no autenticados)
    const userSessionId = sessionId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Obtener carrito actual de la base de datos
    const currentCart = await getUserCart(userSessionId)
    
    // Buscar si el producto ya está en el carrito
    const existingItem = currentCart.find(item => item.id === productId)
    
    let updatedCart: CartItem[]
    
    if (existingItem) {
      // Incrementar cantidad
      updatedCart = currentCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      // Agregar nuevo producto
      updatedCart = [
        ...currentCart,
        {
          id: productId,
          name: productData.name,
          description: productData.description,
          image: productData.image,
          price: productData.price,
          quantity: 1,
          notes: ''
        }
      ]
    }
    
    // Guardar en la base de datos
    await saveUserCart(userSessionId, updatedCart)
    
    // Revalidar la página para mostrar el carrito actualizado
    revalidatePath('/carrito')
    revalidatePath('/')
    
    return { success: true, message: 'Producto agregado al carrito' }
    
  } catch (error) {
    console.error('Error agregando al carrito:', error)
    throw new Error('Error al agregar producto al carrito')
  }
}

export async function removeFromCart(productId: string, sessionId?: string) {
  try {
    // Generar sessionId si no se proporciona
    const userSessionId = sessionId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Obtener carrito actual
    const currentCart = await getUserCart(userSessionId)
    
    // Filtrar el producto
    const updatedCart = currentCart.filter(item => item.id !== productId)
    
    // Guardar carrito actualizado
    await saveUserCart(userSessionId, updatedCart)
    
    revalidatePath('/carrito')
    revalidatePath('/')
    
    return { success: true, message: 'Producto eliminado del carrito' }
    
  } catch (error) {
    console.error('Error eliminando del carrito:', error)
    throw new Error('Error al eliminar producto del carrito')
  }
}

export async function updateCartItemQuantity(productId: string, quantity: number, sessionId?: string) {
  try {
    // Generar sessionId si no se proporciona
    const userSessionId = sessionId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Obtener carrito actual
    const currentCart = await getUserCart(userSessionId)
    
    let updatedCart: CartItem[]
    
    if (quantity <= 0) {
      // Eliminar si cantidad es 0 o menor
      updatedCart = currentCart.filter(item => item.id !== productId)
    } else {
      // Actualizar cantidad
      updatedCart = currentCart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      )
    }
    
    // Guardar carrito actualizado
    await saveUserCart(userSessionId, updatedCart)
    
    revalidatePath('/carrito')
    
    return { success: true, message: 'Cantidad actualizada' }
    
  } catch (error) {
    console.error('Error actualizando cantidad:', error)
    throw new Error('Error al actualizar cantidad')
  }
}

export async function updateCartItemNotes(productId: string, notes: string, sessionId?: string) {
  try {
    // Generar sessionId si no se proporciona
    const userSessionId = sessionId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Obtener carrito actual
    const currentCart = await getUserCart(userSessionId)
    
    // Actualizar notas
    const updatedCart = currentCart.map(item => 
      item.id === productId 
        ? { ...item, notes }
        : item
    )
    
    // Guardar carrito actualizado
    await saveUserCart(userSessionId, updatedCart)
    
    revalidatePath('/carrito')
    
    return { success: true, message: 'Notas actualizadas' }
    
  } catch (error) {
    console.error('Error actualizando notas:', error)
    throw new Error('Error al actualizar notas')
  }
}

export async function clearCart(sessionId?: string) {
  try {
    // Generar sessionId si no se proporciona
    const userSessionId = sessionId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Guardar carrito vacío
    await saveUserCart(userSessionId, [])
    
    revalidatePath('/carrito')
    revalidatePath('/')
    
    return { success: true, message: 'Carrito vaciado' }
    
  } catch (error) {
    console.error('Error vaciando carrito:', error)
    throw new Error('Error al vaciar carrito')
  }
}

export async function getCartItems(sessionId?: string): Promise<CartItem[]> {
  try {
    // Durante el build, retornar carrito vacío para evitar errores de conexión
    if (process.env.NODE_ENV === 'production' && !process.env.BACKEND_URL) {
      return []
    }
    
    // Generar sessionId si no se proporciona
    const userSessionId = sessionId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Obtener carrito de la base de datos
    return await getUserCart(userSessionId)
  } catch (error) {
    console.error('Error obteniendo carrito:', error)
    return []
  }
}

export async function submitInquiry(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const company = formData.get('company') as string
    const message = formData.get('message') as string
    
    // Validar datos requeridos
    if (!name || !email || !message) {
      throw new Error('Los campos nombre, email y mensaje son requeridos')
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('El email no es válido')
    }
    
    // Obtener productos del carrito actual
    const currentCart = await getCartItems()
    
    // Crear la consulta con los productos del carrito
    const inquiry = {
      name,
      email,
      phone: phone || null,
      company: company || null,
      message,
      products: currentCart.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes
      })),
      totalItems: currentCart.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: new Date().toISOString()
    }
    
    // Simular envío de consulta (aquí conectarías con tu backend)
    console.log('Nueva consulta de productos:', inquiry)
    
    // En producción, aquí guardarías en la base de datos:
    // await saveInquiry(inquiry)
    
    // Limpiar carrito después de enviar consulta
    await clearCart()
    
    // Revalidar páginas
    revalidatePath('/carrito')
    revalidatePath('/')
    
    // Redirigir con éxito
    redirect('/carrito?success=true')
    
  } catch (error) {
    console.error('Error enviando consulta:', error)
    throw new Error(error instanceof Error ? error.message : 'Error al enviar consulta')
  }
}
