import { Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common'
import { CartService } from './cart.service'

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {
    console.log('CartController initialized')
  }

  // GET /api/cart/health - Health check
  @Get('health')
  async healthCheck() {
    return { 
      status: 'OK',
      service: 'Cart Service',
      timestamp: new Date().toISOString()
    }
  }

  // GET /api/cart - Obtener carrito
  @Get()
  async getCart(@Query('sessionId') sessionId: string) {
    try {
      const cart = await this.cartService.getCart(sessionId)
      return {
        success: true,
        cart,
        message: 'Carrito obtenido correctamente'
      }
    } catch (error) {
      console.error('Error getting cart:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // POST /api/cart - Agregar producto al carrito
  @Post()
  async addToCart(@Body() body: { 
    sessionId: string; 
    productId: string; 
    productData: any 
  }) {
    try {
      const cart = await this.cartService.addToCart(
        body.sessionId,
        body.productId,
        body.productData
      )
      return {
        success: true,
        message: 'Producto agregado al carrito',
        cart
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // DELETE /api/cart - Limpiar carrito
  @Delete()
  async clearCart(@Body() body: { sessionId: string }) {
    try {
      const result = await this.cartService.clearCart(body.sessionId)
      return result
    } catch (error) {
      console.error('Error clearing cart:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // DELETE /api/cart/item/:id - Remover producto específico
  @Delete('item/:id')
  async removeFromCart(@Param('id') itemId: string, @Query('sessionId') sessionId: string) {
    try {
      const cart = await this.cartService.removeFromCart(sessionId, itemId)
      return {
        success: true,
        message: 'Producto removido del carrito',
        cart
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}
