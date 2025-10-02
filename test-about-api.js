const axios = require('axios');

async function testAboutAPI() {
  console.log('🔍 Probando API de About...');
  
  try {
    const response = await axios.get('http://localhost:3001/api/about');
    console.log('✅ API de About accesible - Status:', response.status);
    
    const data = response.data;
    console.log('📊 Datos de About:', JSON.stringify(data, null, 2));
    
    if (data) {
      console.log('📋 Propiedades disponibles:');
      Object.keys(data).forEach(key => {
        console.log(`  - ${key}: ${typeof data[key]}`, data[key]);
      });
      
      if (data.images) {
        console.log(`📸 Imágenes: ${data.images.length} encontradas`);
        data.images.forEach((img, index) => {
          console.log(`  ${index + 1}. ${img}`);
        });
      } else {
        console.log('⚠️  No hay imágenes en los datos');
      }
    } else {
      console.log('⚠️  No hay datos de About');
    }
    
  } catch (error) {
    console.log('❌ Error accediendo a la API de About:', error.message);
    if (error.response) {
      console.log('📋 Status:', error.response.status);
      console.log('📋 Data:', error.response.data);
    }
  }
}

testAboutAPI();
