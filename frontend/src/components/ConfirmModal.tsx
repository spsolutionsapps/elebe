'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  icon?: React.ReactNode
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  icon
}: ConfirmModalProps) {
  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconColor: 'text-red-500',
          iconBg: 'bg-red-100',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          borderColor: 'border-red-200'
        }
      case 'warning':
        return {
          iconColor: 'text-yellow-500',
          iconBg: 'bg-yellow-100',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          borderColor: 'border-yellow-200'
        }
      case 'info':
        return {
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-100',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          borderColor: 'border-blue-200'
        }
      default:
        return {
          iconColor: 'text-red-500',
          iconBg: 'bg-red-100',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          borderColor: 'border-red-200'
        }
    }
  }

  const styles = getVariantStyles()
  const defaultIcon = <AlertTriangle className="h-6 w-6" />

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ marginTop: '-24px' }}>
      <Card className={`w-full max-w-md ${styles.borderColor} border-2 bg-white rounded-none`}>
        <CardHeader className="pb-4 bg-blue-600 text-white rounded-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${styles.iconBg}`}>
                {icon ? (
                  <div className={styles.iconColor}>
                    {icon}
                  </div>
                ) : (
                  <div className={styles.iconColor}>
                    {defaultIcon}
                  </div>
                )}
              </div>
              <CardTitle className="text-lg" style={{ color: 'black' }}>
                {title}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white hover:bg-blue-700 rounded-full"
              style={{ color: 'white !important' }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-gray-800 mb-6 leading-relaxed">
            {message}
          </p>
          
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 rounded-full"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className={`px-6 rounded-full ${styles.confirmButton}`}
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
