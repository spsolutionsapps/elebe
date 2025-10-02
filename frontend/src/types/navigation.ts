import { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  name: string
  href?: string
  icon: LucideIcon
  count?: number
  children?: NavigationItem[]
}
