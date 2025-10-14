'use client'

export function WorkProcessSection() {
  return (
    <section className="process-section py-20 relative z-[150] w-screen" style={{
      backgroundColor: '#12161E',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header del Proceso */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

          {/* Lado Izquierdo - Elementos Visuales */}
          <div className="relative">
            {/* Círculo verde grande */}

            {/* Imagen con play button */}
            <div className="relative z-10 ml-8">
              <div className="relative w-full max-w-md mx-auto">
                <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative group cursor-pointer">
                  {/* Video */}
                  <video
                    className="w-full h-full object-cover"
                    poster="/api/placeholder/400/225"
                    controls={false}
                    muted
                    loop
                  >
                    <source src="/videos/proceso-lb-premium.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento video.
                  </video>

                  {/* Overlay con botón de reproducción azul */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-all duration-300">
                    <div className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center mx-auto shadow-lg transform group-hover:scale-110 transition-all duration-300">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Derecho - Texto */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Guiados por el Proceso,<br />
              Impulsados por Resultados.
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Seguimos un flujo de trabajo optimizado e inteligente diseñado para
              eliminar fricciones y entregar resultados consistentes.
            </p>
          </div>
        </div>

        {/* Cards del Proceso */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-600/50 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold text-white mb-3">
              Acerca de Nosotros
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Somos una agencia dedicada al diseño y producción de artículos personalizados. Ofrecemos soluciones creativas para las empresas que necesitan darle exposición a su marca. Nuestra fábrica está homologada por Disney "International Labor Standards The Walt Disney Company Argentina S.A." Trabajamos con las fábricas más avanzadas del mercado.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-600/50 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold text-white mb-3">
              Servicios
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Ofrecemos diseño de kits, textiles, marroquinería, packaging, y servicios de impresión premium en una amplia gama de soportes. Nuestra experiencia y colaboración con las fábricas más avanzadas garantizan productos de primera clase. Potenciamos tu marca con nuestro merchandising tradicional y soluciones de impresión premium.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-600/50 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold text-white mb-3">
              Algunos de Nuestros Clientes
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              <span className="block mb-2 font-medium">(Atendemos Empresas y Negocios de todos los tamaños)</span>
              Disney, Marvel, ESPN, Molinos, Mercado Libre, Star+, Globant, Día, KTM, Coca Cola, Stella Artois, Poker Stars, Yamaha, Honda, Alpinestars, Noblex, La Salteña, Bigbox, Cat, Flex, Monster, Patagonia, Perica, Miss Mundo Argentina, Toyota, Cienfuegos, Ansilta, Metalconf, Soulmax, La Plata Clima, Tascani, Brubank, Pani, Molinos Ferba, Uber, Quento Snaks, PHM, Nipro, Lavazza, Gaona, Jugos Tutti, Herencia Custom Garage, Grupo Dabra, Dexter, LG.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

