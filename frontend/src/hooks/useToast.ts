import toast from 'react-hot-toast'

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    })
  }

  const showError = (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
    })
  }

  const showInfo = (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: '500',
      },
      icon: 'ℹ️',
    })
  }

  const showWarning = (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#f59e0b',
        color: '#fff',
        fontWeight: '500',
      },
      icon: '⚠️',
    })
  }

  const showLoading = (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6b7280',
        color: '#fff',
        fontWeight: '500',
      },
    })
  }

  const dismiss = (toastId: string) => {
    toast.dismiss(toastId)
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
  }
}
