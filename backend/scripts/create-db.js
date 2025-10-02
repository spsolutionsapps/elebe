const { Client } = require('pg');

async function createDatabase() {
  // Conectar a PostgreSQL sin especificar base de datos
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'postgres' // Base de datos por defecto
  });

  try {
    await client.connect();
    console.log('Conectado a PostgreSQL');

    // Crear la base de datos si no existe
    const result = await client.query(`
      SELECT 1 FROM pg_database WHERE datname = 'lb_premium'
    `);

    if (result.rows.length === 0) {
      await client.query('CREATE DATABASE lb_premium');
      console.log('Base de datos "lb_premium" creada exitosamente');
    } else {
      console.log('La base de datos "lb_premium" ya existe');
    }

  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n🔐 PROBLEMA DE AUTENTICACIÓN:');
      console.log('El usuario "postgres" con contraseña "password" no es válido.');
      console.log('\n💡 SOLUCIONES:');
      console.log('1. Cambiar la contraseña de postgres a "password"');
      console.log('2. O actualizar el archivo .env con las credenciales correctas');
      console.log('\n📝 COMANDO PARA CAMBIAR CONTRASEÑA (ejecutar como administrador):');
      console.log('psql -U postgres -c "ALTER USER postgres PASSWORD \'password\';"');
    }
  } finally {
    await client.end();
  }
}

createDatabase();
