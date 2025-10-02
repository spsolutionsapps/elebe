const axios = require('axios');

async function debugController() {
  const API_BASE_URL = 'http://localhost:3001/api';
  
  console.log('🔍 Debugging ServicesController...\n');

  try {
    // 1. Verificar todas las rutas disponibles
    console.log('1. Probando todas las rutas del controlador...');
    
    const routes = [
      { method: 'GET', path: '/services' },
      { method: 'POST', path: '/services' },
      { method: 'PUT', path: '/services/test-id' },
      { method: 'DELETE', path: '/services/test-id' },
    ];

    for (const route of routes) {
      try {
        let response;
        if (route.method === 'GET') {
          response = await axios.get(`${API_BASE_URL}${route.path}`);
        } else if (route.method === 'POST') {
          response = await axios.post(`${API_BASE_URL}${route.path}`, {
            name: 'Test',
            description: 'Test'
          });
        } else {
          // PUT y DELETE probablemente fallarán por ID inexistente, pero nos dirá si la ruta existe
          response = await axios[route.method.toLowerCase()](`${API_BASE_URL}${route.path}`, {
            name: 'Test',
            description: 'Test'
          });
        }
        console.log(`✅ ${route.method} ${route.path} - Status: ${response.status}`);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`❌ ${route.method} ${route.path} - Ruta no encontrada (404)`);
        } else if (error.response?.status === 400) {
          console.log(`⚠️  ${route.method} ${route.path} - Ruta existe pero error de validación (400)`);
        } else {
          console.log(`❌ ${route.method} ${route.path} - Error: ${error.response?.status || error.message}`);
        }
      }
    }

    // 2. Verificar si hay otros controladores funcionando
    console.log('\n2. Verificando otros controladores...');
    const otherEndpoints = ['/auth/login', '/products', '/tasks'];
    
    for (const endpoint of otherEndpoints) {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        console.log(`✅ ${endpoint} - Status: ${response.status}`);
      } catch (error) {
        console.log(`❌ ${endpoint} - Status: ${error.response?.status || 'No response'}`);
      }
    }

    // 3. Probar con diferentes métodos HTTP
    console.log('\n3. Probando métodos HTTP en /services...');
    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    
    for (const method of methods) {
      try {
        const response = await axios({
          method: method.toLowerCase(),
          url: `${API_BASE_URL}/services`,
          data: method === 'POST' || method === 'PUT' || method === 'PATCH' ? {
            name: 'Test',
            description: 'Test'
          } : undefined
        });
        console.log(`✅ ${method} /services - Status: ${response.status}`);
      } catch (error) {
        console.log(`❌ ${method} /services - Status: ${error.response?.status || 'No response'}`);
      }
    }

  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

debugController();
