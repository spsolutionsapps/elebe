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
      { name: 'Oficina', icon: Pen, href: '/catalogo?category=oficina', description: 'welcome kits, cuadernos, biromes, soportes, etc' },
      { name: 'Deporte', icon: Package, href: '/catalogo?category=deporte', description: 'remeras maratones, mochilas, toallas, bolsos, brazaletes, etc' },
      { name: 'Viajes', icon: MapPin, href: '/catalogo?category=viajes', description: 'carry on, mochilas, bolsos, neceser, antifaces, almohadas, etc' },
      { name: 'Moda', icon: Shirt, href: '/catalogo?category=moda', description: 'hoodies, crew, remeras, chombas, gorras, camperas, etc' },
      { name: 'Uniformes', icon: Tractor, href: '/catalogo?category=uniformes', description: 'trabajo, lady stork, Michelin, etc' }
    ],
    // Columna 2
    [
      { name: 'Bebidas', icon: Coffee, href: '/catalogo?category=bebidas', description: 'botellas, vasos, termos, mates, tazas' },
      { name: 'Imprenta', icon: BookOpen, href: '/catalogo?category=imprenta', description: 'pack, poster, tarjetones, stickers, etc' },
      { name: 'Merch', icon: Key, href: '/catalogo?category=merch', description: 'pins, lanyards, gorras, totebags, llaveros, etc' },
      { name: 'Tecnología', icon: Smartphone, href: '/catalogo?category=tecnologia', description: 'auriculares, relojes, cargadores, insta pix' },
      { name: 'Bonus', icon: Sun, href: '/catalogo?category=bonus', description: '3d, cosas especiales, abanicos, etc' }
    ]
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed left-0 right-0 w-full z-[99999] top-16 md:top-[95px] flex justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div 
            className="w-[600px] shadow-lg p-6 -mt-px relative overflow-hidden"
            style={{ 
              backgroundColor: '#0ea5e9',
              borderRadius: '0 0 8px 8px'
            }}
          >
            <div className="space-y-4 relative z-[1]">
              {/* Todas - Full width header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NextLink
                  href="/catalogo"
                  className="flex items-center space-x-2 py-2 px-3 rounded-md transition-all duration-200 group"
                  style={{ 
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.backgroundColor = '#1289bf'
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={onClose}
                >
                  <Grid3X3 className="h-4 w-4 text-white transition-colors duration-200 flex-shrink-0" />
                  <span className="text-[16px] font-medium text-white group-hover:text-blue-100 transition-colors duration-200">
                    Todas
                  </span>
                </NextLink>
              </motion.div>

              {/* Categories in 2 columns */}
              <div className="grid grid-cols-2 gap-8">
                {categories.map((column, columnIndex) => (
                  <motion.div 
                    key={columnIndex} 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (columnIndex + 1) * 0.1 }}
                  >
                    {column.map((category, index) => (
                      <NextLink
                        key={index}
                        href={category.href}
                        className="flex items-start space-x-2 py-2 px-3 rounded-md transition-all duration-200 group"
                        style={{ 
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.currentTarget.style.backgroundColor = '#1289bf'
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                        onClick={onClose}
                      >
                        <category.icon className="h-4 w-4 text-white transition-colors duration-200 flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-[16px] font-medium text-white group-hover:text-blue-100 transition-colors duration-200">
                            {category.name}
                          </span>
                          {category.description && (
                            <span className="text-[11px] text-white/80 group-hover:text-blue-100/90 transition-colors duration-200 leading-tight">
                              {category.description}
                            </span>
                          )}
                        </div>
                      </NextLink>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className='shapeRayo'>
              <img src="/rayo.svg" alt="ShapeRayo" />
            </div>

            <div className='shapeMenuIzq'>
              <img src="/shapeMenuIzq.svg" alt="ShapeMenuIzq" />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
