'use client'

import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchProps } from './types'

export function SearchBar({ 
  isOpen, 
  searchTerm, 
  onToggle, 
  onSubmit, 
  onChange, 
  variant 
}: SearchProps) {
  if (variant === 'desktop') {
    return (
      <div className="relative hidden md:block">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          style={{ backgroundColor: '#176A7B' }}
          onClick={onToggle}
        >
          <Search className="h-6 w-6 text-white" />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute right-full top-0 mr-2 overflow-hidden hidden md:block"
            >
              <form onSubmit={onSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="¿Qué producto buscas?"
                  value={searchTerm}
                  onChange={(e) => onChange(e.target.value)}
                  className="bg-white text-black placeholder-gray-500 px-4 rounded-full border-none outline-none w-64"
                  style={{ height: '48px' }}
                  autoFocus
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Mobile variant
  return (
    <div className="mb-4">
      <form onSubmit={onSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="¿Qué producto buscas?"
          value={searchTerm}
          onChange={(e) => onChange(e.target.value)}
          className="mobile-search-input"
        />
      </form>
    </div>
  )
}
