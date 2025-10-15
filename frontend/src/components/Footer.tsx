'use client'

import { Instagram, Linkedin } from 'lucide-react'
import { NewsletterForm } from './NewsletterForm'
import Link from 'next/link'

export function Footer() {

  return (
    <footer>
      {/* Newsletter Section */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h2 className="text-white text-2xl font-bold uppercase tracking-wide">
              Suscríbete a Nuestro Newsletter
            </h2>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* First Row */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            {/* Logo */}
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <img 
                  src="/logo.svg" 
                  alt="LB Premium" 
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center md:justify-center gap-8 mb-6 md:mb-0">
              <Link href="/" className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
                Inicio
              </Link>
              <Link href="/catalogo" className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
                Catálogo
              </Link>
              <Link href="/servicios" className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
                Servicios
              </Link>
              <Link href="/nosotros" className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
                Nosotros
              </Link>
              <Link href="/contacto" className="text-gray-900 hover:text-blue-600 transition-colors font-medium">
                Contacto
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/lbpremium" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/lbpremium" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-200 mb-8"></div>

          {/* Second Row */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            {/* Copyright */}
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500">
                © Copyright 2025, Todos los Derechos Reservados
              </p>
            </div>

            {/* Contact Information */}
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-gray-700">
              <span>Av. Principal 1234 Ciudad, Buenos Aires 1000</span>
              <a 
                href="tel:+541112345678" 
                className="underline hover:text-blue-600 transition-colors"
              >
                +54 11 1234-5678
              </a>
              <a 
                href="mailto:info@lbpremium.com" 
                className="underline hover:text-blue-600 transition-colors"
              >
                info@lbpremium.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
