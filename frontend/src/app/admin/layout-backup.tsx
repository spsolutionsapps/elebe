'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Image,
  Package,
  Settings,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Globe,
  Calendar,
  CheckSquare,
  Building2
} from 'lucide-react'
import { useInquiriesCount } from '@/hooks/useInquiriesCount'
import { NotificationBadge } from '@/components/NotificationBadge'
import { SafeIcon } from '@/components/ui/icon-wrapper'
import { NavigationItem } from '@/types/navigation'

// Array de navegación se define dentro del componente

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const { count: inquiriesCount, error: inquiriesError } = useInquiriesCount()

  // Debug: verificar el conteo de consultas
  // console.log('Layout - Consultas pendientes:', inquiriesCount)
  // console.log('Layout - Error consultas:', inquiriesError)

  // Definir el array de navegación aquí para tener acceso a inquiriesCount
  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    {
      name: 'Página Web',
      icon: Globe,
      children: [
        { name: 'Slides', href: '/admin/slides', icon: Image },
        { name: 'Productos', href: '/admin/products', icon: Package },
        { name: 'Productos Destacados', href: '/admin/featured-products', icon: Package },
        { name: 'Servicios', href: '/admin/services', icon: Settings },
        { name: 'Nosotros', href: '/admin/about', icon: FileText },
        { name: 'Marcas', href: '/admin/brands', icon: Building2 },
      ]
    },
    { 
      name: 'Consultas', 
      href: '/admin/inquiries', 
      icon: Users, 
      count: inquiriesCount > 0 ? inquiriesCount : undefined 
    },
    { name: 'Clientes', href: '/admin/clients', icon: Users },
    { name: 'Recordatorios', href: '/admin/reminders', icon: Calendar },
    { name: 'Tareas', href: '/admin/tasks', icon: CheckSquare },
  ]

  // Debug: verificar el count en el navigation item
  if (process.env.NODE_ENV === 'development') {
    console.log('Layout - Navigation item count:', navigation.find(item => item.name === 'Consultas')?.count)
  }

  useEffect(() => {
    // Si estamos en la página de login, no verificar autenticación
    if (pathname === '/admin/login') {
      return
    }

    // Verificar si hay un usuario logueado
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/admin/login')
      return
    }

    try {
      setUser(JSON.parse(userData))
    } catch (error) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      router.push('/admin/login')
    }
  }, [router, pathname])

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
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    router.push('/admin/login')
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
  if (!user) {
    return null // Loading state
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(139deg, rgba(207, 236, 255, 1) 0%, rgba(237, 246, 255, 1) 50%, rgba(230, 241, 255, 1) 100%)'
      }}
    >
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-lg font-semibold" style={{ marginLeft: '12px' }}>LB Crm</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 py-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => {
                        setExpandedMenus(prev =>
                          prev.includes(item.name)
                            ? prev.filter(name => name !== item.name)
                            : [...prev, item.name]
                        )
                      }}
                      className="group flex items-center w-full px-3 py-3 text-base font-medium text-[#212121] hover:bg-gray-50 hover:text-[#000] transition-colors"
                    >
                      <SafeIcon icon={item.icon} className="mr-3 h-5 w-5" />
                      {item.name}
                      <ChevronDown
                        className={`ml-auto h-4 w-4 transition-transform ${
                          expandedMenus.includes(item.name) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedMenus.includes(item.name) && (
                      <div className="ml-4 mt-1 space-y-2">
                        {item.children.map((child) => (
                          child.href ? (
                            <Link
                              key={child.name}
                              href={child.href}
                                                             className={`group flex items-center px-3 py-3 text-base transition-colors ${
                                 isActiveLink(child.href)
                                   ? 'text-[#165cff] bg-[#165cff]/10 font-medium border-r-4 border-r-[#165cff]'
                                   : 'text-[#212121] hover:bg-gray-50 hover:text-[#000] font-light'
                               }`}
                               onClick={() => setSidebarOpen(false)}
                             >
                               <child.icon className="mr-3 h-5 w-5" />
                               {child.name}
                             </Link>
                           ) : null
                         ))}
                       </div>
                     )}
                   </div>
                                  ) : (
                                    item.href ? (
                                      <Link
                                        href={item.href}
                                        className={`group flex items-center px-3 py-3 text-base transition-colors relative ${
                                          isActiveLink(item.href)
                                            ? 'text-[#165cff] bg-[#165cff]/10 font-medium border-r-4 border-r-[#165cff]'
                                            : 'text-[#212121] hover:bg-gray-50 hover:text-[#000] font-light'
                                        }`}
                                        onClick={() => setSidebarOpen(false)}
                                      >
                                        <SafeIcon icon={item.icon} className="mr-3 h-5 w-5" />
                                        {item.name}
                                        {item.count && item.count > 0 && <NotificationBadge count={item.count} />}
                                      </Link>
                                    ) : null
                                  )}
              </div>
            ))}
          </nav>
          <div className="border-t border-gray-200">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center">
            <h1 className="text-lg font-semibold" style={{ marginLeft: '12px' }}>LB Crm</h1>
          </div>
          <nav className="flex-1 space-y-2 py-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => {
                        setExpandedMenus(prev =>
                          prev.includes(item.name)
                            ? prev.filter(name => name !== item.name)
                            : [...prev, item.name]
                        )
                      }}
                      className="group flex items-center w-full px-3 py-3 text-base font-medium text-[#212121] hover:bg-gray-50 hover:text-[#000] transition-colors"
                    >
                      <SafeIcon icon={item.icon} className="mr-3 h-5 w-5" />
                      {item.name}
                      <ChevronDown
                        className={`ml-auto h-4 w-4 transition-transform ${
                          expandedMenus.includes(item.name) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                                            {expandedMenus.includes(item.name) && (
                          <div className="ml-4 mt-1 space-y-2">
                            {item.children.map((child) => (
                              child.href ? (
                                <Link
                                  key={child.name}
                                  href={child.href}
                                                                   className={`group flex items-center px-3 py-3 text-base transition-colors ${
                                   isActiveLink(child.href)
                                     ? 'text-[#165cff] bg-[#165cff]/10 font-medium border-r-4 border-r-[#165cff]'
                                     : 'text-[#212121] hover:bg-gray-50 hover:text-[#000] font-light'
                                 }`}
                                >
                                  <child.icon className="mr-3 h-5 w-5" />
                                  {child.name}
                                </Link>
                              ) : null
                            ))}
                          </div>
                        )}
                  </div>
                                 ) : (
                                   item.href ? (
                                     <Link
                                       href={item.href}
                                                                                                                       className={`group flex items-center px-3 py-3 text-base transition-colors relative ${
                                          isActiveLink(item.href)
                                            ? 'text-[#165cff] bg-[#165cff]/10 font-medium border-r-4 border-r-[#165cff]'
                                            : 'text-[#212121] hover:bg-gray-50 hover:text-[#000] font-light'
                                        }`}
                                      >
                                        <SafeIcon icon={item.icon} className="mr-3 h-5 w-5" />
                                        {item.name}
                                        {item.count && item.count > 0 && <NotificationBadge count={item.count} />}
                                      </Link>
                                    ) : null
                                  )}
               </div>
             ))}
           </nav>
          <div className="border-t border-gray-200">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

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
