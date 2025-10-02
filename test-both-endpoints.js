const axios = require('axios');

async function testBothEndpoints() {
  const API_BASE_URL = 'http://localhost:3001/api';
  
  console.log('🧪 Probando endpoints de test y servicios...\n');

  try {
    // 1. Probar endpoint de test
    console.log('1. Probando GET /test...');
    try {
      const testGetResponse = await axios.get(`${API_BASE_URL}/test`);
      console.log('✅ GET /test funciona:', testGetResponse.data);
    } catch (error) {
      console.log('❌ GET /test falló:', error.response?.status, error.response?.data);
    }

    console.log('\n2. Probando POST /test...');
    try {
      const testPostResponse = await axios.post(`${API_BASE_URL}/test`, {
        message: 'Test data'
      });
      console.log('✅ POST /test funciona:', testPostResponse.data);
    } catch (error) {
      console.log('❌ POST /test falló:', error.response?.status, error.response?.data);
    }

    // 2. Probar endpoint de servicios
    console.log('\n3. Probando GET /services...');
    try {
      const servicesGetResponse = await axios.get(`${API_BASE_URL}/services`);
      console.log('✅ GET /services funciona:', servicesGetResponse.data);
    } catch (error) {
      console.log('❌ GET /services falló:', error.response?.status, error.response?.data);
    }

    console.log('\n4. Probando POST /services...');
    try {
      const servicesPostResponse = await axios.post(`${API_BASE_URL}/services`, {
        name: 'Servicio de Prueba',
        description: 'Descripción del servicio de prueba'
      });
      console.log('✅ POST /services funciona:', servicesPostResponse.data);
    } catch (error) {
      console.log('❌ POST /services falló:', error.response?.status, error.response?.data);
    }

  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

testBothEndpoints();
