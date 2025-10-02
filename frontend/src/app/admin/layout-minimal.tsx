'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

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

  // Si estamos en la página de login, mostrar solo el contenido
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Si no hay usuario y no estamos en login, mostrar loading
  if (!user) {
    return null // Loading state
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <div className="w-64 bg-white shadow">
          <div className="p-4">
            <h1 className="text-lg font-semibold">LB Crm</h1>
          </div>
          <nav className="mt-4">
            <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Dashboard
            </Link>
            <Link href="/admin/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Productos
            </Link>
            <Link href="/admin/clients" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Clientes
            </Link>
          </nav>
        </div>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
