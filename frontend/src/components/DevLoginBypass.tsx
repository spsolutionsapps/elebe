'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

// Componente temporal para desarrollo - permite acceso directo al admin
export default function DevLoginBypass() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDevLogin = async () => {
    setIsLoading(true)
    
    try {
      // Crear un token temporal para desarrollo
      const devToken = 'dev-token-' + Date.now()
      
      // Guardar en localStorage
      localStorage.setItem('access_token', devToken)
      localStorage.setItem('user', JSON.stringify({
        id: 'dev-user',
        email: 'admin@fashionstyle.com',
        name: 'Admin Dev',
        role: 'admin'
      }))

      // Redirigir al admin
      router.push('/admin')
    } catch (error) {
      console.error('Error en dev login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🚀 Modo Desarrollo
        </h1>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Acceso Directo para Desarrollo</strong>
            </p>
            <p className="text-xs text-yellow-700 mt-2">
              Este botón te permite acceder directamente al admin sin login.
              Solo funciona en desarrollo.
            </p>
          </div>

          <Button
            onClick={handleDevLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Accediendo...' : '🚀 Acceder al Admin'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              O usa el login normal:
            </p>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/login')}
              className="w-full mt-2"
            >
              📝 Login Normal
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Credenciales normales:</p>
          <p><strong>Email:</strong> admin@fashionstyle.com</p>
          <p><strong>Contraseña:</strong> admin123</p>
        </div>
      </div>
    </div>
  )
}
