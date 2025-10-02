const axios = require('axios');

async function checkServicesData() {
  console.log('🔍 Verificando datos de servicios...');
  
  try {
    // Obtener servicios desde la API
    const response = await axios.get('http://localhost:3001/api/services');
    console.log('✅ API de servicios accesible - Status:', response.status);
    
    const services = response.data;
    console.log(`📊 Total de servicios: ${services.length}`);
    
    if (services.length > 0) {
      console.log('\n📋 Detalles de servicios:');
      services.forEach((service, index) => {
        console.log(`  ${index + 1}. ID: ${service.id}`);
        console.log(`     Nombre: ${service.name}`);
        console.log(`     Imagen: ${service.image || 'Sin imagen'}`);
        console.log(`     Descripción: ${service.description?.substring(0, 50)}...`);
        console.log('');
      });
    } else {
      console.log('⚠️  No hay servicios en la base de datos');
    }
    
  } catch (error) {
    console.log('❌ Error accediendo a la API de servicios:', error.message);
    if (error.response) {
      console.log('📋 Status:', error.response.status);
      console.log('📋 Data:', error.response.data);
    }
  }
}

checkServicesData();
