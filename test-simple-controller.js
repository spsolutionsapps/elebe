const axios = require('axios');

async function testSimpleController() {
  const API_BASE_URL = 'http://localhost:3001/api';
  
  console.log('🧪 Probando controlador simple...\n');

  try {
    // 1. Probar GET
    console.log('1. Probando GET /services-simple...');
    try {
      const getResponse = await axios.get(`${API_BASE_URL}/services-simple`);
      console.log('✅ GET funciona:', getResponse.data);
    } catch (error) {
      console.log('❌ GET falló:', error.response?.status, error.response?.data);
    }

    // 2. Probar POST
    console.log('\n2. Probando POST /services-simple...');
    try {
      const postResponse = await axios.post(`${API_BASE_URL}/services-simple`, {
        name: 'Test',
        description: 'Test Description'
      });
      console.log('✅ POST funciona:', postResponse.data);
    } catch (error) {
      console.log('❌ POST falló:', error.response?.status, error.response?.data);
    }

    // 3. Comparar con el controlador original
    console.log('\n3. Comparando con controlador original...');
    try {
      const originalGetResponse = await axios.get(`${API_BASE_URL}/services`);
      console.log('✅ GET /services funciona:', originalGetResponse.data.length, 'servicios');
    } catch (error) {
      console.log('❌ GET /services falló:', error.response?.status);
    }

    try {
      const originalPostResponse = await axios.post(`${API_BASE_URL}/services`, {
        name: 'Test',
        description: 'Test Description'
      });
      console.log('✅ POST /services funciona:', originalPostResponse.data);
    } catch (error) {
      console.log('❌ POST /services falló:', error.response?.status, error.response?.data?.message);
    }

  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

testSimpleController();
