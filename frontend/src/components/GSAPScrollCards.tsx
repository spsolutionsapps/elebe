'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrar el plugin de ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface CardData {
  id: string
  title: string
  description: string
  image: string
}

interface GSAPScrollCardsProps {
  cards: CardData[]
  className?: string
}

export function GSAPScrollCards({ cards, className = '' }: GSAPScrollCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Solo ejecutar GSAP en desktop
    if (typeof window !== 'undefined' && window.innerWidth < 768) return
    if (!containerRef.current || !horizontalRef.current) return

    const ctx = gsap.context(() => {
      // Calcular el ancho total del scroll horizontal
      const totalWidth = horizontalRef.current!.scrollWidth - window.innerWidth

      // Crear el scroll horizontal
      const horizontalScroll = gsap.to(horizontalRef.current, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalWidth + window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      })

      // Animaciones individuales para cada card
      const cardElements = horizontalRef.current?.querySelectorAll('.scroll-card')
      cardElements?.forEach((card, index) => {
        // Animación de entrada - primeras 2 cards visibles desde el inicio
        if (index === 0 || index === 1) {
          gsap.set(card, {
            opacity: 1,
            y: 0,
            rotationY: 0
          })
        } else {
        gsap.fromTo(card, 
          {
            opacity: 0,
            y: 100,
            rotationY: 15
          },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalScroll,
              start: 'left center',
              end: 'right center',
              toggleActions: 'play none none reverse'
            }
          }
        )
        }

      })
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [cards])

  return (
    <>
      {/* Desktop: Scroll horizontal */}
      <div ref={containerRef} className={`hidden md:block h-screen overflow-hidden ${className}`} style={{ paddingTop: '100px' }}>
        <div 
          ref={horizontalRef}
          className="flex items-center gap-[30px]"
          style={{ width: `${cards.length * 1000}px` }}
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="scroll-card flex-shrink-0 flex items-center justify-center"
              style={{ width: '800px', height: '467px' }}
            >
            <div className="w-full h-full bg-white overflow-hidden">
              {/* Contenido arriba */}
              <div className="p-8 bg-gray-50">
                <h3 className="text-3xl font-bold mb-6 text-gray-900">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {card.description}
                </p>
              </div>
              
              {/* Imagen abajo */}
              <div className="w-full h-64">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Mobile: Cards simples */}
      <div className="md:hidden">
        <div className="space-y-8 px-4 py-8">
          {cards.map((card, index) => (
            <div
              key={`mobile-${card.id}`}
              className="bg-white rounded-2xl overflow-hidden"
            >
              <div className="w-full h-48">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
