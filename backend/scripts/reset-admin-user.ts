import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Reseteando usuario administrador...')

  // Credenciales por defecto
  const adminEmail = 'elebe.merch@gmail.com'
  const adminPassword = 'u1u2u3u4u5'
  const adminName = 'Administrador Elebe'

  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    // Buscar usuario existente por email
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingUser) {
      // Actualizar usuario existente
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          password: hashedPassword,
          name: adminName,
          role: 'admin',
        }
      })
      console.log('✅ Usuario administrador actualizado:')
      console.log('📧 Email:', updatedUser.email)
      console.log('👤 Rol:', updatedUser.role)
      console.log('🆔 ID:', updatedUser.id)
    } else {
      // Crear nuevo usuario
      const newUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          role: 'admin',
        }
      })
      console.log('✅ Usuario administrador creado:')
      console.log('📧 Email:', newUser.email)
      console.log('👤 Rol:', newUser.role)
      console.log('🆔 ID:', newUser.id)
    }

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })