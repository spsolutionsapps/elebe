import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creando usuario administrador...')

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash('u1u2u3u4u5', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'elebe.merch@gmail.com' },
    update: {
      password: hashedPassword,
      name: 'Administrador Elebe',
      role: 'admin',
    },
    create: {
      email: 'elebe.merch@gmail.com',
      name: 'Administrador Elebe',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✅ Usuario administrador creado exitosamente:')
  console.log('📧 Email:', adminUser.email)
  console.log('👤 Rol:', adminUser.role)
  console.log('🆔 ID:', adminUser.id)
}

main()
  .catch((e) => {
    console.error('❌ Error creando usuario administrador:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })