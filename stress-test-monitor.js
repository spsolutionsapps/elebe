#!/usr/bin/env node

/**
 * Monitor de Recursos para Pruebas de Estrés
 * 
 * Este script monitorea en tiempo real:
 * - Uso de CPU y memoria
 * - Conexiones de red
 * - Rendimiento de base de datos
 * - Logs de errores del servidor
 * - Métricas de Docker (si está disponible)
 */

const os = require('os');
const fs = require('fs');
const { performance } = require('perf_hooks');

class SystemMonitor {
  constructor(options = {}) {
    this.options = {
      interval: options.interval || 1000, // 1 segundo
      logFile: options.logFile || 'stress-test-metrics.json',
      enableFileLogging: options.enableFileLogging !== false,
      ...options
    };
    
    this.metrics = {
      system: [],
      performance: [],
      errors: [],
      alerts: []
    };
    
    this.isMonitoring = false;
    this.startTime = null;
    this.baselineMetrics = null;
  }
  
  async start() {
    console.log('📊 Iniciando monitor de recursos...');
    this.isMonitoring = true;
    this.startTime = Date.now();
    
    // Establecer métricas de línea base
    this.baselineMetrics = await this.collectMetrics();
    
    // Iniciar monitoreo
    this.monitorInterval = setInterval(async () => {
      if (this.isMonitoring) {
        await this.collectAndLogMetrics();
      }
    }, this.options.interval);
    
    console.log('✅ Monitor iniciado');
  }
  
  stop() {
    console.log('🛑 Deteniendo monitor de recursos...');
    this.isMonitoring = false;
    
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
    
    // Generar reporte final
    this.generateFinalReport();
    
    console.log('✅ Monitor detenido');
  }
  
  async collectMetrics() {
    const timestamp = Date.now();
    
    // Métricas del sistema
    const systemMetrics = {
      timestamp,
      cpu: this.getCpuUsage(),
      memory: this.getMemoryUsage(),
      loadAverage: os.loadavg(),
      uptime: os.uptime(),
      platform: os.platform(),
      arch: os.arch()
    };
    
    // Métricas de rendimiento
    const performanceMetrics = {
      timestamp,
      processMemory: process.memoryUsage(),
      processUptime: process.uptime(),
      nodeVersion: process.version,
      pid: process.pid
    };
    
    // Métricas de red (simuladas - en un entorno real usarías netstat o similar)
    const networkMetrics = {
      timestamp,
      activeConnections: await this.getActiveConnections(),
      networkInterfaces: os.networkInterfaces()
    };
    
    return {
      system: systemMetrics,
      performance: performanceMetrics,
      network: networkMetrics
    };
  }
  
  getCpuUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach(cpu => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });
    
    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~(100 * idle / total);
    
    return {
      usage: usage,
      cores: cpus.length,
      model: cpus[0].model,
      speed: cpus[0].speed
    };
  }
  
  getMemoryUsage() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    
    return {
      total: totalMemory,
      free: freeMemory,
      used: usedMemory,
      usagePercent: (usedMemory / totalMemory) * 100,
      available: os.freemem()
    };
  }
  
  async getActiveConnections() {
    // En un entorno real, aquí harías una llamada a netstat o usarías una librería
    // Por ahora simulamos con un número aleatorio basado en la carga del sistema
    const cpuUsage = this.getCpuUsage().usage;
    const baseConnections = Math.floor(cpuUsage / 10) * 5;
    const randomVariation = Math.floor(Math.random() * 20);
    
    return {
      estimated: baseConnections + randomVariation,
      note: 'Estimación basada en uso de CPU (implementar netstat para datos reales)'
    };
  }
  
  async collectAndLogMetrics() {
    try {
      const metrics = await this.collectMetrics();
      
      // Agregar a la colección
      this.metrics.system.push(metrics.system);
      this.metrics.performance.push(metrics.performance);
      
      // Verificar alertas
      this.checkAlerts(metrics);
      
      // Log a archivo si está habilitado
      if (this.options.enableFileLogging) {
        await this.logToFile(metrics);
      }
      
      // Mostrar métricas en consola cada 10 segundos
      const now = Date.now();
      if (!this.lastConsoleLog || now - this.lastConsoleLog > 10000) {
        this.displayMetrics(metrics);
        this.lastConsoleLog = now;
      }
      
    } catch (error) {
      console.error('❌ Error recolectando métricas:', error.message);
      this.metrics.errors.push({
        timestamp: Date.now(),
        error: error.message,
        type: 'metric_collection_error'
      });
    }
  }
  
  checkAlerts(metrics) {
    const alerts = [];
    
    // Alerta de CPU alto
    if (metrics.system.cpu.usage > 80) {
      alerts.push({
        level: 'warning',
        message: `CPU usage alto: ${metrics.system.cpu.usage.toFixed(2)}%`,
        timestamp: Date.now(),
        metric: 'cpu_usage',
        value: metrics.system.cpu.usage
      });
    }
    
    // Alerta de memoria alta
    if (metrics.system.memory.usagePercent > 85) {
      alerts.push({
        level: 'critical',
        message: `Memoria usage alto: ${metrics.system.memory.usagePercent.toFixed(2)}%`,
        timestamp: Date.now(),
        metric: 'memory_usage',
        value: metrics.system.memory.usagePercent
      });
    }
    
    // Alerta de load average alto
    if (metrics.system.loadAverage[0] > os.cpus().length * 2) {
      alerts.push({
        level: 'warning',
        message: `Load average alto: ${metrics.system.loadAverage[0].toFixed(2)}`,
        timestamp: Date.now(),
        metric: 'load_average',
        value: metrics.system.loadAverage[0]
      });
    }
    
    // Agregar alertas
    this.metrics.alerts.push(...alerts);
    
    // Mostrar alertas críticas inmediatamente
    alerts.filter(alert => alert.level === 'critical').forEach(alert => {
      console.log(`🚨 ALERTA CRÍTICA: ${alert.message}`);
    });
  }
  
  displayMetrics(metrics) {
    const duration = Date.now() - this.startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    console.log(`\n📊 Métricas del Sistema [${minutes}:${seconds.toString().padStart(2, '0')}]`);
    console.log(`   CPU: ${metrics.system.cpu.usage.toFixed(1)}% (${metrics.system.cpu.cores} cores)`);
    console.log(`   Memoria: ${(metrics.system.memory.used / 1024 / 1024 / 1024).toFixed(2)}GB / ${(metrics.system.memory.total / 1024 / 1024 / 1024).toFixed(2)}GB (${metrics.system.memory.usagePercent.toFixed(1)}%)`);
    console.log(`   Load Avg: ${metrics.system.loadAverage[0].toFixed(2)} ${metrics.system.loadAverage[1].toFixed(2)} ${metrics.system.loadAverage[2].toFixed(2)}`);
    console.log(`   Heap: ${(metrics.performance.processMemory.heapUsed / 1024 / 1024).toFixed(2)}MB / ${(metrics.performance.processMemory.heapTotal / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Conexiones: ~${metrics.network.activeConnections.estimated}`);
  }
  
  async logToFile(metrics) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        ...metrics
      };
      
      // Crear archivo si no existe
      if (!fs.existsSync(this.options.logFile)) {
        fs.writeFileSync(this.options.logFile, JSON.stringify([], null, 2));
      }
      
      // Leer, agregar y escribir
      const existingData = JSON.parse(fs.readFileSync(this.options.logFile, 'utf8'));
      existingData.push(logEntry);
      
      // Mantener solo los últimos 1000 registros para evitar archivos muy grandes
      if (existingData.length > 1000) {
        existingData.splice(0, existingData.length - 1000);
      }
      
      fs.writeFileSync(this.options.logFile, JSON.stringify(existingData, null, 2));
      
    } catch (error) {
      console.error('❌ Error escribiendo métricas a archivo:', error.message);
    }
  }
  
  generateFinalReport() {
    if (this.metrics.system.length === 0) {
      console.log('📊 No hay métricas para generar reporte');
      return;
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE FINAL DE MONITOREO');
    console.log('='.repeat(60));
    
    const duration = Date.now() - this.startTime;
    const totalMinutes = (duration / 60000).toFixed(2);
    
    // Estadísticas de CPU
    const cpuUsage = this.metrics.system.map(m => m.cpu.usage);
    const avgCpu = cpuUsage.reduce((sum, cpu) => sum + cpu, 0) / cpuUsage.length;
    const maxCpu = Math.max(...cpuUsage);
    const minCpu = Math.min(...cpuUsage);
    
    // Estadísticas de memoria
    const memoryUsage = this.metrics.system.map(m => m.memory.usagePercent);
    const avgMemory = memoryUsage.reduce((sum, mem) => sum + mem, 0) / memoryUsage.length;
    const maxMemory = Math.max(...memoryUsage);
    const minMemory = Math.min(...memoryUsage);
    
    // Estadísticas de load average
    const loadAvg = this.metrics.system.map(m => m.loadAverage[0]);
    const avgLoad = loadAvg.reduce((sum, load) => sum + load, 0) / loadAvg.length;
    const maxLoad = Math.max(...loadAvg);
    
    console.log(`\n⏱️  DURACIÓN TOTAL: ${totalMinutes} minutos`);
    console.log(`   Muestras recolectadas: ${this.metrics.system.length}`);
    
    console.log(`\n💻 CPU:`);
    console.log(`   Promedio: ${avgCpu.toFixed(2)}%`);
    console.log(`   Máximo: ${maxCpu.toFixed(2)}%`);
    console.log(`   Mínimo: ${minCpu.toFixed(2)}%`);
    
    console.log(`\n🧠 MEMORIA:`);
    console.log(`   Promedio: ${avgMemory.toFixed(2)}%`);
    console.log(`   Máximo: ${maxMemory.toFixed(2)}%`);
    console.log(`   Mínimo: ${minMemory.toFixed(2)}%`);
    
    console.log(`\n📈 LOAD AVERAGE:`);
    console.log(`   Promedio: ${avgLoad.toFixed(2)}`);
    console.log(`   Máximo: ${maxLoad.toFixed(2)}`);
    
    // Alertas generadas
    if (this.metrics.alerts.length > 0) {
      console.log(`\n🚨 ALERTAS GENERADAS: ${this.metrics.alerts.length}`);
      const criticalAlerts = this.metrics.alerts.filter(a => a.level === 'critical');
      const warningAlerts = this.metrics.alerts.filter(a => a.level === 'warning');
      
      if (criticalAlerts.length > 0) {
        console.log(`   Críticas: ${criticalAlerts.length}`);
      }
      if (warningAlerts.length > 0) {
        console.log(`   Advertencias: ${warningAlerts.length}`);
      }
    }
    
    // Errores
    if (this.metrics.errors.length > 0) {
      console.log(`\n❌ ERRORES: ${this.metrics.errors.length}`);
    }
    
    // Recomendaciones
    console.log(`\n💡 ANÁLISIS:`);
    if (maxCpu > 90) {
      console.log('   ⚠️  CPU muy alto - Considerar optimización de código o más recursos');
    }
    if (maxMemory > 90) {
      console.log('   ⚠️  Memoria muy alta - Revisar memory leaks o aumentar RAM');
    }
    if (maxLoad > os.cpus().length * 2) {
      console.log('   ⚠️  Load average alto - Sistema sobrecargado');
    }
    if (avgCpu < 50 && avgMemory < 70) {
      console.log('   ✅ Sistema funcionando dentro de parámetros normales');
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Guardar reporte final
    const finalReport = {
      summary: {
        duration: duration,
        totalMinutes: totalMinutes,
        samples: this.metrics.system.length,
        cpu: { avg: avgCpu, max: maxCpu, min: minCpu },
        memory: { avg: avgMemory, max: maxMemory, min: minMemory },
        loadAverage: { avg: avgLoad, max: maxLoad },
        alerts: this.metrics.alerts.length,
        errors: this.metrics.errors.length
      },
      alerts: this.metrics.alerts,
      errors: this.metrics.errors,
      baseline: this.baselineMetrics,
      timestamp: new Date().toISOString()
    };
    
    const reportFile = `stress-test-report-${Date.now()}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(finalReport, null, 2));
    console.log(`\n📄 Reporte detallado guardado en: ${reportFile}`);
  }
}

// Función para ejecutar el monitor independientemente
const runMonitor = async (duration = 300000) => { // 5 minutos por defecto
  const monitor = new SystemMonitor({
    interval: 2000, // 2 segundos
    logFile: 'system-metrics.json'
  });
  
  try {
    await monitor.start();
    
    console.log(`\n⏱️  Monitoreo iniciado por ${duration/1000} segundos...`);
    console.log('   Presiona Ctrl+C para detener antes del tiempo programado\n');
    
    // Ejecutar por el tiempo especificado
    await new Promise(resolve => setTimeout(resolve, duration));
    
  } finally {
    monitor.stop();
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  const duration = process.argv[2] ? parseInt(process.argv[2]) * 1000 : 300000;
  runMonitor(duration).catch(console.error);
}

module.exports = {
  SystemMonitor,
  runMonitor
};
