const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const testClients = [
  {
    name: 'Juan Pérez García',
    email: 'juan.perez@email.com',
    phone: '+34 600 123 456',
    address: 'Calle Mayor 123',
    city: 'Madrid',
    country: 'España',
    notes: 'Cliente preferencial, interesado en servicios premium'
  },
  {
    name: 'María López Rodríguez',
    email: 'maria.lopez@email.com',
    phone: '+34 611 234 567',
    address: 'Avenida de la Paz 45',
    city: 'Barcelona',
    country: 'España',
    notes: 'Nueva cliente, primera consulta'
  },
  {
    name: 'Carlos Martínez Sánchez',
    email: 'carlos.martinez@email.com',
    phone: '+34 622 345 678',
    address: 'Plaza España 78',
    city: 'Valencia',
    country: 'España',
    notes: 'Cliente corporativo'
  },
  {
    name: 'Ana García Fernández',
    email: 'ana.garcia@email.com',
    phone: '+34 633 456 789',
    address: 'Calle Gran Vía 12',
    city: 'Sevilla',
    country: 'España',
    notes: 'Interesada en servicios de consultoría'
  },
  {
    name: 'David Ruiz Moreno',
    email: 'david.ruiz@email.com',
    phone: '+34 644 567 890',
    address: 'Paseo de la Castellana 200',
    city: 'Madrid',
    country: 'España',
    notes: 'Cliente VIP, contacto directo'
  },
  {
    name: 'Laura Jiménez Torres',
    email: 'laura.jimenez@email.com',
    phone: '+34 655 678 901',
    address: 'Rambla de Cataluña 34',
    city: 'Barcelona',
    country: 'España',
    notes: 'Empresa familiar, presupuesto aprobado'
  },
  {
    name: 'Miguel Ángel Herrera',
    email: 'miguel.herrera@email.com',
    phone: '+34 666 789 012',
    address: 'Calle Colón 56',
    city: 'Valencia',
    country: 'España',
    notes: 'Proyecto en desarrollo'
  },
  {
    name: 'Isabel Morales Castro',
    email: 'isabel.morales@email.com',
    phone: '+34 677 890 123',
    address: 'Avenida de Andalucía 89',
    city: 'Málaga',
    country: 'España',
    notes: 'Nueva oportunidad de negocio'
  },
  {
    name: 'Roberto Silva Vega',
    email: 'roberto.silva@email.com',
    phone: '+34 688 901 234',
    address: 'Calle Real 23',
    city: 'Bilbao',
    country: 'España',
    notes: 'Cliente internacional'
  },
  {
    name: 'Carmen Delgado Ramos',
    email: 'carmen.delgado@email.com',
    phone: '+34 699 012 345',
    address: 'Plaza Mayor 67',
    city: 'Salamanca',
    country: 'España',
    notes: 'Referido por otro cliente'
  },
  {
    name: 'Francisco Javier Ortega',
    email: 'francisco.ortega@email.com',
    phone: '+34 610 123 456',
    address: 'Calle Nueva 45',
    city: 'Zaragoza',
    country: 'España',
    notes: 'Cliente potencial, seguimiento pendiente'
  },
  {
    name: 'Patricia Vega Martín',
    email: 'patricia.vega@email.com',
    phone: '+34 621 234 567',
    address: 'Avenida Libertad 78',
    city: 'Murcia',
    country: 'España',
    notes: 'Interesada en servicios completos'
  },
  {
    name: 'Antonio Romero Díaz',
    email: 'antonio.romero@email.com',
    phone: '+34 632 345 678',
    address: 'Calle San Juan 12',
    city: 'Palma',
    country: 'España',
    notes: 'Cliente de larga trayectoria'
  },
  {
    name: 'Sandra Navarro Ruiz',
    email: 'sandra.navarro@email.com',
    phone: '+34 643 456 789',
    address: 'Paseo Marítimo 34',
    city: 'Las Palmas',
    country: 'España',
    notes: 'Proyecto turístico'
  },
  {
    name: 'Jorge Mendoza López',
    email: 'jorge.mendoza@email.com',
    phone: '+34 654 567 890',
    address: 'Calle del Sol 56',
    city: 'Córdoba',
    country: 'España',
    notes: 'Cliente corporativo, múltiples proyectos'
  }
]

async function addTestClients() {
  try {
    console.log('Agregando clientes de prueba...')
    
    for (const client of testClients) {
      await prisma.client.create({
        data: client
      })
      console.log(`Cliente agregado: ${client.name}`)
    }
    
    console.log(`✅ Se agregaron ${testClients.length} clientes de prueba exitosamente`)
  } catch (error) {
    console.error('Error agregando clientes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestClients()
