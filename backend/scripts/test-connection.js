const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Gojira2019!',
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('✅ CONEXIÓN EXITOSA con PostgreSQL!');
    
    // Verificar información del usuario
    const userResult = await client.query('SELECT current_user, current_database()');
    console.log(`   Usuario actual: ${userResult.rows[0].current_user}`);
    console.log(`   Base de datos: ${userResult.rows[0].current_database}`);
    
    // Verificar si podemos crear bases de datos
    const versionResult = await client.query('SELECT version()');
    console.log(`   Versión: ${versionResult.rows[0].version.split(' ')[0]} ${versionResult.rows[0].version.split(' ')[1]}`);
    
    await client.end();
    return true;
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    await client.end();
    return false;
  }
}

async function createDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Gojira2019!',
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('\n🚀 Creando base de datos...');
    
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

    console.log('\n📝 Actualiza tu archivo .env con:');
    console.log('DATABASE_URL="postgresql://postgres:Gojira2019!@localhost:5432/lb_premium"');

  } catch (error) {
    console.error('❌ Error creando la base de datos:', error.message);
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('🔐 Probando conexión con PostgreSQL...\n');
  
  const connected = await testConnection();
  
  if (connected) {
    await createDatabase();
  }
}

main();
