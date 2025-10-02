import React from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  error?: string
  touched?: boolean
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ 
  label, 
  error, 
  touched, 
  required, 
  children, 
  className 
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {touched && error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  touched?: boolean
}

export function Input({ error, touched, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        error && touched && 'border-red-500 focus:ring-red-500 focus:border-red-500',
        className
      )}
      {...props}
    />
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  touched?: boolean
}

export function Textarea({ error, touched, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        error && touched && 'border-red-500 focus:ring-red-500 focus:border-red-500',
        className
      )}
      {...props}
    />
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  touched?: boolean
  options: { value: string; label: string }[]
}

export function Select({ error, touched, options, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        error && touched && 'border-red-500 focus:ring-red-500 focus:border-red-500',
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
