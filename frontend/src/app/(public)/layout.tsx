'use client'

import { Navigation } from '@/components/Navigation'
import { CartSidebar } from '@/components/CartSidebar'
import { Footer } from '@/components/Footer'
import { ScrollToTopButton } from '@/components/ScrollToTopButton'
import { CartProvider } from '@/contexts/CartContext'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <div className="min-h-screen overflow-x-hidden flex flex-col bgElebe">
        <Navigation />
        <main className="flex-1 mx-auto pt-8 w-full">
          {children}
        </main>
        <Footer />
        <CartSidebar />
        <ScrollToTopButton />
      </div>
    </CartProvider>
  )
}
