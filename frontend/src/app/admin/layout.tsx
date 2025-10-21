'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Image,
  Package,
  Settings,
  Users,
  FileText,
  Menu,
  Globe,
  Calendar,
  CheckSquare,
  Building2,
  Grid3X3,
  Mail
} from 'lucide-react'
import { useInquiriesCount } from '@/hooks/useInquiriesCount'
import { NavigationItem } from '@/types/navigation'
import { AlertModal } from '@/components/AlertModal'
import { useModal } from '@/hooks/useModal'
import { MobileSidebar } from '@/components/admin/MobileSidebar'
import { DesktopSidebar } from '@/components/admin/DesktopSidebar'

// Array de navegación se define dentro del componente

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const { alertState, showAlert, hideAlert } = useModal()
  const [user, setUser] = useState<any>(null)
  
  const { count: inquiriesCount, error: inquiriesError } = useInquiriesCount()

  // Definir el array de navegación con acceso a inquiriesCount
  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    {
      name: 'Página Web',
      icon: Globe,
      children: [
        { name: 'Slides', href: '/admin/slides', icon: Image },
        { name: 'Categorías', href: '/admin/categories', icon: Grid3X3 },
        { name: 'Productos', href: '/admin/products', icon: Package },
        { name: 'Productos Destacados', href: '/admin/featured-products', icon: Package },
        // { name: 'Servicios', href: '/admin/services', icon: Settings },
        // { name: 'Nosotros', href: '/admin/about', icon: FileText },
        { name: 'Marcas', href: '/admin/brands', icon: Building2 },
      ]
    },
    { 
      name: 'Consultas', 
      href: '/admin/inquiries', 
      icon: Users, 
      count: inquiriesCount && inquiriesCount > 0 ? inquiriesCount : undefined 
    },
    { name: 'Clientes', href: '/admin/clients', icon: Users },
    { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
    { name: 'Recordatorios', href: '/admin/reminders', icon: Calendar },
    { name: 'Tareas', href: '/admin/tasks', icon: CheckSquare },
  ]


  useEffect(() => {
    // Si estamos en la página de login, no verificar autenticación
    if (pathname === '/admin/login') {
      return
    }

    // SOLO para desarrollo local: Bypass opcional (NUNCA en producción)
    const isDevelopment = process.env.NODE_ENV === 'development'
    const bypassAuth = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true'
    
    if (isDevelopment && bypassAuth) {
      console.warn('⚠️ DESARROLLO: Bypass de autenticación activado')
      setUser({
        id: 'dev-user',
        email: 'admin@lbpremium.com',
        name: 'Admin Dev',
        role: 'admin'
      })
      return
    }

    // Verificar si hay un usuario logueado (producción y desarrollo normal)
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/admin/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      router.push('/admin/login')
    }
  }, [pathname, router])

  // Auto-expand "Página Web" menu when on subpages
  useEffect(() => {
    if (pathname.includes('/admin/slides') ||
        pathname.includes('/admin/products') ||
        pathname.includes('/admin/featured-products') ||
        pathname.includes('/admin/services') ||
        pathname.includes('/admin/about') ||
        pathname.includes('/admin/brands')) {
      setExpandedMenus(prev =>
        prev.includes('Página Web') ? prev : [...prev, 'Página Web']
      )
    }
  }, [pathname])

  const handleLogout = () => {
    // Limpiar datos de autenticación
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    
    // Mostrar mensaje de confirmación
    showAlert({
      title: 'Sesión cerrada',
      message: 'Sesión cerrada correctamente',
      type: 'success'
    })
    
    // Redirigir al login después de cerrar el modal
    setTimeout(() => {
      router.push('/admin/login')
    }, 1500)
  }

  // Función para detectar si un link está activo
  const isActiveLink = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  // Si estamos en la página de login, mostrar solo el contenido
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Si no hay usuario y no estamos en login, mostrar loading
  if (!user && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div style={{borderRadius: '150px'}} className="animate-spin h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(139deg, rgba(207, 236, 255, 1) 0%, rgba(237, 246, 255, 1) 50%, rgba(230, 241, 255, 1) 100%)'
      }}
    >
      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />

      {/* Mobile sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
        expandedMenus={expandedMenus}
        setExpandedMenus={setExpandedMenus}
        user={user}
        onLogout={handleLogout}
        isActiveLink={isActiveLink}
      />

      {/* Desktop sidebar */}
      <DesktopSidebar
        navigation={navigation}
        expandedMenus={expandedMenus}
        setExpandedMenus={setExpandedMenus}
        user={user}
        onLogout={handleLogout}
        isActiveLink={isActiveLink}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900" style={{ marginLeft: '12px' }}>
            LB Crm
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
