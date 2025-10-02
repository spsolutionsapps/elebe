import { NextRequest, NextResponse } from 'next/server'

// URL del backend
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

console.log('Environment variables:')
console.log('BACKEND_URL:', process.env.BACKEND_URL)
console.log('NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL)
console.log('Final BACKEND_URL:', BACKEND_URL)

// GET /api/cart - Obtener carrito
export async function GET(request: NextRequest) {
  try {
    // Obtener sessionId de cookies o generar uno nuevo
    let sessionId = request.cookies.get('cart-session-id')?.value
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    // Por ahora, devolver carrito vacío funcional
    // TODO: Conectar con backend cuando CartModule funcione
    const response = NextResponse.json({ 
      items: [], 
      sessionId, 
      message: 'Cart API working',
      totalItems: 0,
      totalPrice: 0
    })
    
    // Establecer cookie si no existe
    if (!request.cookies.get('cart-session-id') && sessionId) {
      response.cookies.set('cart-session-id', sessionId, {
        maxAge: 60 * 60 * 24 * 30, // 30 días
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }
    
    return response
  } catch (error) {
    console.error('Error getting cart:', error)
    return NextResponse.json({ error: 'Error obteniendo carrito' }, { status: 500 })
  }
}

// POST /api/cart - Agregar producto al carrito
export async function POST(request: NextRequest) {
  try {
    // Obtener sessionId de cookies
    let sessionId = request.cookies.get('cart-session-id')?.value
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    const body = await request.json()
    const { productId, productData } = body
    
    // Respuesta simple
    return NextResponse.json({
      success: true,
      message: 'Producto agregado a consultas',
      sessionId
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ 
      error: 'Error agregando al carrito'
    }, { status: 500 })
  }
}

// PUT /api/cart - Actualizar item del carrito (simplified)
export async function PUT(request: NextRequest) {
  try {
    return NextResponse.json({ message: 'PUT method not implemented yet' })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json({ error: 'Error actualizando carrito' }, { status: 500 })
  }
}

// DELETE /api/cart - Eliminar item o limpiar carrito
export async function DELETE(request: NextRequest) {
  try {
    // Obtener sessionId de cookies
    let sessionId = request.cookies.get('cart-session-id')?.value
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    // Por ahora, simular limpiar el carrito
    // En el futuro se puede conectar con el backend
    const response = NextResponse.json({
      success: true,
      message: 'Carrito de consultas limpiado',
      sessionId
    })
    
    return response
  } catch (error) {
    console.error('Error deleting from cart:', error)
    return NextResponse.json({ error: 'Error eliminando del carrito' }, { status: 500 })
  }
}
