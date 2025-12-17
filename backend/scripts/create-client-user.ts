import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creando usuario de clientes...')

  // Crear usuario con rol restringido
  const hashedPassword = await bcrypt.hash('u1u2u3u4u5', 12)
  
  const clientUser = await prisma.user.upsert({
    where: { email: 'clientes@elebe.agency' },
    update: {
      password: hashedPassword,
      role: 'clientes',
    },
    create: {
      email: 'clientes@elebe.agency',
      name: 'Usuario Clientes',
      password: hashedPassword,
      role: 'clientes',
    },
  })

  console.log('✅ Usuario creado exitosamente:')
  console.log('📧 Email:', clientUser.email)
  console.log('🔑 Contraseña: u1u2u3u4u5')
  console.log('👤 Rol:', clientUser.role)
}

main()
  .catch((e) => {
    console.error('Error creando usuario:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
