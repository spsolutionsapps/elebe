#!/usr/bin/env node

/**
 * Prueba de Estrés para Panel de Administración
 * 
 * Este script simula carga intensa en el sistema admin para evaluar:
 * - Rendimiento bajo carga
 * - Estabilidad de la autenticación
 * - Tiempo de respuesta de endpoints críticos
 * - Comportamiento bajo concurrencia
 */

const https = require('https');
const http = require('http');
const { performance } = require('perf_hooks');

// Configuración
const CONFIG = {
  baseUrl: process.env.API_URL || 'http://localhost:3001/api',
  adminCredentials: {
    email: 'admin@fashionstyle.com',
    password: 'admin123'
  },
  testScenarios: {
    // Pruebas de autenticación
    auth: {
      concurrentUsers: 50,
      requestsPerUser: 10,
      endpoints: ['/auth/login', '/auth/profile']
    },
    // Pruebas de dashboard
    dashboard: {
      concurrentUsers: 30,
      requestsPerUser: 20,
      endpoints: ['/slides', '/products', '/services', '/inquiries']
    },
    // Pruebas de operaciones CRUD
    crud: {
      concurrentUsers: 20,
      requestsPerUser: 15,
      endpoints: ['/products', '/services', '/tasks']
    },
    // Prueba de estrés máximo
    maxStress: {
      concurrentUsers: 100,
      requestsPerUser: 50,
      endpoints: ['/auth/login', '/slides', '/products', '/services', '/inquiries']
    }
  },
  timeouts: {
    request: 10000, // 10 segundos
    test: 300000    // 5 minutos máximo por test
  }
};

// Estadísticas globales
const stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],
  errors: [],
  startTime: null,
  endTime: null
};

// Utilidades
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequest = async (url, options = {}) => {
  const startTime = performance.now();
  
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Stress-Test-Admin/1.0',
        ...options.headers
      },
      timeout: CONFIG.timeouts.request
    }, (res) => {
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        stats.totalRequests++;
        stats.responseTimes.push(responseTime);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          stats.successfulRequests++;
          resolve({
            statusCode: res.statusCode,
            data: data,
            responseTime: responseTime,
            headers: res.headers
          });
        } else {
          stats.failedRequests++;
          const error = new Error(`HTTP ${res.statusCode}: ${data}`);
          error.statusCode = res.statusCode;
          error.responseTime = responseTime;
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      stats.totalRequests++;
      stats.failedRequests++;
      stats.responseTimes.push(responseTime);
      error.responseTime = responseTime;
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      stats.totalRequests++;
      stats.failedRequests++;
      stats.responseTimes.push(responseTime);
      
      const timeoutError = new Error('Request timeout');
      timeoutError.responseTime = responseTime;
      reject(timeoutError);
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
};

// Autenticación
let authToken = null;

const authenticate = async () => {
  try {
    console.log('🔐 Autenticando usuario admin...');
    
    const response = await makeRequest(`${CONFIG.baseUrl}/auth/login`, {
      method: 'POST',
      body: CONFIG.adminCredentials
    });
    
    const data = JSON.parse(response.data);
    authToken = data.access_token;
    
    console.log('✅ Autenticación exitosa');
    return authToken;
  } catch (error) {
    console.error('❌ Error en autenticación:', error.message);
    throw error;
  }
};

// Simulador de usuario
const simulateUser = async (userId, scenario, endpoint) => {
  const userStats = {
    userId,
    requests: 0,
    successes: 0,
    failures: 0,
    totalResponseTime: 0,
    errors: []
  };
  
  for (let i = 0; i < scenario.requestsPerUser; i++) {
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      
      const response = await makeRequest(`${CONFIG.baseUrl}${endpoint}`, {
        headers
      });
      
      userStats.requests++;
      userStats.successes++;
      userStats.totalResponseTime += response.responseTime;
      
      // Pequeña pausa entre requests para simular comportamiento real
      await sleep(Math.random() * 100);
      
    } catch (error) {
      userStats.requests++;
      userStats.failures++;
      userStats.totalResponseTime += error.responseTime || 0;
      userStats.errors.push({
        request: i + 1,
        error: error.message,
        responseTime: error.responseTime || 0
      });
      
      stats.errors.push({
        userId,
        endpoint,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return userStats;
};

// Ejecutar escenario de prueba
const runScenario = async (scenarioName, scenario) => {
  console.log(`\n🚀 Iniciando escenario: ${scenarioName}`);
  console.log(`   Usuarios concurrentes: ${scenario.concurrentUsers}`);
  console.log(`   Requests por usuario: ${scenario.requestsPerUser}`);
  console.log(`   Endpoints: ${scenario.endpoints.join(', ')}`);
  
  const scenarioStartTime = performance.now();
  const userPromises = [];
  
  // Crear usuarios concurrentes
  for (let userId = 1; userId <= scenario.concurrentUsers; userId++) {
    const endpoint = scenario.endpoints[Math.floor(Math.random() * scenario.endpoints.length)];
    userPromises.push(simulateUser(userId, scenario, endpoint));
  }
  
  // Esperar a que todos los usuarios terminen
  const userResults = await Promise.all(userPromises);
  const scenarioEndTime = performance.now();
  const scenarioDuration = scenarioEndTime - scenarioStartTime;
  
  // Calcular estadísticas del escenario
  const scenarioStats = {
    name: scenarioName,
    duration: scenarioDuration,
    totalUsers: scenario.concurrentUsers,
    totalRequests: userResults.reduce((sum, user) => sum + user.requests, 0),
    totalSuccesses: userResults.reduce((sum, user) => sum + user.successes, 0),
    totalFailures: userResults.reduce((sum, user) => sum + user.failures, 0),
    avgResponseTime: userResults.reduce((sum, user) => sum + user.totalResponseTime, 0) / 
                    userResults.reduce((sum, user) => sum + user.requests, 0),
    successRate: (userResults.reduce((sum, user) => sum + user.successes, 0) / 
                 userResults.reduce((sum, user) => sum + user.requests, 0)) * 100,
    requestsPerSecond: userResults.reduce((sum, user) => sum + user.requests, 0) / (scenarioDuration / 1000)
  };
  
  return scenarioStats;
};

// Generar reporte
const generateReport = (scenarioResults) => {
  console.log('\n' + '='.repeat(80));
  console.log('📊 REPORTE DE PRUEBA DE ESTRÉS - PANEL ADMIN');
  console.log('='.repeat(80));
  
  // Estadísticas globales
  const totalDuration = stats.endTime - stats.startTime;
  const globalSuccessRate = (stats.successfulRequests / stats.totalRequests) * 100;
  const avgResponseTime = stats.responseTimes.reduce((sum, time) => sum + time, 0) / stats.responseTimes.length;
  const minResponseTime = Math.min(...stats.responseTimes);
  const maxResponseTime = Math.max(...stats.responseTimes);
  
  console.log('\n📈 ESTADÍSTICAS GLOBALES:');
  console.log(`   Duración total: ${(totalDuration / 1000).toFixed(2)}s`);
  console.log(`   Total de requests: ${stats.totalRequests}`);
  console.log(`   Requests exitosos: ${stats.successfulRequests}`);
  console.log(`   Requests fallidos: ${stats.failedRequests}`);
  console.log(`   Tasa de éxito: ${globalSuccessRate.toFixed(2)}%`);
  console.log(`   Requests por segundo: ${(stats.totalRequests / (totalDuration / 1000)).toFixed(2)}`);
  console.log(`   Tiempo de respuesta promedio: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`   Tiempo de respuesta mínimo: ${minResponseTime.toFixed(2)}ms`);
  console.log(`   Tiempo de respuesta máximo: ${maxResponseTime.toFixed(2)}ms`);
  
  // Estadísticas por escenario
  console.log('\n🎯 ESTADÍSTICAS POR ESCENARIO:');
  scenarioResults.forEach(result => {
    console.log(`\n   ${result.name}:`);
    console.log(`     Duración: ${(result.duration / 1000).toFixed(2)}s`);
    console.log(`     Usuarios: ${result.totalUsers}`);
    console.log(`     Requests: ${result.totalRequests}`);
    console.log(`     Tasa de éxito: ${result.successRate.toFixed(2)}%`);
    console.log(`     RPS: ${result.requestsPerSecond.toFixed(2)}`);
    console.log(`     Tiempo promedio: ${result.avgResponseTime.toFixed(2)}ms`);
  });
  
  // Errores más comunes
  if (stats.errors.length > 0) {
    console.log('\n❌ ERRORES DETECTADOS:');
    const errorCounts = {};
    stats.errors.forEach(error => {
      errorCounts[error.error] = (errorCounts[error.error] || 0) + 1;
    });
    
    Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([error, count]) => {
        console.log(`     ${error}: ${count} ocurrencias`);
      });
  }
  
  // Recomendaciones
  console.log('\n💡 RECOMENDACIONES:');
  if (globalSuccessRate < 95) {
    console.log('   ⚠️  Tasa de éxito baja - Revisar configuración del servidor');
  }
  if (avgResponseTime > 1000) {
    console.log('   ⚠️  Tiempo de respuesta alto - Optimizar base de datos y endpoints');
  }
  if (maxResponseTime > 5000) {
    console.log('   ⚠️  Timeouts detectados - Revisar timeouts del servidor');
  }
  if (globalSuccessRate >= 95 && avgResponseTime < 500) {
    console.log('   ✅ Sistema funcionando correctamente bajo carga');
  }
  
  console.log('\n' + '='.repeat(80));
};

// Función principal
const main = async () => {
  try {
    console.log('🔥 INICIANDO PRUEBA DE ESTRÉS - PANEL ADMIN');
    console.log(`   URL Base: ${CONFIG.baseUrl}`);
    console.log(`   Fecha: ${new Date().toLocaleString()}`);
    
    stats.startTime = performance.now();
    
    // Autenticación inicial
    await authenticate();
    
    // Ejecutar escenarios
    const scenarioResults = [];
    
    for (const [scenarioName, scenario] of Object.entries(CONFIG.testScenarios)) {
      try {
        const result = await runScenario(scenarioName, scenario);
        scenarioResults.push(result);
        
        // Pausa entre escenarios
        await sleep(2000);
      } catch (error) {
        console.error(`❌ Error en escenario ${scenarioName}:`, error.message);
      }
    }
    
    stats.endTime = performance.now();
    
    // Generar reporte
    generateReport(scenarioResults);
    
  } catch (error) {
    console.error('💥 Error fatal en la prueba de estrés:', error.message);
    process.exit(1);
  }
};

// Manejo de señales para interrupción limpia
process.on('SIGINT', () => {
  console.log('\n🛑 Prueba interrumpida por el usuario');
  stats.endTime = performance.now();
  
  if (stats.totalRequests > 0) {
    generateReport([]);
  }
  
  process.exit(0);
});

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  CONFIG,
  runScenario,
  simulateUser,
  generateReport
};
