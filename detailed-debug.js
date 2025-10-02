const axios = require('axios');

async function detailedDebug() {
  const API_BASE_URL = 'http://localhost:3001/api';
  
  console.log('🔍 Debug detallado del endpoint de servicios...\n');

  try {
    // 1. Verificar que el servidor responde
    console.log('1. Verificando respuesta del servidor...');
    const healthResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/`, { timeout: 5000 });
    console.log('✅ Servidor responde');

    // 2. Verificar Swagger
    console.log('\n2. Verificando Swagger...');
    try {
      const swaggerResponse = await axios.get(`${API_BASE_URL.replace('/api', '')}/api/docs`);
      console.log('✅ Swagger accesible');
    } catch (error) {
      console.log('❌ Swagger no accesible:', error.response?.status);
    }

    // 3. Probar GET /services
    console.log('\n3. Probando GET /services...');
    const getResponse = await axios.get(`${API_BASE_URL}/services`);
    console.log('✅ GET /services funciona - Status:', getResponse.status);
    console.log('   Datos:', getResponse.data);

    // 4. Probar OPTIONS /services (para CORS)
    console.log('\n4. Probando OPTIONS /services...');
    try {
      const optionsResponse = await axios.options(`${API_BASE_URL}/services`);
      console.log('✅ OPTIONS /services - Status:', optionsResponse.status);
    } catch (error) {
      console.log('❌ OPTIONS /services - Status:', error.response?.status);
    }

    // 5. Probar POST con diferentes formatos
    console.log('\n5. Probando POST /services con diferentes formatos...');
    
    const testData = {
      name: 'Servicio de Prueba',
      description: 'Descripción del servicio de prueba'
    };

    try {
      const postResponse = await axios.post(`${API_BASE_URL}/services`, testData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('✅ POST /services funciona - Status:', postResponse.status);
      console.log('   Servicio creado:', postResponse.data);
      
      // Limpiar
      if (postResponse.data.id) {
        await axios.delete(`${API_BASE_URL}/services/${postResponse.data.id}`);
        console.log('   Servicio eliminado');
      }
    } catch (error) {
      console.log('❌ POST /services falló');
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data);
      console.log('   Headers:', error.response?.headers);
    }

    // 6. Verificar otros endpoints POST que funcionan
    console.log('\n6. Verificando otros endpoints POST...');
    
    // Probar auth/login
    try {
      const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'admin@fashionstyle.com',
        password: 'admin123'
      });
      console.log('✅ POST /auth/login funciona - Status:', authResponse.status);
    } catch (error) {
      console.log('❌ POST /auth/login - Status:', error.response?.status);
    }

    // 7. Verificar rutas disponibles
    console.log('\n7. Verificando rutas disponibles...');
    const routes = ['/services', '/auth', '/products', '/tasks'];
    
    for (const route of routes) {
      try {
        const response = await axios.get(`${API_BASE_URL}${route}`);
        console.log(`✅ ${route} - Status: ${response.status}`);
      } catch (error) {
        console.log(`❌ ${route} - Status: ${error.response?.status}`);
      }
    }

  } catch (error) {
    console.log('❌ Error general:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

detailedDebug();
