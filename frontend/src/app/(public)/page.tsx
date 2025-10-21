import { Product, Slide } from '@/types'
import { HomePageClient } from '@/components/HomePageClient'

export default function HomePage() {
  // Por ahora, retornar datos vacíos para evitar el error 500
  // Los datos se cargarán en el componente cliente
  const slides: Slide[] = []
  const featuredProducts: Product[] = []

  console.log('HomePage - slides:', slides.length, 'products:', featuredProducts.length)
  
  return <HomePageClient slides={slides} featuredProducts={featuredProducts} />
}