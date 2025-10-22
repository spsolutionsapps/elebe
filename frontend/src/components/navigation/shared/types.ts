// Tipos compartidos para la navegación
export interface NavItem {
  href: string
  label: string
  hidden?: boolean
}

export interface NavigationProps {
  isHeaderVisible: boolean
  isMobileMenuOpen: boolean
  isCatalogMenuOpen: boolean
  isSearchOpen: boolean
  searchTerm: string
  navItems: NavItem[]
  isActiveItem: (href: string) => boolean
  onToggleMobileMenu: () => void
  onCloseMobileMenu: () => void
  onToggleCatalogMenu: () => void
  onCloseCatalogMenu: () => void
  onToggleSearch: () => void
  onSearchSubmit: (e: React.FormEvent) => void
  onSearchChange: (value: string) => void
  onCatalogMouseEnter: () => void
  onCatalogMouseLeave: () => void
}

export interface SearchProps {
  isOpen: boolean
  searchTerm: string
  onToggle: () => void
  onSubmit: (e: React.FormEvent) => void
  onChange: (value: string) => void
  variant: 'desktop' | 'mobile'
}

export interface CartButtonProps {
  itemCount: number
  onToggle: () => void
}

export interface LogoProps {
  className?: string
}
