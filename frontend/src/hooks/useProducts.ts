import { useState, useEffect, useMemo } from 'react'
import { Product } from '@/types'
import { getApiUrl } from '@/lib/config'

interface UseProductsReturn {
  // Estados
  products: Product[]
  loading: boolean
  showForm: boolean
  editingProduct: Product | null
  showDeleteModal: boolean
  productToDelete: Product | null
  
  // Filtros y vista
  searchTerm: string
  selectedCategory: string
  statusFilter: string
  viewMode: 'grid' | 'table'
  sortBy: 'name' | 'category' | 'createdAt' | 'views'
  sortOrder: 'asc' | 'desc'
  currentPage: number
  itemsPerPage: number
  
  // Datos procesados
  filteredAndSortedProducts: Product[]
  paginatedProducts: Product[]
  stats: {
    total: number
    active: number
    inactive: number
    categoryStats: Record<string, number>
  }
  categories: string[]
  totalPages: number
  
  // Acciones
  setShowForm: (show: boolean) => void
  setEditingProduct: (product: Product | null) => void
  setShowDeleteModal: (show: boolean) => void
  setProductToDelete: (product: Product | null) => void
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  setStatusFilter: (status: string) => void
  setViewMode: (mode: 'grid' | 'table') => void
  setSortBy: (field: 'name' | 'category' | 'createdAt' | 'views') => void
  setSortOrder: (order: 'asc' | 'desc') => void
  setCurrentPage: (page: number) => void
  
  // Operaciones
  fetchProducts: () => Promise<void>
  handleEdit: (product: Product) => void
  handleDelete: (product: Product) => void
  confirmDelete: () => Promise<void>
  toggleProductStatus: (id: string, currentStatus: boolean) => Promise<void>
  clearFilters: () => void
  handleSort: (field: 'name' | 'category' | 'createdAt' | 'views') => void
}

export function useProducts(): UseProductsReturn {
  // Estados principales
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  
  // Estados para filtros y vista
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'createdAt' | 'views'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

  // Cargar productos al montar
  useEffect(() => {
    fetchProducts()
  }, [])

  // Lógica de filtrado y ordenamiento
  const filteredAndSortedProducts = useMemo(() => {
    
    let filtered = products.filter(product => {
      // Filtro por búsqueda
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filtro por categoría (manejar array o string - compatibilidad con migraciones)
      const productCategories = Array.isArray(product.category)
        ? product.category
        : (typeof product.category === 'string' ? [product.category] : [])
      const matchesCategory = !selectedCategory || productCategories.some(cat =>
        cat.toLowerCase() === selectedCategory.toLowerCase()
      )
      
      // Filtro por estado
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && product.isActive) ||
        (statusFilter === 'inactive' && !product.isActive)
      
      if (statusFilter === 'inactive' && !product.isActive) {
        console.log('✅ Product matches inactive filter:', product.name, product.isActive)
      }
      
      return matchesSearch && matchesCategory && matchesStatus
    })

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'category':
          // Manejar category como array o string para ordenamiento
          const aCategory = Array.isArray(a.category) ? a.category.join(', ') : (typeof a.category === 'string' ? a.category : '')
          const bCategory = Array.isArray(b.category) ? b.category.join(', ') : (typeof b.category === 'string' ? b.category : '')
          aValue = aCategory.toLowerCase()
          bValue = bCategory.toLowerCase()
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [products, searchTerm, selectedCategory, statusFilter, sortBy, sortOrder])

  // Paginación
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredAndSortedProducts.slice(startIndex, endIndex)
  }, [filteredAndSortedProducts, currentPage, itemsPerPage])

  // Estadísticas
  const stats = useMemo(() => {
    const total = products.length
    const active = products.filter(p => p.isActive).length
    const inactive = total - active
    
    const categoryStats = products.reduce((acc, product) => {
      const productCategories = Array.isArray(product.category)
        ? product.category
        : (typeof product.category === 'string' ? [product.category] : [])
      productCategories.forEach(cat => {
        acc[cat] = (acc[cat] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    return { total, active, inactive, categoryStats }
  }, [products])

  // Categorías únicas
  const categories = useMemo(() => {
    const allCategories: string[] = []
    products.forEach(p => {
      const productCategories = Array.isArray(p.category)
        ? p.category
        : (typeof p.category === 'string' ? [p.category] : [])
      allCategories.push(...productCategories)
    })
    const uniqueCategories = [...new Set(allCategories)].sort()
    return uniqueCategories
  }, [products])

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)

  // Funciones de operaciones
  const fetchProducts = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem('access_token')

      const headers: any = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${getApiUrl('/products')}?t=${Date.now()}`, {
        method: 'GET',
        headers,
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(Array.isArray(data) ? data : [])
      } else {
        console.error('Error fetching products:', response.status)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      const token = localStorage.getItem('access_token')
      
      const headers: any = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(getApiUrl(`/products/${productToDelete.id}`), {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        fetchProducts()
        setShowDeleteModal(false)
        setProductToDelete(null)
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Error al eliminar el producto'}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar el producto')
    }
  }

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('access_token')
      
      const headers: any = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(getApiUrl(`/products/${id}`), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      console.log('📡 Response status:', response.status)
      
      if (response.ok) {
        const updatedProduct = await response.json()
        fetchProducts()
      } else {
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
      }
    } catch (error) {
      console.error('❌ Network error:', error)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  const handleSort = (field: 'name' | 'category' | 'createdAt' | 'views') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  return {
    // Estados
    products,
    loading,
    showForm,
    editingProduct,
    showDeleteModal,
    productToDelete,
    searchTerm,
    selectedCategory,
    statusFilter,
    viewMode,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    
    // Datos procesados
    filteredAndSortedProducts,
    paginatedProducts,
    stats,
    categories,
    totalPages,
    
    // Setters
    setShowForm,
    setEditingProduct,
    setShowDeleteModal,
    setProductToDelete,
    setSearchTerm,
    setSelectedCategory,
    setStatusFilter,
    setViewMode,
    setSortBy,
    setSortOrder,
    setCurrentPage,
    
    // Operaciones
    fetchProducts,
    handleEdit,
    handleDelete,
    confirmDelete,
    toggleProductStatus,
    clearFilters,
    handleSort
  }
}
