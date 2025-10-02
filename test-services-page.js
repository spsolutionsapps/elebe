const axios = require('axios');

async function testServicesPage() {
  console.log('🔍 Probando página de servicios...');
  
  try {
    // Probar la página de servicios
    const response = await axios.get('http://localhost:3000/servicios');
    console.log('✅ Página de servicios accesible - Status:', response.status);
    
    // Buscar referencias a imágenes en el HTML
    const html = response.data;
    const imageMatches = html.match(/src="[^"]*image-[^"]*"/g);
    
    if (imageMatches) {
      console.log('🖼️  Imágenes encontradas en la página:');
      imageMatches.forEach((match, index) => {
        console.log(`  ${index + 1}. ${match}`);
      });
    } else {
      console.log('⚠️  No se encontraron imágenes en la página');
    }
    
  } catch (error) {
    console.log('❌ Error accediendo a la página de servicios:', error.message);
  }
}

testServicesPage();
