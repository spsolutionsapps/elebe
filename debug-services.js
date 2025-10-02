const axios = require('axios');

async function debugServicesEndpoint() {
  const API_BASE_URL = 'http://localhost:3001/api';
  
  console.log('🔍 Diagnóstico del endpoint de servicios...\n');

  try {
    // 1. Verificar si el backend está corriendo
    console.log('1. Verificando si el backend está corriendo...');
    try {
      const healthResponse = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
      console.log('✅ Backend está corriendo');
    } catch (error) {
      console.log('❌ Backend no está corriendo o no responde');
      console.log('   Error:', error.message);
      return;
    }

    // 2. Verificar endpoint GET de servicios
    console.log('\n2. Verificando endpoint GET /services...');
    try {
      const getResponse = await axios.get(`${API_BASE_URL}/services`);
      console.log('✅ GET /services funciona');
      console.log('   Respuesta:', getResponse.status, getResponse.data.length, 'servicios');
    } catch (error) {
      console.log('❌ GET /services falló');
      console.log('   Error:', error.response?.status, error.response?.data || error.message);
    }

    // 3. Probar endpoint POST de servicios
    console.log('\n3. Probando endpoint POST /services...');
    try {
      const postResponse = await axios.post(`${API_BASE_URL}/services`, {
        name: 'Test Service',
        description: 'Servicio de prueba',
        image: null
      });
      console.log('✅ POST /services funciona');
      console.log('   Servicio creado:', postResponse.data.id);
      
      // Limpiar el servicio de prueba
      await axios.delete(`${API_BASE_URL}/services/${postResponse.data.id}`);
      console.log('   Servicio de prueba eliminado');
      
    } catch (error) {
      console.log('❌ POST /services falló');
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        console.log('\n🔧 Posibles soluciones:');
        console.log('   1. Verificar que el backend esté corriendo: npm run start:dev');
        console.log('   2. Verificar que la base de datos esté conectada');
        console.log('   3. Verificar que las migraciones estén aplicadas');
        console.log('   4. Reiniciar el servidor backend');
      }
    }

    // 4. Verificar otros endpoints
    console.log('\n4. Verificando otros endpoints...');
    const endpoints = ['/auth/login', '/products', '/tasks'];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, { timeout: 3000 });
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
      } catch (error) {
        console.log(`❌ ${endpoint} - Status: ${error.response?.status || 'No response'}`);
      }
    }

  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

debugServicesEndpoint();
