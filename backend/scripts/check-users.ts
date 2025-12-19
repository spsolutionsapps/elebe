import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando usuarios en la base de datos...')

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      createdAt: true,
    },
  })

  if (users.length === 0) {
    console.log('❌ No hay usuarios en la base de datos')
    console.log('💡 Puedes usar el endpoint /auth/dev-login para acceso temporal')
  } else {
    console.log(`✅ Encontrados ${users.length} usuarios:`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`)
      console.log(`   Nombre: ${user.name || 'Sin nombre'}`)
      console.log(`   Rol: ${user.role}`)
      console.log(`   Tiene contraseña: ${user.password ? 'Sí' : 'No'}`)
      console.log(`   Creado: ${user.createdAt}`)
      console.log('---')
    })
  }
}

main()
  .catch((e) => {
    console.error('Error verificando usuarios:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })