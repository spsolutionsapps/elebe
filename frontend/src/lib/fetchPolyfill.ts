/**
 * Polyfill para fetch durante el build
 * Maneja errores de conexión durante la generación estática
 */

// Verificar si estamos en build time
const isBuildTime = () => {
  return (
    process.env.NODE_ENV === 'production' && 
    !process.env.NEXT_PUBLIC_BACKEND_URL &&
    typeof window === 'undefined'
  )
}

// Fetch polyfill que maneja errores de conexión
const buildSafeFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Si estamos en build time, retornar una respuesta mock
  if (isBuildTime()) {
    console.log(`🔧 Build time: Mocking fetch for ${url}`)
    return new Response(JSON.stringify([]), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  try {
    // Usar fetch normal con timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 segundos timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    
    // Retornar respuesta mock en caso de error
    return new Response(JSON.stringify([]), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

// Reemplazar fetch global si estamos en build time
if (typeof global !== 'undefined' && isBuildTime()) {
  // @ts-ignore
  global.fetch = buildSafeFetch
}

export { buildSafeFetch, isBuildTime }
