const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';
const FRONTEND_URL = 'http://localhost:3000';

class TestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      errors: []
    };
  }

  async runTest(testName, testFunction) {
    this.results.total++;
    console.log(`\n🧪 Ejecutando: ${testName}`);
    
    try {
      await testFunction();
      this.results.passed++;
      console.log(`✅ ${testName} - PASÓ`);
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({ test: testName, error: error.message });
      console.log(`❌ ${testName} - FALLÓ: ${error.message}`);
    }
  }

  async testApiHealth() {
    const response = await axios.get(`${API_BASE_URL}/health`);
    if (response.status !== 200) {
      throw new Error(`Health check failed with status ${response.status}`);
    }
  }

  async testAuthEndpoints() {
    // Test login endpoint
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@fashionstyle.com',
      password: 'admin123'
    });

    if (!loginResponse.data.access_token) {
      throw new Error('Login did not return access token');
    }

    const token = loginResponse.data.access_token;

    // Test profile endpoint
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (profileResponse.data.email !== 'admin@fashionstyle.com') {
      throw new Error('Profile endpoint returned incorrect user data');
    }

    return token;
  }

  async testTasksEndpoints(token) {
    // Test create task
    const createResponse = await axios.post(`${API_BASE_URL}/tasks`, {
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo',
      priority: 'medium'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!createResponse.data.id) {
      throw new Error('Task creation did not return task ID');
    }

    const taskId = createResponse.data.id;

    // Test get all tasks
    const getAllResponse = await axios.get(`${API_BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!Array.isArray(getAllResponse.data)) {
      throw new Error('Get all tasks did not return an array');
    }

    // Test update task
    await axios.patch(`${API_BASE_URL}/tasks/${taskId}`, {
      status: 'in-progress'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Test delete task
    await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async testProductsEndpoints(token) {
    // Test get all products
    const response = await axios.get(`${API_BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Get all products did not return an array');
    }
  }

  async testClientsEndpoints(token) {
    // Test get all clients
    const response = await axios.get(`${API_BASE_URL}/clients`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Get all clients did not return an array');
    }
  }

  async testInquiriesEndpoints(token) {
    // Test get all inquiries
    const response = await axios.get(`${API_BASE_URL}/inquiries`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Get all inquiries did not return an array');
    }
  }

  async testServicesEndpoints(token) {
    // Test get all services
    const response = await axios.get(`${API_BASE_URL}/services`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Get all services did not return an array');
    }
  }

  async testSlidesEndpoints(token) {
    // Test get all slides
    const response = await axios.get(`${API_BASE_URL}/slides`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Get all slides did not return an array');
    }
  }

  async testRemindersEndpoints(token) {
    // Test get all reminders
    const response = await axios.get(`${API_BASE_URL}/reminders`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!Array.isArray(response.data)) {
      throw new Error('Get all reminders did not return an array');
    }
  }

  async testFrontendAccessibility() {
    // Test if frontend is accessible
    const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
    
    if (response.status !== 200) {
      throw new Error(`Frontend not accessible with status ${response.status}`);
    }
  }

  async testSwaggerDocumentation() {
    // Test if Swagger documentation is accessible
    const response = await axios.get(`${API_BASE_URL}/docs`);
    
    if (response.status !== 200) {
      throw new Error(`Swagger docs not accessible with status ${response.status}`);
    }
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE PRUEBAS');
    console.log('='.repeat(50));
    console.log(`Total de pruebas: ${this.results.total}`);
    console.log(`✅ Pasaron: ${this.results.passed}`);
    console.log(`❌ Fallaron: ${this.results.failed}`);
    console.log(`📈 Tasa de éxito: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);

    if (this.results.errors.length > 0) {
      console.log('\n🚨 ERRORES DETALLADOS:');
      this.results.errors.forEach(error => {
        console.log(`  • ${error.test}: ${error.error}`);
      });
    }

    console.log('\n' + '='.repeat(50));
  }

  async runAllTests() {
    console.log('🚀 Iniciando suite de pruebas completa para LB Premium CRM');
    console.log('='.repeat(60));

    let authToken = null;

    await this.runTest('Verificar salud de la API', () => this.testApiHealth());
    await this.runTest('Probar endpoints de autenticación', async () => {
      authToken = await this.testAuthEndpoints();
    });
    await this.runTest('Probar endpoints de tareas', () => this.testTasksEndpoints(authToken));
    await this.runTest('Probar endpoints de productos', () => this.testProductsEndpoints(authToken));
    await this.runTest('Probar endpoints de clientes', () => this.testClientsEndpoints(authToken));
    await this.runTest('Probar endpoints de consultas', () => this.testInquiriesEndpoints(authToken));
    await this.runTest('Probar endpoints de servicios', () => this.testServicesEndpoints(authToken));
    await this.runTest('Probar endpoints de slides', () => this.testSlidesEndpoints(authToken));
    await this.runTest('Probar endpoints de recordatorios', () => this.testRemindersEndpoints(authToken));
    await this.runTest('Verificar accesibilidad del frontend', () => this.testFrontendAccessibility());
    await this.runTest('Verificar documentación Swagger', () => this.testSwaggerDocumentation());

    this.printResults();
  }
}

// Ejecutar las pruebas
const testSuite = new TestSuite();
testSuite.runAllTests().catch(console.error);
