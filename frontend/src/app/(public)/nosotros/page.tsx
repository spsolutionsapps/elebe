'use client'

import { BrandsGrid } from '@/components/BrandsGrid'
import { ClientOnly } from '@/components/ClientOnly'

export default function NosotrosPage() {
  return (
    <div className="min-h-screen paddingDesktop62 marginTop62 ">

  
      <div className="w-full p-8 mb-12 relative overflow-hidden" style={{ backgroundColor: '#4FBED5',height: '335px' }}>
         
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-4">
              
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              
            </p>
          </div>


          
          <div className='shapeAmarilloIzq slide-in-left'>
            <img src="/shapeAmarilloizq.svg" alt="Shape Catalogo Izq" loading="lazy" />
          </div>

          <div className='logoB slide-in-top'>
            <img src="/letraB.svg" alt="logo B" loading="lazy" />
          </div>

          <div className='logoCorazon slide-in-center'>
            <img src="/logocorazon.svg" alt="logo Corazón" loading="lazy" />
          </div>

          <div className='quienesSomosDerecha slide-in-right'>
            <img src="/quienesSomosDerecha.svg" alt="Shape Catalogo Der" loading="lazy" />
          </div>


        </div>

      {/* Sección de Texto Principal */}
      <section className="py-12 relative z-[110]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[27px] md:text-[36px] text-center text18Mobile font-blue leading-tight mx-auto mb-12">
            Creamos <em>EXPERIENCIAS</em> para ser vividas, <br /> filmadas y viralizadas.
          </p>

          {/* Galería de 3 imágenes */}
          <div className="grid grid-cols-3 gap-0 max-w-6xl mx-auto mb-12">
            <div className="w-full">
              <img 
                src="/experiencia1.webp" 
                alt="Experiencia 1" 
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="w-full">
              <img 
                src="/experiencia2.webp" 
                alt="Experiencia 2" 
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="w-full">
              <img 
                src="/experiencia3.webp" 
                alt="Experiencia 3" 
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Sección Imagen y SOMOS UNA AGENCIA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto mb-12 items-center">
            <div className="order-2 lg:order-1 lg:col-span-1">
              <img 
                src="/experiencia4.webp" 
                alt="Nosotros" 
                className="w-[200px] md:w-full h-auto object-cover mx-auto md:mx-0 md:-mt-[110px]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="order-1 lg:order-2 lg:col-span-2">
              <p className="text-[20px] md:text-[22px] font-blue leading-relaxed text-center md:text-left" style={{ marginTop: '20px' }}>
                Somos una agencia dedicada al diseño y producción de artículos personalizados. Ofrecemos soluciones creativas para las empresas que necesitan darle exposición a su marca.
                <br /><br />
                Nuestra fábrica está homologada por Disney "International Labor Standards The Walt Disney Company Argentina S.A." Trabajamos con las fábricas más avanzadas del mercado.
              </p>
            </div>
          </div>
        
        </div>
      </section>

      {/* Sección Kits de Productos */}
      <section className="bg-white">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
            {/* Columna 1: Todas las Imágenes */}
            <div className="w-full grid grid-cols-2 gap-0">
              <div className="w-full flex">
                <img 
                  src="/kits-01.webp" 
                  alt="Kits de Productos" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="w-full space-y-0">
                <img 
                  src="/kits-02.webp" 
                  alt="Kits de Productos 1" 
                  className="w-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Columna 2: Título y Texto */}
            <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center md:justify-start">
              <div className="text-center md:text-left md:ml-[50px] py-[26px] md:py-0">
                <h3 className="text-[27px] md:text-[36px] font-bold font-blue mb-8 md:mb-16">
                  _Kits de <em className="font-bold italic">Productos</em>
                </h3>
                <p className="text-lg font-blue leading-relaxed md:w-[370px]">
                  Diseñamos <strong>KITS DE PRODUCTOS</strong> pensados para ocasiones especiales como eventos, lanzamientos, inducción de personal, o fechas clave para el calendario de marketing de tu empresa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* Sección Textiles */}
      <section className="py-16 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Primera fila: Título y Texto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Columna 1: Título */}
            <div className="w-full">
              <h3 className="text-[27px] md:text-[36px] font-bold verde text-center md:text-left">
                _Text<em className="font-bold italic">tiles</em>
              </h3>
            </div>
            
            {/* Columna 2: Texto */}
            <div className="w-full">
              <p className="text-lg verde leading-relaxed text-center md:text-left">
                Hace más de 20 años que <strong>FABRICAMOS TEXTILES</strong>, desarrollamos líneas de producto, molderias a medida. Producimos en pequeña escala para personal o publicidad. También <strong>FASÓN</strong> para reconocidas marcas.
              </p>
            </div>
          </div>

          {/* Segunda fila: Imagen */}
          <div className="w-full">
            <img 
              src="/textiles.webp" 
              alt="Textiles" 
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Sección Marroquinería */}
      <section style={{ backgroundColor: '#f1e9d0' }}>
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
            {/* Columna 1: Imagen */}
            <div className="w-full">
              <img 
                src="/marroquineria02.webp" 
                alt="Marroquinería" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Columna 2: Título y Texto */}
            <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center md:justify-start">
              <div className="text-center md:text-left md:ml-[50px] py-[26px] md:py-0">
                <h3 className="text-[27px] md:text-[36px] font-bold font-blue mb-8 md:mb-16">
                  _Marro<em className="font-bold italic">quineria</em>
                </h3>
                <p className="text-lg font-blue leading-relaxed md:w-[370px]">
                  Desarrollos productos de <strong>MARROQUINERÍA</strong> con el concepto de tu emprendimiento. Mochilas, materas, riñoneras, fundas para dispositivos, bolsos, nécessaires, billeteras, porta documentos, bolsas, etc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* Sección Merchandising */}
      <section className="py-16" style={{ backgroundColor: '#e6b6b4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Primera fila: Título y Texto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Columna 1: Título */}
            <div className="w-full">
              <h3 className="text-[27px] md:text-[36px] font-bold verde text-center md:text-left">
                _Merch<em className="font-bold italic">andising</em>
              </h3>
            </div>
            
            {/* Columna 2: Texto */}
            <div className="w-full">
              <p className="text-lg verde leading-relaxed text-center md:text-left">
                <strong>MERCH</strong> tradicional. Ponemos tu marca en todo tipo de objetos promocionales. Termos, botellas, lápices, biromes, lanyards, pins, llaveros, gorros, sombreros, medias, tazas, cuadernos, auriculares, mates, vasos térmicos.
              </p>
            </div>
          </div>

          {/* Segunda fila: Imagen */}
          <div className="w-full">
            <img 
              src="/merchandising1.webp" 
              alt="Merchandising" 
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Sección Imprenta y Pack */}
      <section className="bg-white">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
            {/* Columna 1: 2 Imágenes */}
            <div className="w-full flex flex-col">
              <img 
                src="/imprentaypack-01.webp" 
                alt="Imprenta y Pack 1" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <img 
                src="/imprentaypack-02.webp" 
                alt="Imprenta y Pack 2" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Columna 2: Título, Texto e Imagen */}
            <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-[26px] md:py-0">
              <div className="text-center md:text-left md:ml-[50px]">
                <h3 className="text-[27px] md:text-[36px] font-bold verde mb-8 md:mb-16">
                  _Imprenta y <em className="font-bold italic">Pack</em>
                </h3>
                <p className="text-lg verde leading-relaxed md:w-[450px] mb-6">
                  Ofrecemos soluciones de <strong>IMPRENTA</strong> en todos los soportes, cartulinas, cartones, vinilos, etc. Bolsas, cuadernos, trípticos, brochures, tarjetones, tent cards, credenciales, blisters, stickers, banners, posters, banderas, etc.
                  <br /><br />
                  Nuestros <strong>PACKAGINGS</strong> llevan tu concepto hasta los límites! Packs primarios y secundarios. Cajas, tubos, cofres, blisters y mucho más.
                </p>
              </div>
              <div className="flex justify-center md:justify-start md:ml-[50px]">
                <img 
                  src="/imprentaypack-03.webp" 
                  alt="Imprenta y Pack 3" 
                  className="w-[200px] md:w-[200px] h-auto object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Marcas */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ClientOnly>
            <BrandsGrid />
          </ClientOnly>
        </div>
      </section>

    </div>  
   
   
  )
}
