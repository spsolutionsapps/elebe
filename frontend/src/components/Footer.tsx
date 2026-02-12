'use client'

import { Instagram, Linkedin } from 'lucide-react'
import { NewsletterForm } from './NewsletterForm'
import Link from 'next/link'

export function Footer() {

  return (
    <footer className="relative">
      {/* Newsletter Section */}
      <div className="py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h2 className="text-[#004CAC] text-2xl font-bold uppercase tracking-wide">
              Suscríbete a Nuestro Newsletter
            </h2>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* First Row: enlaces → logo → redes, todo centrado */}
          <div className="flex flex-col items-center gap-6 mb-8">
            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-8">
              <Link href="/" className="text-[#004CAC] hover:text-[#004CAC]/80 transition-colors font-medium">
                Inicio
              </Link>
              <Link href="/catalogo" className="text-[#004CAC] hover:text-[#004CAC]/80 transition-colors font-medium">
                Catálogo
              </Link>
              <Link href="/servicios" className="text-[#004CAC] hover:text-[#004CAC]/80 transition-colors font-medium hidden">
                Servicios
              </Link>
              <Link href="/nosotros" className="text-[#004CAC] hover:text-[#004CAC]/80 transition-colors font-medium">
                Nosotros
              </Link>
              <Link href="/contacto" className="text-[#004CAC] hover:text-[#004CAC]/80 transition-colors font-medium">
                Contacto
              </Link>
            </div>

            {/* Logo y redes en el mismo renglón */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/" className="flex items-center">
                <img 
                  src="/logo.svg" 
                  alt="LB Premium" 
                  className="h-8 w-auto"
                />
              </Link>
              <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/elebe.agencia" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-[#004CAC] hover:text-[#004CAC]/80 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://ar.linkedin.com/company/elebeagencia" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center text-[#004CAC] hover:text-[#004CAC]/80 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              </div>
            </div>
          </div>

          {/* Second Row - Contacto centrado */}
          <div className="flex flex-col items-center text-sm">
            {/* Contact Information: dirección arriba, tel y email abajo, todo centrado */}
            <div className="flex flex-col items-center justify-center gap-2 text-center text-[#004CAC] w-full">
              <span>Colectora Panamericana 1807, San Isidro, Buenos Aires.</span>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="tel:+5491166247880" 
                  className="underline hover:text-[#004CAC]/80 transition-colors text-[#004CAC]"
                >
                  +54 9 11 6624-7880
                </a>
                <a 
                  href="mailto:info@elebe.agency" 
                  className="underline hover:text-[#004CAC]/80 transition-colors text-[#004CAC]"
                >
                  info@elebe.agency
                </a>
              </div>
            </div>

          <div className='bFooter hidden md:block'> 
            <img className="bFooter" src="/bFooter.svg" alt="LB Premium"  />
          </div>

          <div className='footerDer hidden md:block'> 
            <img src="/footerDer.svg" alt="LB Premium"  />
          </div>
          </div>

          {/* Copyright - abajo de todo */}
          <div className="mt-8 md:mt-0 pt-6 border-t border-gray-200 text-center">
            <p className="text-[#004CAC] text-sm">
              © 2026 Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
