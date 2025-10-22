'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { CartSidebar } from '@/components/CartSidebar'
import { Logo } from './shared/Logo'
import { CartButton } from './shared/CartButton'
import { DesktopNavigation } from './DesktopNavigation'
import { MobileNavigation } from './MobileNavigation'
import { NavItem } from './shared/types'

const Navigation = memo(function Navigation() {
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

  // Memoizar el array de navegación para evitar recreaciones innecesarias
  const navItems: NavItem[] = useMemo(() => [
    { href: '/', label: 'Inicio' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/servicios', label: 'Servicios', hidden: true },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ], [])

  // Función para determinar si un item está activo - memoizada
  const isActiveItem = useCallback((href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }, [pathname])

  // Handler de búsqueda optimizado
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
      setIsSearchOpen(false)
    }
  }, [searchTerm, router])

  // Handlers para el menú móvil optimizados
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Handlers para el catálogo optimizados
  const handleCatalogMouseEnter = useCallback(() => {
    if (catalogHoverTimeout) {
      clearTimeout(catalogHoverTimeout)
      setCatalogHoverTimeout(null)
    }
    setIsCatalogMenuOpen(true)
  }, [catalogHoverTimeout])

  const handleCatalogMouseLeave = useCallback(() => {
    const timeout = setTimeout(() => {
      setIsCatalogMenuOpen(false)
    }, 200)
    setCatalogHoverTimeout(timeout)
  }, [])

  const toggleCatalogMenu = useCallback(() => {
    setIsCatalogMenuOpen(prev => !prev)
  }, [])

  const closeCatalogMenu = useCallback(() => {
    setIsCatalogMenuOpen(false)
  }, [])

  // Handler para toggle de búsqueda optimizado
  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev)
  }, [])

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (catalogHoverTimeout) {
        clearTimeout(catalogHoverTimeout)
      }
    }
  }, [catalogHoverTimeout])

  // Controlar la visibilidad del header basado en el scroll - optimizado
  const controlHeader = useCallback(() => {
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
  }, [lastScrollY])

  useEffect(() => {
    window.addEventListener('scroll', controlHeader)
    return () => window.removeEventListener('scroll', controlHeader)
  }, [controlHeader])

  // Calcular cantidad de items en el carrito
  const cartItemCount = cart && cart.items ? cart.items.length : 0

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[9999] py-header transition-transform duration-300 ease-in-out ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      } header-responsive`}
    >
      <div className="max-w-8xl mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Izquierda */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNavigation
            navItems={navItems}
            isActiveItem={isActiveItem}
            isCatalogMenuOpen={isCatalogMenuOpen}
            onCatalogMouseEnter={handleCatalogMouseEnter}
            onCatalogMouseLeave={handleCatalogMouseLeave}
            onCloseCatalogMenu={closeCatalogMenu}
            isSearchOpen={isSearchOpen}
            searchTerm={searchTerm}
            onToggleSearch={toggleSearch}
            onSearchSubmit={handleSearch}
            onSearchChange={setSearchTerm}
            cartItemCount={cartItemCount}
            onToggleCart={toggleCart}
          />

          {/* Mobile: Cart + Menu button */}
          <div className="md:hidden flex items-center space-x-2.5">
            <CartButton
              itemCount={cartItemCount}
              onToggle={toggleCart}
            />
            <button
              onClick={toggleMobileMenu}
              className="transition-colors p-0 bg-transparent border-none"
              style={{ color: '#004CAC' }}
            >
              {isMobileMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Content - Fuera del contenedor del header */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onToggle={toggleMobileMenu}
        navItems={navItems}
        isActiveItem={isActiveItem}
        isCatalogMenuOpen={isCatalogMenuOpen}
        onToggleCatalogMenu={toggleCatalogMenu}
        onCloseCatalogMenu={closeCatalogMenu}
        onCloseMobileMenu={closeMobileMenu}
        searchTerm={searchTerm}
        onSearchSubmit={handleSearch}
        onSearchChange={setSearchTerm}
      />
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </nav>
  )
})

export { Navigation }
