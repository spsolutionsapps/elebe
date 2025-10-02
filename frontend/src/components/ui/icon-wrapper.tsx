import React from 'react'

// Componente para iconos seguros durante prerendering
interface SafeIconProps {
  icon: React.ComponentType<{ className?: string }>
  className?: string
  fallback?: React.ReactNode
}

export function SafeIcon({ icon: Icon, className, fallback }: SafeIconProps) {
  // Siempre usar fallback durante prerendering
  if (typeof window === 'undefined') {
    return fallback || <span className={className}></span>
  }

  // En el cliente, verificar que el icono es válido
  if (!Icon || typeof Icon !== 'function') {
    return fallback || <span className={className}></span>
  }

  // Renderizar el icono de forma segura
  try {
    return <Icon className={className} />
  } catch (error) {
    console.warn('Error rendering icon:', error)
    return fallback || <span className={className}></span>
  }
}

// Hook para manejar iconos de manera segura
export function useSafeIcon(icon: React.ComponentType<{ className?: string }>) {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? icon : null
}

// Componente wrapper para iconos
interface IconWrapperProps {
  icon: React.ComponentType<{ className?: string }>
  className?: string
  fallback?: React.ReactNode
}

export function IconWrapper({ icon: Icon, className, fallback }: IconWrapperProps) {
  return <SafeIcon icon={Icon} className={className} fallback={fallback} />
}
