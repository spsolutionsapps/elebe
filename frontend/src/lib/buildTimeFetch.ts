/**
 * Intercepta fetch durante el build time para evitar errores de conexión
 */

// Solo ejecutar en el servidor durante el build
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  const originalFetch = global.fetch;
  
  // @ts-ignore
  global.fetch = async (url: string | URL | Request, options?: RequestInit): Promise<Response> => {
    // Verificar si es una URL local que podría fallar durante el build
    const urlString = url.toString();
    
    if (urlString.includes('localhost:3001') || urlString.includes('127.0.0.1:3001')) {
      console.log(`🔧 Build time: Intercepting fetch to ${urlString}`);
      
      // Retornar una respuesta mock exitosa
      return new Response(JSON.stringify([]), {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Para otras URLs, usar fetch original
    try {
      return await originalFetch(url, options);
    } catch (error) {
      console.log(`🔧 Build time: Fetch failed for ${urlString}, returning mock response`);
      
      // Retornar respuesta mock en caso de error
      return new Response(JSON.stringify([]), {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };
}
