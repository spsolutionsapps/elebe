#!/usr/bin/env node

/**
 * Prueba de Estrés Avanzada para Panel de Administración
 * 
 * Versión más avanzada que incluye:
 * - Pruebas específicas de concurrencia
 * - Simulación de usuarios reales con patrones de comportamiento
 * - Monitoreo de recursos del sistema
 * - Pruebas de degradación gradual
 * - Análisis de cuellos de botella
 */

const https = require('https');
const http = require('http');
const { performance } = require('perf_hooks');
const os = require('os');

// Configuración avanzada
const CONFIG = {
  baseUrl: process.env.API_URL || 'http://localhost:3001/api',
  adminCredentials: {
    email: 'admin@fashionstyle.com',
    password: 'admin123'
  },
  
  // Escenarios de prueba más realistas
  userProfiles: {
    powerUser: {
      name: 'Usuario Avanzado',
      requestsPerMinute: 60,
      thinkTime: 1000, // tiempo entre requests
      endpoints: ['/auth/profile', '/products', '/services', '/tasks', '/inquiries']
    },
    casualUser: {
      name: 'Usuario Casual',
      requestsPerMinute: 20,
      thinkTime: 3000,
      endpoints: ['/auth/profile', '/slides', '/products']
    },
    adminUser: {
      name: 'Administrador',
      requestsPerMinute: 100,
      thinkTime: 500,
      endpoints: ['/auth/profile', '/products', '/services', '/tasks', '/inquiries', '/slides']
    }
  },
  
  // Escenarios de estrés específicos
  stressScenarios: {
    // Prueba de login masivo
    massLogin: {
      duration: 60000, // 1 minuto
      concurrentLogins: 100,
      loginInterval: 100 // ms entre logins
    },
    
    // Prueba de dashboard bajo carga
    dashboardStress: {
      duration: 120000, // 2 minutos
      concurrentUsers: 50,
      refreshInterval: 2000 // ms entre refreshes del dashboard
    },
    
    // Prueba de operaciones CRUD concurrentes
    crudConcurrency: {
      duration: 180000, // 3 minutos
      concurrentOperations: 30,
      operations: ['create', 'read', 'update', 'delete']
    },
    
    // Prueba de degradación gradual
    gradualDegradation: {
      stages: [
        { users: 10, duration: 30000 },
        { users: 25, duration: 30000 },
        { users: 50, duration: 30000 },
        { users: 100, duration: 30000 },
        { users: 200, duration: 60000 }
      ]
    },
    
    // Prueba de recuperación
    recoveryTest: {
      duration: 60000,
      spikeUsers: 150,
      normalUsers: 20,
      spikeDuration: 30000
    }
  },
  
  timeouts: {
    request: 15000,
    test: 600000 // 10 minutos máximo
  }
};

// Estadísticas avanzadas
const advancedStats = {
  systemMetrics: {
    cpuUsage: [],
    memoryUsage: [],
    networkConnections: []
  },
  performanceMetrics: {
    responseTimePercentiles: {
      p50: 0,
      p90: 0,
      p95: 0,
      p99: 0
    },
    throughput: [],
    errorRate: [],
    availability: []
  },
  businessMetrics: {
    userSatisfaction: 0,
    systemReliability: 0,
    scalabilityIndex: 0
  },
  startTime: null,
  endTime: null
};

// Utilidades avanzadas
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getSystemMetrics = () => {
  const cpus = os.cpus();
  const totalIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
  const totalTick = cpus.reduce((acc, cpu) => {
    return acc + Object.values(cpu.times).reduce((a, b) => a + b, 0);
  }, 0);
  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const cpuUsage = 100 - ~~(100 * idle / total);
  
  const memoryUsage = process.memoryUsage();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryUsagePercent = ((totalMemory - freeMemory) / totalMemory) * 100;
  
  return {
    cpu: cpuUsage,
    memory: memoryUsagePercent,
    heapUsed: memoryUsage.heapUsed,
    heapTotal: memoryUsage.heapTotal,
    timestamp: Date.now()
  };
};

const makeAdvancedRequest = async (url, options = {}) => {
  const startTime = performance.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `Stress-Test-Advanced/1.0-${requestId}`,
        'X-Request-ID': requestId,
        ...options.headers
      },
      timeout: CONFIG.timeouts.request
    }, (res) => {
      let data = '';
      let chunks = 0;
      
      res.on('data', chunk => {
        data += chunk;
        chunks++;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        resolve({
          requestId,
          statusCode: res.statusCode,
          data: data,
          responseTime: responseTime,
          headers: res.headers,
          chunks: chunks,
          size: Buffer.byteLength(data, 'utf8')
        });
      });
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      reject({
        requestId,
        error: error.message,
        responseTime: responseTime,
        timestamp: Date.now()
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      reject({
        requestId,
        error: 'Request timeout',
        responseTime: responseTime,
        timestamp: Date.now()
      });
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
};

// Simulador de usuario avanzado
class AdvancedUserSimulator {
  constructor(userId, profile, authToken) {
    this.userId = userId;
    this.profile = profile;
    this.authToken = authToken;
    this.sessionStartTime = Date.now();
    this.requests = [];
    this.errors = [];
    this.isActive = true;
  }
  
  async startSession() {
    console.log(`👤 Usuario ${this.userId} (${this.profile.name}) iniciando sesión`);
    
    while (this.isActive) {
      try {
        await this.performUserAction();
        await sleep(this.profile.thinkTime + Math.random() * 1000);
      } catch (error) {
        this.errors.push({
          timestamp: Date.now(),
          error: error.message || error.error,
          action: 'user_action'
        });
      }
    }
  }
  
  async performUserAction() {
    const endpoint = this.profile.endpoints[Math.floor(Math.random() * this.profile.endpoints.length)];
    const startTime = performance.now();
    
    try {
      const response = await makeAdvancedRequest(`${CONFIG.baseUrl}${endpoint}`, {
        headers: this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}
      });
      
      const endTime = performance.now();
      const requestData = {
        userId: this.userId,
        endpoint,
        responseTime: response.responseTime,
        statusCode: response.statusCode,
        size: response.size,
        timestamp: Date.now(),
        success: true
      };
      
      this.requests.push(requestData);
      
    } catch (error) {
      const endTime = performance.now();
      const requestData = {
        userId: this.userId,
        endpoint,
        responseTime: error.responseTime || (endTime - startTime),
        statusCode: error.statusCode || 0,
        error: error.error || error.message,
        timestamp: Date.now(),
        success: false
      };
      
      this.requests.push(requestData);
      this.errors.push(requestData);
    }
  }
  
  stopSession() {
    this.isActive = false;
  }
  
  getStats() {
    const successfulRequests = this.requests.filter(r => r.success);
    const failedRequests = this.requests.filter(r => !r.success);
    const avgResponseTime = successfulRequests.reduce((sum, r) => sum + r.responseTime, 0) / successfulRequests.length || 0;
    
    return {
      userId: this.userId,
      profile: this.profile.name,
      sessionDuration: Date.now() - this.sessionStartTime,
      totalRequests: this.requests.length,
      successfulRequests: successfulRequests.length,
      failedRequests: failedRequests.length,
      successRate: (successfulRequests.length / this.requests.length) * 100 || 0,
      avgResponseTime: avgResponseTime,
      errors: this.errors.length
    };
  }
}

// Prueba de login masivo
const runMassLoginTest = async () => {
  console.log('\n🔐 PRUEBA DE LOGIN MASIVO');
  console.log(`   Logins concurrentes: ${CONFIG.stressScenarios.massLogin.concurrentLogins}`);
  
  const loginPromises = [];
  const results = [];
  
  for (let i = 0; i < CONFIG.stressScenarios.massLogin.concurrentLogins; i++) {
    const loginPromise = (async () => {
      try {
        const startTime = performance.now();
        const response = await makeAdvancedRequest(`${CONFIG.baseUrl}/auth/login`, {
          method: 'POST',
          body: CONFIG.adminCredentials
        });
        const endTime = performance.now();
        
        results.push({
          success: true,
          responseTime: endTime - startTime,
          statusCode: response.statusCode
        });
        
      } catch (error) {
        results.push({
          success: false,
          responseTime: error.responseTime || 0,
          error: error.error || error.message
        });
      }
    })();
    
    loginPromises.push(loginPromise);
    await sleep(CONFIG.stressScenarios.massLogin.loginInterval);
  }
  
  await Promise.all(loginPromises);
  
  const successfulLogins = results.filter(r => r.success);
  const avgResponseTime = successfulLogins.reduce((sum, r) => sum + r.responseTime, 0) / successfulLogins.length || 0;
  
  console.log(`   ✅ Logins exitosos: ${successfulLogins.length}/${results.length}`);
  console.log(`   ⏱️  Tiempo promedio: ${avgResponseTime.toFixed(2)}ms`);
  
  return results;
};

// Prueba de degradación gradual
const runGradualDegradationTest = async (authToken) => {
  console.log('\n📈 PRUEBA DE DEGRADACIÓN GRADUAL');
  
  const results = [];
  
  for (const stage of CONFIG.stressScenarios.gradualDegradation.stages) {
    console.log(`   Etapa: ${stage.users} usuarios por ${stage.duration/1000}s`);
    
    const users = [];
    const stageStartTime = Date.now();
    
    // Crear usuarios para esta etapa
    for (let i = 0; i < stage.users; i++) {
      const profile = Object.values(CONFIG.userProfiles)[Math.floor(Math.random() * 3)];
      const user = new AdvancedUserSimulator(`stage-${stage.users}-${i}`, profile, authToken);
      users.push(user);
      user.startSession();
    }
    
    // Ejecutar la etapa
    await sleep(stage.duration);
    
    // Detener usuarios
    users.forEach(user => user.stopSession());
    
    // Recopilar estadísticas de la etapa
    const stageStats = users.map(user => user.getStats());
    const totalRequests = stageStats.reduce((sum, user) => sum + user.totalRequests, 0);
    const successfulRequests = stageStats.reduce((sum, user) => sum + user.successfulRequests, 0);
    const avgResponseTime = stageStats.reduce((sum, user) => sum + user.avgResponseTime, 0) / stageStats.length || 0;
    
    results.push({
      users: stage.users,
      duration: stage.duration,
      totalRequests,
      successfulRequests,
      successRate: (successfulRequests / totalRequests) * 100 || 0,
      avgResponseTime,
      requestsPerSecond: totalRequests / (stage.duration / 1000)
    });
    
    console.log(`     Requests: ${totalRequests}, Éxito: ${(successfulRequests / totalRequests * 100).toFixed(1)}%, RPS: ${(totalRequests / (stage.duration / 1000)).toFixed(2)}`);
    
    // Pausa entre etapas
    await sleep(5000);
  }
  
  return results;
};

// Prueba de recuperación
const runRecoveryTest = async (authToken) => {
  console.log('\n🔄 PRUEBA DE RECUPERACIÓN');
  
  const normalUsers = [];
  const spikeUsers = [];
  const results = { normal: [], spike: [], recovery: [] };
  
  // Crear usuarios normales
  for (let i = 0; i < CONFIG.stressScenarios.recoveryTest.normalUsers; i++) {
    const profile = CONFIG.userProfiles.casualUser;
    const user = new AdvancedUserSimulator(`normal-${i}`, profile, authToken);
    normalUsers.push(user);
    user.startSession();
  }
  
  // Ejecutar período normal
  await sleep(30000);
  
  // Crear spike de usuarios
  console.log('   📈 Aplicando spike de carga...');
  for (let i = 0; i < CONFIG.stressScenarios.recoveryTest.spikeUsers; i++) {
    const profile = CONFIG.userProfiles.powerUser;
    const user = new AdvancedUserSimulator(`spike-${i}`, profile, authToken);
    spikeUsers.push(user);
    user.startSession();
  }
  
  // Ejecutar spike
  await sleep(CONFIG.stressScenarios.recoveryTest.spikeDuration);
  
  // Remover spike
  console.log('   📉 Removiendo spike de carga...');
  spikeUsers.forEach(user => user.stopSession());
  
  // Período de recuperación
  await sleep(30000);
  
  // Detener usuarios normales
  normalUsers.forEach(user => user.stopSession());
  
  return {
    normalUsers: normalUsers.map(user => user.getStats()),
    spikeUsers: spikeUsers.map(user => user.getStats())
  };
};

// Análisis de cuellos de botella
const analyzeBottlenecks = (allResults) => {
  console.log('\n🔍 ANÁLISIS DE CUELLOS DE BOTELLA');
  
  const responseTimes = [];
  Object.values(allResults).forEach(result => {
    if (Array.isArray(result)) {
      result.forEach(item => {
        if (item.requests && Array.isArray(item.requests)) {
          item.requests.forEach(r => {
            if (r.responseTime && r.responseTime > 0) {
              responseTimes.push(r.responseTime);
            }
          });
        }
      });
    }
  });
  
  if (responseTimes.length === 0) {
    console.log('   No hay datos suficientes para análisis');
    return;
  }
  
  responseTimes.sort((a, b) => a - b);
  
  const percentiles = {
    p50: responseTimes[Math.floor(responseTimes.length * 0.5)],
    p90: responseTimes[Math.floor(responseTimes.length * 0.9)],
    p95: responseTimes[Math.floor(responseTimes.length * 0.95)],
    p99: responseTimes[Math.floor(responseTimes.length * 0.99)]
  };
  
  console.log('   📊 Percentiles de tiempo de respuesta:');
  console.log(`     P50: ${percentiles.p50.toFixed(2)}ms`);
  console.log(`     P90: ${percentiles.p90.toFixed(2)}ms`);
  console.log(`     P95: ${percentiles.p95.toFixed(2)}ms`);
  console.log(`     P99: ${percentiles.p99.toFixed(2)}ms`);
  
  // Detectar problemas
  if (percentiles.p95 > 2000) {
    console.log('   ⚠️  Alto tiempo de respuesta en P95 - Posible cuello de botella en base de datos');
  }
  if (percentiles.p99 > 5000) {
    console.log('   ⚠️  Timeouts frecuentes - Revisar configuración del servidor');
  }
  if (percentiles.p90 > 1000) {
    console.log('   ⚠️  Degradación de rendimiento - Considerar optimizaciones');
  }
};

// Generar reporte avanzado
const generateAdvancedReport = (allResults) => {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 REPORTE AVANZADO DE PRUEBA DE ESTRÉS - PANEL ADMIN');
  console.log('='.repeat(80));
  
  const totalDuration = advancedStats.endTime - advancedStats.startTime;
  
  // Métricas del sistema
  if (advancedStats.systemMetrics.cpuUsage.length > 0) {
    const avgCpu = advancedStats.systemMetrics.cpuUsage.reduce((sum, cpu) => sum + cpu, 0) / advancedStats.systemMetrics.cpuUsage.length;
    const maxCpu = Math.max(...advancedStats.systemMetrics.cpuUsage);
    const avgMemory = advancedStats.systemMetrics.memoryUsage.reduce((sum, mem) => sum + mem, 0) / advancedStats.systemMetrics.memoryUsage.length;
    const maxMemory = Math.max(...advancedStats.systemMetrics.memoryUsage);
    
    console.log('\n💻 MÉTRICAS DEL SISTEMA:');
    console.log(`   CPU promedio: ${avgCpu.toFixed(2)}%`);
    console.log(`   CPU máximo: ${maxCpu.toFixed(2)}%`);
    console.log(`   Memoria promedio: ${avgMemory.toFixed(2)}%`);
    console.log(`   Memoria máxima: ${maxMemory.toFixed(2)}%`);
  }
  
  // Análisis de cuellos de botella
  analyzeBottlenecks(allResults);
  
  // Recomendaciones avanzadas
  console.log('\n💡 RECOMENDACIONES AVANZADAS:');
  console.log('   1. Implementar cache Redis para endpoints frecuentes');
  console.log('   2. Optimizar consultas de base de datos con índices');
  console.log('   3. Implementar rate limiting para prevenir abuso');
  console.log('   4. Considerar load balancing para alta disponibilidad');
  console.log('   5. Monitorear métricas en tiempo real en producción');
  
  console.log('\n' + '='.repeat(80));
};

// Función principal avanzada
const runAdvancedStressTest = async () => {
  try {
    console.log('🔥 INICIANDO PRUEBA DE ESTRÉS AVANZADA - PANEL ADMIN');
    console.log(`   URL Base: ${CONFIG.baseUrl}`);
    console.log(`   Fecha: ${new Date().toLocaleString()}`);
    console.log(`   Sistema: ${os.platform()} ${os.arch()}`);
    
    advancedStats.startTime = performance.now();
    
    // Autenticación
    let authToken = null;
    try {
      const authResponse = await makeAdvancedRequest(`${CONFIG.baseUrl}/auth/login`, {
        method: 'POST',
        body: CONFIG.adminCredentials
      });
      const authData = JSON.parse(authResponse.data);
      authToken = authData.access_token;
      console.log('✅ Autenticación exitosa');
    } catch (error) {
      console.error('❌ Error en autenticación:', error.error || error.message);
      throw error;
    }
    
    const allResults = {};
    
    // Ejecutar pruebas
    console.log('\n🧪 EJECUTANDO BATERÍA DE PRUEBAS AVANZADAS...');
    
    // 1. Login masivo
    allResults.massLogin = await runMassLoginTest();
    
    // 2. Degradación gradual
    allResults.gradualDegradation = await runGradualDegradationTest(authToken);
    
    // 3. Prueba de recuperación
    allResults.recovery = await runRecoveryTest(authToken);
    
    advancedStats.endTime = performance.now();
    
    // Generar reporte
    generateAdvancedReport(allResults);
    
  } catch (error) {
    console.error('💥 Error fatal en la prueba avanzada:', error.message || error.error);
    process.exit(1);
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  runAdvancedStressTest().catch(console.error);
}

module.exports = {
  CONFIG,
  runAdvancedStressTest,
  AdvancedUserSimulator
};
