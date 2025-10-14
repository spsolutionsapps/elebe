'use client'

export function ServicesHighlightedSection() {
  return (
    <section 
      className="two-column-section py-16 relative z-[110] w-screen" 
      style={{ 
        backgroundColor: '#12161E', 
        marginLeft: 'calc(-50vw + 50%)', 
        marginRight: 'calc(-50vw + 50%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}
    >
    

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="services-header mb-20 text-center">
          <h2 className="text-white text-4xl lg:text-[32px] font-heading font-light leading-tight mb-6">
            <span className="font-blue font-heading">Nuestros</span> Servicios Destacados
          </h2>
          <p className="text-gray-300 text-lg lg:text-xl max-w-4xl mx-auto">
            Explorá Nuestras Soluciones de Merchandising y Diseño Premium <br />
            Atendemos Empresas y Negocios de todos los tamaños
          </p>
        </div>
        
        {/* Primera fila: Texto izquierda, Imagen derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Lado izquierdo - Texto */}
          <div className="space-y-8">
            {/* Primer bloque: Título + Texto */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold white-text leading-tight">
                Merchandising Tradicional
              </h2>
              <p className="text-base white-text leading-relaxed">
                Ponemos tu marca en todo tipo de objetos promocionales. Termos, botellas, lápices, biromes, lanyards, pins, llaveros, gorros, sombreros, medias, tazas, cuadernos, auriculares, mates, vasos térmicos.
              </p>
            </div>

            {/* Segundo bloque: Título + Texto */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold white-text leading-tight">
                Textiles
              </h2>
              <p className="text-base white-text leading-relaxed">
                Hace más de 20 años que fabricamos Textiles, desarrollamos líneas de producto, moldeerías a medida. Producimos en pequeña escala para personal o publicidad. También FASON para reconocidas marcas.
              </p>
            </div>
          </div>
          
          {/* Lado derecho - Imagen */}
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src="/merchYtextiles.png" 
                alt="Merchandising y Textiles" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Segunda fila: Imagen izquierda, Texto derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Lado izquierdo - Imagen */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src="/packYimprenta.png" 
                alt="Packaging e Imprenta" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Lado derecho - Texto */}
          <div className="space-y-8 order-1 lg:order-2">
            {/* Primer bloque: Título + Texto */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold white-text leading-tight">
                Packaging
              </h2>
              <p className="text-base white-text leading-relaxed">
                Diseñamos y fabricamos packaging personalizado para tu marca. Cajas, bolsas, etiquetas, stickers, embalajes y todo tipo de presentaciones que hagan que tu producto se destaque.
              </p>
            </div>

            {/* Segundo bloque: Título + Texto */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold white-text leading-tight">
                Imprenta
              </h2>
              <p className="text-base white-text leading-relaxed">
                Servicios de imprenta digital y offset. Folletos, tarjetas, afiches, banners, libros, revistas y todo tipo de material gráfico. Calidad profesional con los mejores materiales y acabados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
