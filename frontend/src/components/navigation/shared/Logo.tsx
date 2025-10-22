'use client'

import Link from 'next/link'
import { LogoProps } from './types'

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex-shrink-0 ${className}`}>
      <Link href="/" className="flex items-center">
        <img 
          src="/logo.svg" 
          alt="LB Premium" 
          className="h-8 w-auto"
        />
      </Link>
    </div>
  )
}
