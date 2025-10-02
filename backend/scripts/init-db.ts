import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Inicializando base de datos...')

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lbpremium.com' },
    update: {},
    create: {
      email: 'admin@lbpremium.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('Usuario administrador creado:', admin.email)

  // Crear algunos slides de ejemplo
  const slides = await Promise.all([
    prisma.slide.upsert({
      where: { id: 'slide-1' },
      update: {},
      create: {
        id: 'slide-1',
        title: 'Bienvenidos a LB Premium',
        subtitle: 'Soluciones profesionales para tu negocio',
        description: 'Descubre nuestra amplia gama de productos y servicios de alta calidad',
        image: '/uploads/slide-1.jpg',
        order: 1,
        isActive: true,
      },
    }),
    prisma.slide.upsert({
      where: { id: 'slide-2' },
      update: {},
      create: {
        id: 'slide-2',
        title: 'Calidad Garantizada',
        subtitle: 'Productos premium para clientes exigentes',
        description: 'Trabajamos con los mejores materiales y procesos para garantizar la excelencia',
        image: '/uploads/slide-2.jpg',
        order: 2,
        isActive: true,
      },
    }),
  ])

  console.log('Slides de ejemplo creados:', slides.length)

  // Crear algunos productos de ejemplo
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'product-1' },
      update: {},
      create: {
        id: 'product-1',
        name: 'Producto Premium A',
        description: 'Descripción detallada del producto premium A con características especiales',
        price: 299.99,
        image: '/uploads/product-1.jpg',
        isActive: true,
      },
    }),
    prisma.product.upsert({
      where: { id: 'product-2' },
      update: {},
      create: {
        id: 'product-2',
        name: 'Producto Premium B',
        description: 'Descripción detallada del producto premium B con características especiales',
        price: 199.99,
        image: '/uploads/product-2.jpg',
        isActive: true,
      },
    }),
  ])

  console.log('Productos de ejemplo creados:', products.length)

  // Crear algunos servicios de ejemplo
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-1' },
      update: {},
      create: {
        id: 'service-1',
        name: 'Consultoría Profesional',
        description: 'Ofrecemos servicios de consultoría especializada para optimizar tu negocio',
        image: '/uploads/service-1.jpg',
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-2' },
      update: {},
      create: {
        id: 'service-2',
        name: 'Desarrollo de Soluciones',
        description: 'Desarrollamos soluciones personalizadas para satisfacer tus necesidades específicas',
        image: '/uploads/service-2.jpg',
        isActive: true,
      },
    }),
  ])

  console.log('Servicios de ejemplo creados:', services.length)

  // Crear contenido "Nosotros" de ejemplo
  const about = await prisma.about.upsert({
    where: { id: 'about-1' },
    update: {},
    create: {
      id: 'about-1',
      title: 'Sobre LB Premium',
      content: `
        <h2>Nuestra Historia</h2>
        <p>LB Premium nació con la visión de proporcionar soluciones de alta calidad para empresas que buscan la excelencia en sus proyectos.</p>
        
        <h2>Nuestra Misión</h2>
        <p>Proporcionar productos y servicios premium que superen las expectativas de nuestros clientes, contribuyendo al éxito de sus proyectos.</p>
        
        <h2>Nuestros Valores</h2>
        <ul>
          <li>Calidad en todo lo que hacemos</li>
          <li>Compromiso con el cliente</li>
          <li>Innovación constante</li>
          <li>Integridad en nuestras relaciones</li>
        </ul>
      `,
      images: ['/uploads/about-1.jpg', '/uploads/about-2.jpg'],
      isActive: true,
    },
  })

  console.log('Contenido "Nosotros" creado')

  console.log('✅ Base de datos inicializada correctamente')
  console.log('📧 Email de administrador: admin@lbpremium.com')
  console.log('🔑 Contraseña: admin123')
}

main()
  .catch((e) => {
    console.error('Error inicializando la base de datos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
