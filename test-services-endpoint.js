const axios = require('axios');

async function testServicesEndpoint() {
  const API_BASE_URL = 'http://localhost:3001/api';
  
  console.log('🧪 Probando endpoint de servicios...\n');

  try {
    // Probar GET primero
    console.log('1. Probando GET /services...');
    const getResponse = await axios.get(`${API_BASE_URL}/services`);
    console.log('✅ GET funciona -', getResponse.data.length, 'servicios encontrados');
    
    // Probar POST
    console.log('\n2. Probando POST /services...');
    const postData = {
      name: 'Servicio de Prueba',
      description: 'Este es un servicio de prueba creado desde el test'
    };
    
    const postResponse = await axios.post(`${API_BASE_URL}/services`, postData);
    console.log('✅ POST funciona - Servicio creado con ID:', postResponse.data.id);
    
    // Limpiar - eliminar el servicio de prueba
    console.log('\n3. Limpiando servicio de prueba...');
    await axios.delete(`${API_BASE_URL}/services/${postResponse.data.id}`);
    console.log('✅ Servicio de prueba eliminado');
    
    console.log('\n🎉 ¡El endpoint de servicios funciona correctamente!');
    
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n🔧 Posibles soluciones:');
      console.log('   1. Reiniciar el backend: npm run start:dev');
      console.log('   2. Verificar que el módulo ServicesModule esté importado');
      console.log('   3. Verificar la base de datos');
    }
  }
}

testServicesEndpoint();
