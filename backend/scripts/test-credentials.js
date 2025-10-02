const { Client } = require('pg');

const credentials = [
  { user: 'postgres', password: 'password' },
  { user: 'postgres', password: 'postgres' },
  { user: 'postgres', password: 'admin' },
  { user: 'postgres', password: '123456' },
  { user: 'postgres', password: '' },
  { user: 'admin', password: 'admin' },
  { user: 'root', password: 'root' }
];

async function testCredentials() {
  console.log('🔐 Probando credenciales de PostgreSQL...\n');

  for (const cred of credentials) {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: cred.user,
      password: cred.password,
      database: 'postgres'
    });

    try {
      await client.connect();
      console.log(`✅ CONEXIÓN EXITOSA con: ${cred.user}:${cred.password}`);
      
      // Verificar si podemos crear bases de datos
      const result = await client.query('SELECT current_user, current_database()');
      console.log(`   Usuario actual: ${result.rows[0].current_user}`);
      console.log(`   Base de datos: ${result.rows[0].current_database}`);
      
      await client.end();
      return { user: cred.user, password: cred.password };
      
    } catch (error) {
      console.log(`❌ Falló: ${cred.user}:${cred.password} - ${error.message}`);
      await client.end();
    }
  }
  
  console.log('\n❌ No se pudo conectar con ninguna credencial');
  return null;
}

async function main() {
  const workingCreds = await testCredentials();
  
  if (workingCreds) {
    console.log('\n🎉 ¡CREDENCIALES ENCONTRADAS!');
    console.log(`Usuario: ${workingCreds.user}`);
    console.log(`Contraseña: ${workingCreds.password}`);
    
    console.log('\n📝 Actualiza tu archivo .env con:');
    console.log(`DATABASE_URL="postgresql://${workingCreds.user}:${workingCreds.password}@localhost:5432/lb_premium"`);
    
    // Intentar crear la base de datos
    console.log('\n🚀 Intentando crear la base de datos...');
    await createDatabase(workingCreds);
  }
}

async function createDatabase(creds) {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: creds.user,
    password: creds.password,
    database: 'postgres'
  });

  try {
    await client.connect();
    
    // Verificar si la base de datos ya existe
    const checkResult = await client.query(`
      SELECT 1 FROM pg_database WHERE datname = 'lb_premium'
    `);

    if (checkResult.rows.length === 0) {
      await client.query('CREATE DATABASE lb_premium');
      console.log('✅ Base de datos "lb_premium" creada exitosamente');
    } else {
      console.log('ℹ️ La base de datos "lb_premium" ya existe');
    }

  } catch (error) {
    console.error('❌ Error creando la base de datos:', error.message);
  } finally {
    await client.end();
  }
}

main();
