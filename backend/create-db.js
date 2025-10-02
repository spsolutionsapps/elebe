const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    user: 'postgres',
    password: 'Gojira2019!',
    host: 'localhost',
    port: 5432,
    database: 'postgres' // Conectamos a la base de datos por defecto
  });

  try {
    await client.connect();
    console.log('Conectado a PostgreSQL');
    
    // Verificar si la base de datos ya existe
    const result = await client.query("SELECT 1 FROM pg_database WHERE datname = 'lb_premium'");
    
    if (result.rows.length === 0) {
      await client.query('CREATE DATABASE lb_premium');
      console.log('Base de datos lb_premium creada exitosamente');
    } else {
      console.log('La base de datos lb_premium ya existe');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createDatabase();
