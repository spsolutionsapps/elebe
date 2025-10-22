'use client'

import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { SearchBar } from './shared/SearchBar'
import { NavItem } from './shared/types'
import './mobile-menu.css'

interface MobileNavigationProps {
  isOpen: boolean
  onToggle: () => void
  navItems: NavItem[]
  isActiveItem: (href: string) => boolean
  isCatalogMenuOpen: boolean
  onToggleCatalogMenu: () => void
  onCloseCatalogMenu: () => void
  onCloseMobileMenu: () => void
  searchTerm: string
  onSearchSubmit: (e: React.FormEvent) => void
  onSearchChange: (value: string) => void
}

export function MobileNavigation({
  isOpen,
  onToggle,
  navItems,
  isActiveItem,
  isCatalogMenuOpen,
  onToggleCatalogMenu,
  onCloseCatalogMenu,
  onCloseMobileMenu,
  searchTerm,
  onSearchSubmit,
  onSearchChange
}: MobileNavigationProps) {
  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup: restaurar scroll al desmontar
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>

          {/* Sidebar - Solo contenido, sin header */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed right-0 top-[94px] h-[calc(100vh-94px)] w-full max-w-md shadow-xl flex flex-col mobile-menu-sidebar"
          >
            <div className="mobile-menu-content space-y-3 flex-1 overflow-y-auto h-full">
            {/* Search en Mobile - Primero */}
            <SearchBar
              isOpen={true}
              searchTerm={searchTerm}
              onToggle={() => {}}
              onSubmit={onSearchSubmit}
              onChange={onSearchChange}
              variant="mobile"
            />


            {navItems.map((item) => (
              <div key={item.href} className={item.hidden ? 'hidden' : ''}>
                {item.label === 'Catálogo' ? (
                  <div>
                    <button
                      onClick={onToggleCatalogMenu}
                      className="mobile-catalog-button flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      {isCatalogMenuOpen ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                    {isCatalogMenuOpen && (
                      <div className="mobile-catalog-submenu">
                        <Link
                          href="/catalogo"
                          onClick={() => {
                            onCloseMobileMenu()
                            onCloseCatalogMenu()
                          }}
                        >
                          Todas las categorías
                        </Link>
                        <Link
                          href="/catalogo?category=oficina"
                          onClick={() => {
                            onCloseMobileMenu()
                            onCloseCatalogMenu()
                          }}
                        >
                          Oficina
                        </Link>
                        <Link
                          href="/catalogo?category=moda"
                          onClick={() => {
                            onCloseMobileMenu()
                            onCloseCatalogMenu()
                          }}
                        >
                          Moda
                        </Link>
                        <Link
                          href="/catalogo?category=deporte"
                          onClick={() => {
                            onCloseMobileMenu()
                            onCloseCatalogMenu()
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
                    className="mobile-nav-link block py-3"
                    onClick={onCloseMobileMenu}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
              
            ))}
            
            {/* Footer del menú móvil */}
            <div className="mt-auto pt-4 menuMobileShape" />
            </div>
          </motion.div>
        </>
        
      )}
    </AnimatePresence>
  )
}
