interface NotificationBadgeProps {
  count: number
  className?: string
}

export const NotificationBadge = ({ count, className = '' }: NotificationBadgeProps) => {
  // Solo mostrar el badge si hay consultas pendientes (count > 0)
  if (!count || count <= 0) {
    return null
  }
  return (
    <div className={`inline-flex items-center justify-center bg-red-500 text-white text-xs rounded-full h-5 w-5 font-medium ml-2.5 ${className}`}>
      {count > 99 ? '99+' : count}
    </div>
  )
}
