export interface Product {
  id: string
  name: string
  description: string
  category: string
  image?: string | null
  images?: string[]
  price?: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  
  // Especificaciones técnicas
  printingTypes?: string[]
  productHeight?: number | null
  productLength?: number | null
  productWidth?: number | null
  productWeight?: number | null
  packagingHeight?: number | null
  packagingLength?: number | null
  packagingWidth?: number | null
  packagingWeight?: number | null
  unitsPerBox?: number | null
  individualPackaging?: string | null
  
  // Contador de visitas
  views?: number
  
  // Orden en productos destacados
  featuredOrder?: number | null
}

 

export interface Slide {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  buttonBackgroundColor?: string | null
  buttonTextColor?: string | null
  buttonBorderColor?: string | null
  buttonBorderWidth?: string | null
  buttonBorderRadius?: string | null
  buttonBoxShadow?: string | null
  titleColor?: string | null
  titleSize?: string | null
  titleShadow?: string | null
  image: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface About {
  id: string
  title: string
  content: string
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string | null
  message?: string | null
  products?: InquiryProduct[]
  status?: 'new' | 'hot' | 'warm' | 'cold' | 'contacted' | 'closed' | 'lost'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  source?: string
  assignedTo?: string | null
  lastContactDate?: Date | null
  nextFollowUpDate?: Date | null
  followUpNotes?: string | null
  tags?: string[]
  estimatedValue?: number | null
  isConvertedToClient?: boolean
  clientId?: string | null
  followUpHistory?: FollowUpHistory[]
  createdAt: Date
  updatedAt: Date
}

export interface FollowUpHistory {
  id: string
  inquiryId: string
  type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'note'
  description: string
  outcome?: 'positive' | 'negative' | 'neutral' | 'scheduled' | null
  nextAction?: string | null
  createdAt: Date
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  notes?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface InquiryProduct {
  id: string
  product: Product
  quantity: number
  inquiry: Inquiry
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message?: string
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: Date | null
  assignedTo?: string | null
  clientId?: string | null
  inquiryId?: string | null
  tags: string[]
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Brand {
  id: string
  name: string
  logo: string
  website?: string | null
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}