import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedServices() {
  try {
    console.log('🌱 Seeding services...')

    // Crear servicios de ejemplo
    const services = [
      {
        title: 'Merchandising Tradicional',
        description: 'Ponemos tu marca en todo tipo de objetos promocionales. Termos, botellas, lápices, biromes, lanyards, pins, llaveros, gorros, sombreros, medias, tazas, cuadernos, auriculares, mates, vasos térmicos.',
        image: 'https://static.landkit.engeni.com/assets/3024/a5104cf2-4317-4aab-9461-600f6b8deadd/baa6691a236939a18e77.png',
        order: 1,
        isActive: true
      },
      {
        title: 'Textiles',
        description: 'Hace más de 20 años que fabricamos Textiles, desarrollamos líneas de producto, molderías a medida. Producimos en pequeña escala para personal o publicidad. También FASON para reconocidas marcas.',
        image: 'https://static.landkit.engeni.com/assets/3024/4a97e670-3882-4471-83ba-584bcfe2c097/f6d2a30409a6ddac0db6.png',
        order: 2,
        isActive: true
      },
      {
        title: 'Packaging',
        description: 'Nuestros PACKAGINGS llevan tu concepto hasta los límites! Packs primarios y secundarios. Cajas, tubos, cofres, blisters y mucho más.',
        image: 'https://static.landkit.engeni.com/assets/3024/3b63580e-fbe4-47af-a397-afaafe8f0702/e79321e9a6eb4a5fc5c9.png',
        order: 3,
        isActive: true
      },
      {
        title: 'Imprenta',
        description: 'Ofrecemos soluciones de IMPRENTA en todos los soportes, cartulinas, cartones, vinilos, etc. Bolsas, cuadernos, trípticos, brochures, tarjetones, tent cards, credenciales, blisters, stickers, banners, posters, banderas, etc.',
        image: 'https://static.landkit.engeni.com/assets/3024/7c22dc66-6502-46e0-b40d-6ae13ed1ca86/85d145a4b9aaddd5aa6a.png',
        order: 4,
        isActive: true
      }
    ]

    // Limpiar servicios existentes
    await prisma.service.deleteMany({})

    // Crear nuevos servicios
    for (const service of services) {
      await prisma.service.create({
        data: service
      })
      console.log(`✅ Created service: ${service.title}`)
    }

    console.log('🎉 Services seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding services:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedServices()
