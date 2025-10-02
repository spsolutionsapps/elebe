const { Client } = require('pg');

const passwords = [
  'postgres',
  'password',
  'admin',
  'admin123',
  '123456',
  'root',
  'postgres123',
  'password123',
  'admin1234',
  '1234',
  'postgresql',
  'dbpassword',
  'secret',
  'test',
  'demo'
];

async function testConnection(password) {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: password,
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log(`✅ Contraseña correcta: ${password}`);
    await client.end();
    return password;
  } catch (error) {
    console.log(`❌ Contraseña incorrecta: ${password}`);
    return null;
  }
}

async function main() {
  console.log('🔍 Probando contraseñas de PostgreSQL...');
  
  for (const password of passwords) {
    const result = await testConnection(password);
    if (result) {
      console.log(`\n🎉 ¡Contraseña encontrada! Usa esta en tu .env:`);
      console.log(`DATABASE_URL="postgresql://postgres:${password}@localhost:5432/lb_premium"`);
      return;
    }
  }
  
  console.log('\n❌ No se encontró ninguna contraseña común.');
  console.log('💡 Intenta con la contraseña que configuraste durante la instalación de PostgreSQL.');
}

main().catch(console.error);
