import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Obtener carrito por sessionId
  async getCart(sessionId: string) {
    try {
      console.log('Getting cart for sessionId:', sessionId)
      
      let cart = await this.prisma.cart.findUnique({
        where: { sessionId },
        include: { items: true }
      })

      console.log('Found cart:', cart)

      if (!cart) {
        console.log('Creating new cart for sessionId:', sessionId)
        cart = await this.prisma.cart.create({
          data: { sessionId },
          include: { items: true }
        })
        console.log('Created cart:', cart)
      }

      return cart
    } catch (error) {
      console.error('Error getting cart:', error)
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
      throw new Error('Error obteniendo carrito')
    }
  }

  // Agregar producto al carrito
  async addToCart(sessionId: string, productId: string, productData: any) {
    try {
      let cart = await this.prisma.cart.findUnique({
        where: { sessionId },
        include: { items: true }
      })

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { sessionId },
          include: { items: true }
        })
      }

      const existingItem = cart.items.find(item => item.productId === productId)

      if (existingItem) {
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + 1 }
        })
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            name: productData.name || 'Producto',
            description: productData.description || '',
            image: productData.image || null,
            price: productData.price || 0,
            quantity: 1,
            notes: 'Consulta de producto'
          }
        })
      }

      return await this.getCart(sessionId)
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw new Error('Error agregando producto al carrito')
    }
  }

  // Limpiar carrito
  async clearCart(sessionId: string) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { sessionId }
      })

      if (cart) {
        await this.prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
        })
        return { success: true, message: 'Carrito limpiado' }
      }
      return { success: false, message: 'Carrito no encontrado' }
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw new Error('Error limpiando carrito')
    }
  }

  // Remover producto específico
  async removeFromCart(sessionId: string, itemId: string) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { sessionId },
        include: { items: true }
      })

      if (!cart) {
        throw new Error('Cart not found')
      }

      await this.prisma.cartItem.delete({
        where: { id: itemId }
      })

      return await this.getCart(sessionId)
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw new Error('Error removiendo producto del carrito')
    }
  }
}
