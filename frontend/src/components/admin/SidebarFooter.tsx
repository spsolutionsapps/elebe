'use client'

import { LogOut } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface SidebarFooterProps {
  user: User
  onLogout: () => void
}

export function SidebarFooter({ user, onLogout }: SidebarFooterProps) {
  return (
    <div className="border-t border-gray-200">
      <div className="flex items-center">
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="mt-3 flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      >
        <LogOut className="mr-3 h-4 w-4" />
        Cerrar Sesión
      </button>
    </div>
  )
}

