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

interface DesktopSidebarProps {
  navigation: NavigationItem[]
  expandedMenus: string[]
  setExpandedMenus: (menus: string[]) => void
  user: User
  onLogout: () => void
  isActiveLink: (href: string) => boolean
}

export function DesktopSidebar({
  navigation,
  expandedMenus,
  setExpandedMenus,
  user,
  onLogout,
  isActiveLink
}: DesktopSidebarProps) {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
        <SidebarHeader showTitle={false} />
        
        <SidebarContent
          navigation={navigation}
          expandedMenus={expandedMenus}
          setExpandedMenus={setExpandedMenus}
          isActiveLink={isActiveLink}
        />
        
        <SidebarFooter user={user} onLogout={onLogout} />
      </div>
    </div>
  )
}

