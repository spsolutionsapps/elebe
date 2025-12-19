import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creando usuario administrador...')

  // Obtener credenciales desde variables de entorno
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@elebe.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123'
  const adminName = process.env.ADMIN_NAME || 'Administrador'

  console.log(`📧 Usando email: ${adminEmail}`)

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: adminName,
      role: 'admin',
    },
    create: {
      email: adminEmail,
      name: adminName,
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