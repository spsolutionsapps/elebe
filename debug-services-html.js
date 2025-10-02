const axios = require('axios');

async function debugServicesHTML() {
  console.log('🔍 Analizando HTML de servicios en detalle...');
  
  try {
    const response = await axios.get('http://localhost:3000/servicios');
    console.log('✅ Página accesible - Status:', response.status);
    
    const html = response.data;
    
    // Buscar diferentes patrones de imagen
    const patterns = [
      /src="[^"]*image-[^"]*"/g,
      /src="[^"]*uploads[^"]*"/g,
      /src="[^"]*http[^"]*"/g,
      /getImageUrl/g,
      /service\.image/g
    ];
    
    console.log('\n🔍 Buscando patrones en el HTML:');
    patterns.forEach((pattern, index) => {
      const matches = html.match(pattern);
      console.log(`  ${index + 1}. ${pattern}: ${matches ? matches.length : 0} coincidencias`);
      if (matches) {
        matches.forEach(match => console.log(`     - ${match}`));
      }
    });
    
    // Buscar el contenido del servicio específico
    console.log('\n🔍 Buscando contenido del servicio:');
    const serviceMatches = html.match(/a.*?a/g);
    if (serviceMatches) {
      console.log(`  Encontrados ${serviceMatches.length} servicios con nombre "a"`);
    }
    
    // Buscar cualquier referencia a la imagen específica
    const specificImage = html.includes('image-1757696362314-555109757.webp');
    console.log(`\n🖼️  ¿Contiene la imagen específica?: ${specificImage}`);
    
    // Mostrar una parte del HTML para inspección
    console.log('\n📄 Fragmento del HTML (líneas 80-90):');
    const lines = html.split('\n');
    for (let i = 80; i < Math.min(90, lines.length); i++) {
      if (lines[i].includes('img') || lines[i].includes('service')) {
        console.log(`  ${i}: ${lines[i].trim()}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugServicesHTML();
