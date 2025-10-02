const axios = require('axios');

async function testFinalImage() {
  console.log('🔍 Probando la imagen final...');
  
  // Simular exactamente lo que debería hacer el frontend
  function getBackendImageUrl() {
    // En Docker, NODE_ENV es 'production'
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  }
  
  function getImageUrl(imagePath) {
    if (!imagePath) return '';
    
    if (imagePath.startsWith('/uploads/')) {
      return `${getBackendImageUrl()}${imagePath}`;
    }
    
    return `${getBackendImageUrl()}/uploads/${imagePath}`;
  }
  
  const serviceImage = '/uploads/image-1757696362314-555109757.webp';
  const finalUrl = getImageUrl(serviceImage);
  
  console.log('📍 URL final generada:', finalUrl);
  
  try {
    const response = await axios.head(finalUrl);
    console.log('✅ Imagen accesible - Status:', response.status);
    console.log('📋 Content-Type:', response.headers['content-type']);
  } catch (error) {
    console.log('❌ Error accediendo a la imagen:', error.message);
  }
  
  // También probar la página de servicios para ver si ahora muestra la imagen
  console.log('\n🔍 Verificando página de servicios...');
  try {
    const response = await axios.get('http://localhost:3000/servicios');
    const html = response.data;
    
    const hasImage = html.includes('image-1757696362314-555109757.webp');
    const hasGetImageUrl = html.includes('getImageUrl');
    
    console.log('📋 ¿Contiene la imagen específica?:', hasImage);
    console.log('📋 ¿Contiene getImageUrl?:', hasGetImageUrl);
    
    if (hasImage) {
      console.log('✅ ¡La imagen debería estar visible!');
    } else {
      console.log('⚠️  La imagen aún no aparece en el HTML');
    }
    
  } catch (error) {
    console.log('❌ Error accediendo a la página:', error.message);
  }
}

testFinalImage();
