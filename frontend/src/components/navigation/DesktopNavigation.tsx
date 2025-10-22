'use client'

import Link from 'next/link'
import { CatalogMegaMenu } from '@/components/CatalogMegaMenu'
import { SearchBar } from './shared/SearchBar'
import { CartButton } from './shared/CartButton'
import { NavItem } from './shared/types'

interface DesktopNavigationProps {
  navItems: NavItem[]
  isActiveItem: (href: string) => boolean
  isCatalogMenuOpen: boolean
  onCatalogMouseEnter: () => void
  onCatalogMouseLeave: () => void
  onCloseCatalogMenu: () => void
  isSearchOpen: boolean
  searchTerm: string
  onToggleSearch: () => void
  onSearchSubmit: (e: React.FormEvent) => void
  onSearchChange: (value: string) => void
  cartItemCount: number
  onToggleCart: () => void
}

export function DesktopNavigation({
  navItems,
  isActiveItem,
  isCatalogMenuOpen,
  onCatalogMouseEnter,
  onCatalogMouseLeave,
  onCloseCatalogMenu,
  isSearchOpen,
  searchTerm,
  onToggleSearch,
  onSearchSubmit,
  onSearchChange,
  cartItemCount,
  onToggleCart
}: DesktopNavigationProps) {
  return (
    <>
      {/* Desktop Navigation - Centro */}
      <div className="hidden md:flex items-center justify-center flex-1">
        <div className="flex items-center space-x-8">
          {navItems.map((item) => (
            <div 
              key={item.href} 
              className={`relative ${item.hidden ? 'hidden' : ''}`}
              onMouseEnter={item.label === 'Catálogo' ? onCatalogMouseEnter : undefined}
              onMouseLeave={item.label === 'Catálogo' ? onCatalogMouseLeave : undefined}
            >
              {item.label === 'Catálogo' ? (
                <Link
                  href={item.href}
                  className={`px-3 py-2 rounded-md font-medium transition-colors font-body relative group ${
                    isActiveItem(item.href) ? 'font-bold' : ''
                  }`}
                  style={{ 
                    fontSize: '18px', 
                    color: '#004CAC'
                  }}
                >
                  {item.label}
                  <span 
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#004CAC] transition-all duration-300 ease-in-out ${
                      isActiveItem(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              ) : (
                <Link
                  href={item.href}
                  className={`px-3 py-2 rounded-md font-medium transition-colors font-body relative group ${
                    isActiveItem(item.href) ? 'font-bold' : ''
                  }`}
                  style={{ 
                    fontSize: '18px', 
                    color: '#004CAC'
                  }}
                >
                  {item.label}
                  <span 
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#004CAC] transition-all duration-300 ease-in-out ${
                      isActiveItem(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              )}
              {item.label === 'Catálogo' && (
                <CatalogMegaMenu 
                  isOpen={isCatalogMenuOpen} 
                  onClose={onCloseCatalogMenu} 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search y Cart - Derecha */}
      <div className="flex items-center space-x-4 flex-shrink-0 md:space-x-4">
        <SearchBar
          isOpen={isSearchOpen}
          searchTerm={searchTerm}
          onToggle={onToggleSearch}
          onSubmit={onSearchSubmit}
          onChange={onSearchChange}
          variant="desktop"
        />

        {/* Cart solo visible en desktop */}
        <div className="hidden md:block">
          <CartButton
            itemCount={cartItemCount}
            onToggle={onToggleCart}
          />
        </div>
      </div>
    </>
  )
}
