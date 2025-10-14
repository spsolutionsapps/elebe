'use client'

import { NavigationItem } from '@/types/navigation'
import { SidebarHeader } from './SidebarHeader'
import { SidebarContent } from './SidebarContent'
import { SidebarFooter } from './SidebarFooter'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  navigation: NavigationItem[]
  expandedMenus: string[]
  setExpandedMenus: (menus: string[]) => void
  user: User
  onLogout: () => void
  isActiveLink: (href: string) => boolean
}

export function MobileSidebar({
  isOpen,
  onClose,
  navigation,
  expandedMenus,
  setExpandedMenus,
  user,
  onLogout,
  isActiveLink
}: MobileSidebarProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
        <SidebarHeader showTitle={false} onClose={onClose} />
        
        <SidebarContent
          navigation={navigation}
          expandedMenus={expandedMenus}
          setExpandedMenus={setExpandedMenus}
          isActiveLink={isActiveLink}
          onLinkClick={onClose}
        />
        
        <SidebarFooter user={user} onLogout={onLogout} />
      </div>
    </div>
  )
}

