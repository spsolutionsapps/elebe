'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  buttonText?: string
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'Aceptar'
}: AlertModalProps) {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-6 w-6" />,
          iconColor: 'text-green-500',
          iconBg: 'bg-green-100',
          headerBg: 'bg-green-600',
          button: 'bg-green-600 hover:bg-green-700 text-white'
        }
      case 'error':
        return {
          icon: <XCircle className="h-6 w-6" />,
          iconColor: 'text-red-500',
          iconBg: 'bg-red-100',
          headerBg: 'bg-red-600',
          button: 'bg-red-600 hover:bg-red-700 text-white'
        }
      case 'warning':
        return {
          icon: <AlertCircle className="h-6 w-6" />,
          iconColor: 'text-yellow-500',
          iconBg: 'bg-yellow-100',
          headerBg: 'bg-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        }
      case 'info':
      default:
        return {
          icon: <Info className="h-6 w-6" />,
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-100',
          headerBg: 'bg-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md bg-white border-2 shadow-xl"
        style={{ borderRadius: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className={`pb-4 ${styles.headerBg} text-white`} style={{ borderRadius: 0 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 ${styles.iconBg}`} style={{ borderRadius: 0 }}>
                <div className={styles.iconColor}>
                  {styles.icon}
                </div>
              </div>
              <CardTitle className="text-lg text-white">
                {title}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white hover:bg-opacity-20 hover:bg-white"
              style={{ borderRadius: 0 }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <p className="text-gray-700 mb-6 leading-relaxed">
            {message}
          </p>
          
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className={`px-8 ${styles.button}`}
              style={{ borderRadius: 0 }}
            >
              {buttonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

