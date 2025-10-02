import React from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationProps {
  type: NotificationType
  title: string
  message?: string
  onClose?: () => void
  className?: string
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}

export function Notification({ 
  type, 
  title, 
  message, 
  onClose, 
  className 
}: NotificationProps) {
  const Icon = icons[type]
  const styleClasses = styles[type]

  return (
    <div className={cn(
      'border rounded-lg p-4 shadow-sm',
      styleClasses,
      className
    )}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 hover:opacity-75"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Hook para mostrar notificaciones
export function useNotification() {
  const showSuccess = (title: string, message?: string) => {
    // Implementar con react-hot-toast o similar
    console.log('Success:', title, message)
  }

  const showError = (title: string, message?: string) => {
    console.log('Error:', title, message)
  }

  const showWarning = (title: string, message?: string) => {
    console.log('Warning:', title, message)
  }

  const showInfo = (title: string, message?: string) => {
    console.log('Info:', title, message)
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
