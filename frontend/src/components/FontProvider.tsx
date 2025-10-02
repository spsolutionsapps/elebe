'use client'

/**
 * FontProvider
 * 
 * Proveedor de fuentes para el sitio.
 * - Sitio público: Usa fuentes Gotham (Book, Medium, Black Italic)
 * - Panel admin: Puede usar fuentes diferentes si se necesita
 * 
 * Las fuentes Gotham se cargan desde /public/fonts/ 
 * Las definiciones @font-face están en globals.css
 */

export function FontProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body">
      {children}
    </div>
  )
}








