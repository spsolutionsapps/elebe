// Bundle optimization utilities

// Dynamic imports para componentes pesados
export const dynamicImports = {
  // Componentes de admin (solo cargar cuando se necesiten)
  AdminDashboard: () => import('@/app/admin/page'),
  AdminInquiries: () => import('@/app/admin/inquiries/page'),
  AdminProducts: () => import('@/app/admin/products/page'),
  AdminClients: () => import('@/app/admin/clients/page'),
  AdminReminders: () => import('@/app/admin/reminders/page'),
  AdminTasks: () => import('@/app/admin/tasks/page'),
  
  // Componentes de UI pesados
  ImageGallery: () => import('@/components/ui/optimized-image').then(m => ({ default: m.ImageGallery })),
  ProductForm: () => import('@/components/examples/ProductFormWithValidation'),
  
  // Librerías externas (comentadas temporalmente)
  // Chart: () => import('react-chartjs-2'),
  // DatePicker: () => import('react-datepicker'),
}

// Preload de componentes críticos
export function preloadCriticalComponents() {
  // Preload componentes que se usan en la página principal
  dynamicImports.AdminDashboard()
  dynamicImports.ImageGallery()
}

// Lazy loading de rutas
export const lazyRoutes = {
  admin: () => import('@/app/admin/layout'),
  adminInquiries: () => import('@/app/admin/inquiries/page'),
  adminProducts: () => import('@/app/admin/products/page'),
  adminClients: () => import('@/app/admin/clients/page'),
  adminReminders: () => import('@/app/admin/reminders/page'),
  adminTasks: () => import('@/app/admin/tasks/page'),
}

// Optimización de imports
export function optimizeImports() {
  // Import solo lo que se necesita de librerías grandes
  const { format } = require('date-fns')
  const { debounce } = require('lodash-es')
  
  return { format, debounce }
}

// Tree shaking helpers
export const treeShakingHelpers = {
  // Import específico de iconos
  getIcon: (iconName: string) => {
    switch (iconName) {
      case 'plus': return import('lucide-react').then(m => m.Plus)
      case 'edit': return import('lucide-react').then(m => m.Edit)
      case 'delete': return import('lucide-react').then(m => m.Trash2)
      case 'save': return import('lucide-react').then(m => m.Save)
      default: return import('lucide-react').then(m => m.HelpCircle)
    }
  },
  
  // Import específico de utilidades
  getUtility: (utilName: string) => {
    switch (utilName) {
      case 'cn': return import('@/lib/utils').then(m => m.cn)
      // case 'formatDate': return import('@/lib/utils').then(m => m.formatDate)
      default: return Promise.resolve(null)
    }
  }
}

// Bundle analyzer helper
export function analyzeBundle() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available in development mode')
    console.log('Run: npm run analyze to see bundle breakdown')
  }
}

// Performance monitoring
export function monitorPerformance() {
  if (typeof window !== 'undefined') {
    // Monitor Core Web Vitals (comentado temporalmente)
    // import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    //   getCLS(console.log)
    //   getFID(console.log)
    //   getFCP(console.log)
    //   getLCP(console.log)
    //   getTTFB(console.log)
    // })
  }
}

// Code splitting helpers
export const codeSplitting = {
  // Split por rutas
  routeSplit: (route: string) => {
    switch (route) {
      case '/admin': return dynamicImports.AdminDashboard()
      case '/admin/inquiries': return dynamicImports.AdminInquiries()
      case '/admin/products': return dynamicImports.AdminProducts()
      default: return Promise.resolve(null)
    }
  },
  
  // Split por funcionalidad
  featureSplit: (feature: string) => {
    switch (feature) {
      case 'image-gallery': return dynamicImports.ImageGallery()
      case 'product-form': return dynamicImports.ProductForm()
      default: return Promise.resolve(null)
    }
  }
}
