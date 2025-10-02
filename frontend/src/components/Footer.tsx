'use client'

import { useState } from 'react'
import { Facebook, Twitter, Mail, Phone, MapPin, Send } from 'lucide-react'

export function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Newsletter email submitted
    setEmail('')
  }

  return (
    <footer className="bg-white text-gray-900 py-16 border-t border-gray-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Sección 1: Información de la empresa y redes sociales */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center mb-6">
              <img 
                src="/logo.svg" 
                alt="LB Premium" 
                className="h-10 w-auto"
              />
            </div>
            
            {/* Texto de copyright */}
            <p className="text-gray-600 mb-6 leading-relaxed font-kanit">
              LB Premium Todos los Derechos Reservados. Diseñado con pasión, 
              creemos algo increíble juntos.
            </p>
            
            {/* Redes sociales */}
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors duration-300 footer-social-icon"
              >
                <Facebook className="h-5 w-5 text-gray-600" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors duration-300 footer-social-icon"
              >
                <Twitter className="h-5 w-5 text-gray-600" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors duration-300 footer-social-icon"
              >
                <Mail className="h-5 w-5 text-gray-600" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors duration-300 footer-social-icon"
              >
                <Send className="h-5 w-5 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Sección 2: Enlaces rápidos */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider mb-6 text-gray-900 font-kanit">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/nosotros" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 footer-link font-kanit">
                  Acerca de Nosotros
                </a>
              </li>
              <li>
                <a href="/servicios" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 footer-link font-kanit">
                  Nuestros Servicios
                </a>
              </li>
              <li>
                <a href="/productos" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 footer-link font-kanit">
                  Nuestros Productos
                </a>
              </li>
              <li>
                <a href="/contacto" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 footer-link font-kanit">
                  Contáctanos
                </a>
              </li>
            </ul>
          </div>

          {/* Sección 3: Información de oficina */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider mb-6 text-gray-900 font-kanit">
              Oficina
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-gray-600 font-kanit">
                  Av. Principal 1234<br />
                  Ciudad, Buenos Aires 1000
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-600 mr-3" />
                <a 
                  href="tel:+54123456789" 
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-300 footer-link underline font-kanit"
                >
                  +54 11 1234-5678
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-600 mr-3" />
                <a 
                  href="mailto:info@lbpremium.com" 
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-300 footer-link font-kanit"
                >
                  info@lbpremium.com
                </a>
              </div>
            </div>
          </div>

          {/* Sección 4: Suscripción al newsletter */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wider mb-6 text-gray-900 font-kanit">
              Suscríbete a Nuestro<br />
              Newsletter
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-kanit"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-blue-600 p-3 rounded-lg transition-colors duration-300 flex items-center justify-center font-kanit"
              >
                <Send className="h-5 w-5 text-white" />
              </button>
            </form>
          </div>
        </div>

     
      </div>
    </footer>
  )
}
