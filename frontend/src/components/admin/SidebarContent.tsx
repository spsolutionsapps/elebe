'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { NavigationItem } from '@/types/navigation'
import { NotificationBadge } from '@/components/NotificationBadge'

interface SidebarContentProps {
  navigation: NavigationItem[]
  expandedMenus: string[]
  setExpandedMenus: (menus: string[]) => void
  isActiveLink: (href: string) => boolean
  onLinkClick?: () => void
}

export function SidebarContent({ 
  navigation, 
  expandedMenus, 
  setExpandedMenus, 
  isActiveLink,
  onLinkClick 
}: SidebarContentProps) {
  const handleToggleMenu = (menuName: string) => {
    setExpandedMenus(
      expandedMenus.includes(menuName)
        ? expandedMenus.filter(name => name !== menuName)
        : [...expandedMenus, menuName]
    )
  }

  return (
    <nav className="flex-1 space-y-2 py-4">
      {navigation.map((item) => (
        <div key={item.name}>
          {item.children ? (
            <div>
              <button
                onClick={() => handleToggleMenu(item.name)}
                className="group flex items-center w-full px-3 py-3 text-[16px] font-medium text-[#212121] hover:bg-gray-50 hover:text-[#000] transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                <ChevronDown
                  className={`ml-auto h-4 w-4 transition-transform ${
                    expandedMenus.includes(item.name) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedMenus.includes(item.name) && (
                <div className="ml-4 mt-1 space-y-2">
                  {item.children.map((child) => (
                    child.href ? (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`group flex items-center px-3 py-3 text-[16px] transition-colors ${
                          isActiveLink(child.href)
                            ? 'text-[#165cff] bg-[#165cff]/10 font-medium border-r-4 border-r-[#165cff]'
                            : 'text-[#212121] hover:bg-gray-50 hover:text-[#000] font-light'
                        }`}
                        onClick={onLinkClick}
                      >
                        <child.icon className="mr-3 h-5 w-5" />
                        {child.name}
                      </Link>
                    ) : null
                  ))}
                </div>
              )}
            </div>
          ) : (
            item.href ? (
              <Link
                href={item.href}
                className={`group flex items-center px-3 py-3 text-[16px] transition-colors relative ${
                  isActiveLink(item.href)
                    ? 'text-[#165cff] bg-[#165cff]/10 font-medium border-r-4 border-r-[#165cff]'
                    : 'text-[#212121] hover:bg-gray-50 hover:text-[#000] font-light'
                }`}
                onClick={onLinkClick}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.count && item.count > 0 && <NotificationBadge count={item.count} />}
              </Link>
            ) : null
          )}
        </div>
      ))}
    </nav>
  )
}

