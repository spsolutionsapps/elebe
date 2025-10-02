'use client'

import { useState } from 'react'
import NextLink from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Grid3X3, 
  Shirt, 
  Calendar, 
  Megaphone, 
  Download, 
  ShoppingBag,
  Backpack,
  Utensils,
  Package,
  Coffee,
  BookOpen,
  Pen,
  Home,
  Key,
  Clock,
  Mountain,
  Box,
  Sun,
  Truck,
  Leaf,
  Smartphone,
  MapPin,
  Tractor,
  Umbrella
} from 'lucide-react'

interface CatalogMegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function CatalogMegaMenu({ isOpen, onClose }: CatalogMegaMenuProps) {
  if (!isOpen) return null

  const categories = [
    // Columna 1
    [
      { name: 'Todas', icon: Grid3X3, href: '/catalogo' },
      { name: 'Oficina', icon: Pen, href: '/catalogo?category=oficina' },
      { name: 'Deporte', icon: Package, href: '/catalogo?category=deporte' },
      { name: 'Viajes', icon: MapPin, href: '/catalogo?category=viajes' },
      { name: 'Moda', icon: Shirt, href: '/catalogo?category=moda' },
      { name: 'Uniformes', icon: Tractor, href: '/catalogo?category=uniformes' },
      { name: 'Bebidas', icon: Coffee, href: '/catalogo?category=bebidas' }
    ],
    // Columna 2
    [
      { name: 'Imprenta', icon: BookOpen, href: '/catalogo?category=imprenta' },
      { name: 'Merch', icon: Key, href: '/catalogo?category=merch' },
      { name: 'Tecnología', icon: Smartphone, href: '/catalogo?category=tecnologia' },
      { name: 'Bonus', icon: Sun, href: '/catalogo?category=bonus' }
    ]
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed left-0 right-0 w-full backdrop-blur-md shadow-2xl border-t border-gray-700 z-[99999] top-16 md:top-[95px]"
          style={{ 
            backgroundColor: 'rgb(0 0 0 / 0.8)'
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="max-w-8xl mx-auto px-8 py-10">
            <div className="grid grid-cols-2 gap-12">
              {categories.map((column, columnIndex) => (
                <motion.div 
                  key={columnIndex} 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: columnIndex * 0.1 }}
                >
                  {/* Título de la columna */}
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      {columnIndex === 0 ? 'Categorías Principales' : 
                       columnIndex === 1 ? 'Más Categorías' :
                       columnIndex === 2 ? 'Productos Especializados' :
                       columnIndex === 3 ? 'Categorías Específicas' :
                       'Más Categorías'}
                    </h3>
                  </div>
                  
                  {column.map((category, index) => (
                    <NextLink
                      key={index}
                      href={category.href}
                      className="flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-white/10 transition-all duration-200 group"
                      onClick={onClose}
                    >
                      <category.icon className="h-4 w-4 text-blue transition-colors duration-200 flex-shrink-0" />
                      <span className="text-sm text-gray-200 group-hover:text-white transition-colors duration-200">
                        {category.name}
                      </span>
                    </NextLink>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
