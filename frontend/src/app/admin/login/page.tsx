

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import apiClient from '@/lib/api-client'
import { useToast } from '@/hooks/useToast'

export default function LoginPage() {
  const { showSuccess, showError } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('🔐 Intentando login con:', { email, password })
      
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      })

      console.log('✅ Login exitoso:', response.data)

      // Guardar token en localStorage
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      console.log('💾 Datos guardados en localStorage')

      // Mostrar mensaje de éxito y redirigir
      showSuccess('¡Inicio de sesión exitoso!')
      
      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        router.push('/admin')
      }, 100)
    } catch (err: any) {
      console.error('❌ Error en login:', err)
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkGray">
      <div className="max-w-md w-full bg-white p-8 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Fashion Style - Admin
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@fashionstyle.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Email: admin@fashionstyle.com</p>
          <p>Contraseña: admin123</p>
        </div>
      </div>
    </div>
  )
}
