'use client'

import { useState, useCallback } from 'react'

interface AlertOptions {
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  buttonText?: string
}

interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function useModal() {
  const [alertState, setAlertState] = useState<AlertOptions & { isOpen: boolean }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })

  const [confirmState, setConfirmState] = useState<ConfirmOptions & { isOpen: boolean }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'danger'
  })

  const [confirmResolve, setConfirmResolve] = useState<((value: boolean) => void) | null>(null)

  // Alert modal methods
  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      isOpen: true,
      ...options
    })
  }, [])

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isOpen: false }))
  }, [])

  // Confirm modal methods
  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        ...options
      })
      setConfirmResolve(() => resolve)
    })
  }, [])

  const handleConfirm = useCallback(() => {
    if (confirmResolve) {
      confirmResolve(true)
      setConfirmResolve(null)
    }
    setConfirmState(prev => ({ ...prev, isOpen: false }))
  }, [confirmResolve])

  const handleCancel = useCallback(() => {
    if (confirmResolve) {
      confirmResolve(false)
      setConfirmResolve(null)
    }
    setConfirmState(prev => ({ ...prev, isOpen: false }))
  }, [confirmResolve])

  return {
    // Alert
    alertState,
    showAlert,
    hideAlert,
    // Confirm
    confirmState,
    showConfirm,
    handleConfirm,
    handleCancel
  }
}

