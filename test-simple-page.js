const axios = require('axios');

async function testSimplePage() {
  console.log('🔍 Probando página simple...');
  
  try {
    // Probar la página principal primero
    console.log('1. Probando página principal...');
    const homeResponse = await axios.get('http://localhost:3000');
    console.log('✅ Página principal - Status:', homeResponse.status);
    
    // Probar la página de servicios
    console.log('2. Probando página de servicios...');
    const servicesResponse = await axios.get('http://localhost:3000/servicios');
    console.log('✅ Página de servicios - Status:', servicesResponse.status);
    
    const html = servicesResponse.data;
    
    // Buscar cualquier referencia a servicios
    const hasServices = html.includes('servicios') || html.includes('Services');
    const hasLoading = html.includes('loading') || html.includes('Loading');
    const hasError = html.includes('error') || html.includes('Error');
    
    console.log('📋 ¿Contiene "servicios"?:', hasServices);
    console.log('📋 ¿Contiene "loading"?:', hasLoading);
    console.log('📋 ¿Contiene "error"?:', hasError);
    
    // Mostrar un fragmento del HTML
    console.log('\n📄 Fragmento del HTML (primeras 10 líneas):');
    const lines = html.split('\n');
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      console.log(`  ${i}: ${lines[i].trim()}`);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('📋 Status:', error.response.status);
    }
  }
}

testSimplePage();
