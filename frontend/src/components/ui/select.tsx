'use client'

import React from 'react'

// Tipo para las opciones
interface OptionType {
  value: string
  label: string
  icon?: string
}

interface CustomSelectProps {
  options: OptionType[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function CustomSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Seleccionar...',
  className = ''
}: CustomSelectProps) {
  return (
    <div className={className}>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}