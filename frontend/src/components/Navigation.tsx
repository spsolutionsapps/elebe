'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CatalogMegaMenu } from '@/components/CatalogMegaMenu'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { CartSidebar } from '@/components/CartSidebar'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState(false)
  const [catalogHoverTimeout, setCatalogHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  
  // Usar el hook del carrito
  const { state: cart, toggleCart } = useCart()

  // Detectar si estamos en página de producto - removido para mantener header consistente

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (catalogHoverTimeout) {
        clearTimeout(catalogHoverTimeout)
      }
    }
  }, [catalogHoverTimeout])

  // Controlar la visibilidad del header basado en el scroll
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header and close catalog menu
        setIsHeaderVisible(false)
        setIsCatalogMenuOpen(false)
      } else {
        // Scrolling up - show header
        setIsHeaderVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlHeader)
    return () => window.removeEventListener('scroll', controlHeader)
  }, [lastScrollY])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
      setIsSearchOpen(false)
    }
  }

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/servicios', label: 'Servicios', hidden: true },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ]

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[9999] py-header transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`} 
      style={{ 
        backgroundColor: '#f3e9cdad',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="max-w-8xl mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Izquierda */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="LB Premium" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centro */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <div 
                  key={item.href} 
                  className={`relative ${item.hidden ? 'hidden' : ''}`}
                  onMouseEnter={() => {
                    if (item.label === 'Catálogo') {
                      if (catalogHoverTimeout) {
                        clearTimeout(catalogHoverTimeout)
                        setCatalogHoverTimeout(null)
                      }
                      setIsCatalogMenuOpen(true)
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.label === 'Catálogo') {
                      const timeout = setTimeout(() => {
                        setIsCatalogMenuOpen(false)
                      }, 200)
                      setCatalogHoverTimeout(timeout)
                    }
                  }}
                >
                  {item.label === 'Catálogo' ? (
                    <button
                      className="px-3 py-2 rounded-md font-medium transition-colors font-body cursor-pointer bg-transparent border-none relative group"
                      style={{ fontSize: '18px', color: '#176A7B' }}
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#176A7B] transition-all duration-300 ease-in-out group-hover:w-full"></span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="px-3 py-2 rounded-md font-medium transition-colors font-body relative group"
                      style={{ fontSize: '18px', color: '#176A7B' }}
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#176A7B] transition-all duration-300 ease-in-out group-hover:w-full"></span>
                    </Link>
                  )}
                  {item.label === 'Catálogo' && (
                    <CatalogMegaMenu 
                      isOpen={isCatalogMenuOpen} 
                      onClose={() => setIsCatalogMenuOpen(false)} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Search y Cart - Derecha */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Search Button - Solo visible en desktop */}
            <div className="relative hidden md:block">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                style={{ backgroundColor: '#176A7B' }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Search Input Expandible - Solo visible en desktop */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden hidden md:block"
                >
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      placeholder="¿Qué producto buscas?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white text-black placeholder-gray-500 px-4 py-2 rounded-full border-none outline-none w-64"
                      autoFocus
                    />
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cart Button */}
            <div className="relative">
              <button 
                onClick={toggleCart}
                className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#004CAC' }}
              >
                <ShoppingCart className="h-6 w-6 text-white" />
              </button>
              {cart && cart.items && cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.length > 99 ? '99+' : cart.items.length}
                </span>
              )}
            </div>

            {/* Mobile menu button - Sin padding ni background */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-gray-300 transition-colors p-0 bg-transparent border-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-4 pt-4 pb-4 space-y-3 border-t border-gray-600">
                {/* Search en Mobile - Primero */}
                <div className="mb-4">
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      placeholder="¿Qué producto buscas?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-800 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue w-full text-base"
                    />
                  </form>
                </div>

                {/* Separador visual */}
                <div className="border-b border-gray-700 mb-4"></div>

                {navItems.map((item) => (
                  <div key={item.href} className={item.hidden ? 'hidden' : ''}>
                    {item.label === 'Catálogo' ? (
                      <div>
                        <button
                          onClick={() => setIsCatalogMenuOpen(!isCatalogMenuOpen)}
                          className="block px-0 py-3 rounded-md font-medium font-body w-full text-left"
                          style={{ fontSize: '18px', color: '#176A7B' }}
                        >
                          {item.label} {isCatalogMenuOpen ? '▼' : '▶'}
                        </button>
                        {isCatalogMenuOpen && (
                          <div className="ml-4 mt-2 space-y-1">
                            <Link
                              href="/catalogo"
                              className="block px-3 py-1 rounded-md text-sm"
                              style={{ color: '#176A7B' }}
                              onClick={() => {
                                setIsMobileMenuOpen(false)
                                setIsCatalogMenuOpen(false)
                              }}
                            >
                              Todas las categorías
                            </Link>
                            <Link
                              href="/catalogo?category=oficina"
                              className="block px-3 py-1 rounded-md text-sm"
                              style={{ color: '#176A7B' }}
                              onClick={() => {
                                setIsMobileMenuOpen(false)
                                setIsCatalogMenuOpen(false)
                              }}
                            >
                              Oficina
                            </Link>
                            <Link
                              href="/catalogo?category=moda"
                              className="block px-3 py-1 rounded-md text-sm"
                              style={{ color: '#176A7B' }}
                              onClick={() => {
                                setIsMobileMenuOpen(false)
                                setIsCatalogMenuOpen(false)
                              }}
                            >
                              Moda
                            </Link>
                            <Link
                              href="/catalogo?category=deporte"
                              className="block px-3 py-1 rounded-md text-sm"
                              style={{ color: '#176A7B' }}
                              onClick={() => {
                                setIsMobileMenuOpen(false)
                                setIsCatalogMenuOpen(false)
                              }}
                            >
                              Deporte
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-0 py-3 rounded-md font-medium font-body"
                        style={{ fontSize: '18px', color: '#176A7B' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </nav>
  )
}
