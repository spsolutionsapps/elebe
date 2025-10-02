'use client'

import { useEffect, useState } from 'react'

export default function HomePageMinimal() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300 font-body">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Home Page Minimal</h1>
      <p>This is a minimal version of the home page</p>
    </div>
  )
}
