'use client'

import { X } from 'lucide-react'

interface SidebarHeaderProps {
  showTitle?: boolean
  onClose?: () => void
}

export function SidebarHeader({ showTitle = true, onClose }: SidebarHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between">
      <div className="flex items-center" style={{ marginLeft: '12px' }}>
        <img 
          src="/logo.svg" 
          alt="LB Premium" 
          className="h-8 w-auto mr-3"
        />
        {showTitle && <h1 className="text-lg font-semibold">LB CRM</h1>}
      </div>
      {onClose && (
        <button onClick={onClose} className="mr-4">
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}

