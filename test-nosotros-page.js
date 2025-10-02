const axios = require('axios');

async function testNosotrosPage() {
  console.log('🔍 Probando página de Nosotros...');
  
  try {
    const response = await axios.get('http://localhost:3000/nosotros');
    console.log('✅ Página de Nosotros accesible - Status:', response.status);
    
    const html = response.data;
    
    // Verificar si hay errores en el HTML
    const hasErrors = html.includes('TypeError') || html.includes('Cannot read properties');
    const hasAboutContent = html.includes('Sobre Nosotros') || html.includes('Fashion Style');
    const hasImages = html.includes('getImageUrl') || html.includes('src=');
    
    console.log('📋 ¿Contiene errores?:', hasErrors);
    console.log('📋 ¿Contiene contenido de About?:', hasAboutContent);
    console.log('📋 ¿Contiene imágenes?:', hasImages);
    
    if (hasErrors) {
      console.log('❌ Se detectaron errores en la página');
    } else {
      console.log('✅ La página parece estar funcionando correctamente');
    }
    
    // Buscar el contenido específico
    if (html.includes('Nuestra Historia')) {
      console.log('✅ Sección "Nuestra Historia" encontrada');
    }
    
    if (html.includes('Nuestros Valores')) {
      console.log('✅ Sección "Nuestros Valores" encontrada');
    }
    
    if (html.includes('Nuestro Equipo')) {
      console.log('✅ Sección "Nuestro Equipo" encontrada');
    }
    
  } catch (error) {
    console.log('❌ Error accediendo a la página de Nosotros:', error.message);
    if (error.response) {
      console.log('📋 Status:', error.response.status);
    }
  }
}

testNosotrosPage();
