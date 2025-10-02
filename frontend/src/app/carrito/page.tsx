import { Cart } from '@/components/Cart'
import { getCartItems } from '@/app/actions/cart'

export default async function CartPage() {
  const cartItems = await getCartItems()

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <Cart initialItems={cartItems} />
      </div>
    </div>
  )
}
