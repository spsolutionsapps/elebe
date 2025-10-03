# 🔥 Guía de Pruebas de Estrés - Panel Admin

Esta guía te ayudará a ejecutar pruebas de estrés completas en el panel de administración para evaluar el rendimiento, estabilidad y escalabilidad del sistema.

## 📋 Archivos Incluidos

### Scripts de Prueba
- **`stress-test-admin.js`** - Pruebas básicas de estrés
- **`stress-test-admin-advanced.js`** - Pruebas avanzadas con simuladores de usuario
- **`stress-test-monitor.js`** - Monitor de recursos del sistema
- **`run-stress-tests.ps1`** - Script principal para ejecutar todas las pruebas

### Documentación
- **`STRESS_TEST_GUIDE.md`** - Esta guía completa

## 🚀 Inicio Rápido

### Prerrequisitos
1. **Node.js** instalado (versión 14 o superior)
2. **Backend ejecutándose** en `http://localhost:3001`
3. **Credenciales admin** configuradas:
   - Email: `admin@fashionstyle.com`
   - Password: `admin123`

### Ejecutar Todas las Pruebas
```powershell
.\run-stress-tests.ps1
```

### Ejecutar Solo Pruebas Básicas
```powershell
.\run-stress-tests.ps1 -Quick
```

### Ejecutar Solo Pruebas Avanzadas
```powershell
.\run-stress-tests.ps1 -Advanced
```

### Solo Monitoreo de Sistema
```powershell
.\run-stress-tests.ps1 -Monitor -Duration 600
```

## 📊 Tipos de Pruebas

### 1. Pruebas Básicas (`stress-test-admin.js`)
- **Autenticación masiva**: 50 usuarios concurrentes, 10 requests cada uno
- **Dashboard bajo carga**: 30 usuarios, 20 requests cada uno
- **Operaciones CRUD**: 20 usuarios, 15 requests cada uno
- **Estrés máximo**: 100 usuarios, 50 requests cada uno

**Endpoints probados:**
- `/auth/login` - Autenticación
- `/auth/profile` - Perfil de usuario
- `/slides` - Gestión de slides
- `/products` - Gestión de productos
- `/services` - Gestión de servicios
- `/inquiries` - Consultas de clientes

### 2. Pruebas Avanzadas (`stress-test-admin-advanced.js`)
- **Login masivo**: 100 logins concurrentes
- **Degradación gradual**: Incremento progresivo de usuarios (10→200)
- **Prueba de recuperación**: Spike de carga seguido de normalización
- **Simuladores de usuario realistas**:
  - Usuario Avanzado: 60 req/min, tiempo de pensamiento 1s
  - Usuario Casual: 20 req/min, tiempo de pensamiento 3s
  - Administrador: 100 req/min, tiempo de pensamiento 0.5s

### 3. Monitoreo de Sistema (`stress-test-monitor.js`)
- **CPU**: Uso promedio, máximo, mínimo
- **Memoria**: RAM utilizada, heap de Node.js
- **Load Average**: Carga del sistema
- **Conexiones de red**: Estimación de conexiones activas
- **Alertas automáticas**: CPU >80%, Memoria >85%, Load >2x cores

## 📈 Métricas y Reportes

### Métricas Capturadas
- **Tiempo de respuesta**: Promedio, mínimo, máximo, percentiles (P50, P90, P95, P99)
- **Throughput**: Requests por segundo (RPS)
- **Tasa de éxito**: Porcentaje de requests exitosos
- **Errores**: Tipos y frecuencia de errores
- **Recursos del sistema**: CPU, memoria, load average

### Archivos de Reporte Generados
- **`stress-test-report-{timestamp}.json`** - Reporte detallado de pruebas
- **`stress-test-metrics.json`** - Métricas detalladas por request
- **`system-metrics.json`** - Métricas del sistema en tiempo real

### Interpretación de Resultados

#### ✅ Rendimiento Excelente
- Tasa de éxito >95%
- Tiempo de respuesta promedio <500ms
- P95 <1000ms
- CPU promedio <70%
- Memoria promedio <80%

#### ⚠️ Rendimiento Aceptable
- Tasa de éxito 90-95%
- Tiempo de respuesta promedio 500-1000ms
- P95 1000-2000ms
- CPU promedio 70-85%
- Memoria promedio 80-90%

#### ❌ Rendimiento Problemático
- Tasa de éxito <90%
- Tiempo de respuesta promedio >1000ms
- P95 >2000ms
- CPU promedio >85%
- Memoria promedio >90%

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
export API_URL="http://localhost:3001/api"
export STRESS_TEST_DURATION="300"
export STRESS_TEST_CONCURRENT_USERS="100"
```

### Personalizar Configuración
Edita las constantes `CONFIG` en los archivos JavaScript:

```javascript
const CONFIG = {
  baseUrl: process.env.API_URL || 'http://localhost:3001/api',
  testScenarios: {
    auth: {
      concurrentUsers: 50,    // Cambiar número de usuarios
      requestsPerUser: 10,    // Cambiar requests por usuario
    }
  }
};
```

## 🐳 Ejecutar con Docker

Si usas Docker para el backend:

```bash
# Verificar que el backend esté ejecutándose
docker-compose ps

# Ejecutar pruebas contra el contenedor
.\run-stress-tests.ps1 -ApiUrl "http://localhost:3001/api"
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión
```
❌ Error en autenticación: connect ECONNREFUSED
```
**Solución**: Verificar que el backend esté ejecutándose en el puerto correcto

#### 2. Timeouts Frecuentes
```
⚠️ Timeouts detectados - Revisar timeouts del servidor
```
**Solución**: 
- Aumentar timeout en el servidor
- Optimizar consultas de base de datos
- Revisar índices de base de datos

#### 3. Alta Tasa de Errores
```
❌ Tasa de éxito baja - Revisar configuración del servidor
```
**Solución**:
- Verificar logs del backend
- Revisar configuración de base de datos
- Aumentar límites de conexión

#### 4. Alto Uso de Recursos
```
🚨 ALERTA CRÍTICA: CPU usage alto: 95%
```
**Solución**:
- Optimizar código del backend
- Aumentar recursos del servidor
- Implementar cache
- Revisar consultas N+1

### Logs y Debugging

#### Ver Logs del Backend
```bash
# Docker
docker-compose logs -f backend

# Local
npm run dev  # En el directorio backend/
```

#### Debug de Pruebas
```javascript
// Agregar más logging en los scripts
console.log('Debug info:', { url, options, timestamp });
```

## 📋 Checklist de Pruebas

### Antes de Ejecutar
- [ ] Backend ejecutándose correctamente
- [ ] Base de datos conectada
- [ ] Credenciales admin configuradas
- [ ] Node.js instalado
- [ ] Archivos de prueba presentes

### Durante la Ejecución
- [ ] Monitorear logs del backend
- [ ] Verificar uso de recursos del sistema
- [ ] Observar comportamiento de la aplicación
- [ ] Documentar cualquier error inusual

### Después de Ejecutar
- [ ] Revisar archivos de reporte generados
- [ ] Analizar métricas de rendimiento
- [ ] Identificar cuellos de botella
- [ ] Planificar optimizaciones
- [ ] Programar pruebas regulares

## 🎯 Objetivos de Rendimiento

### Metas Recomendadas
- **Tiempo de respuesta**: <500ms para 95% de requests
- **Disponibilidad**: >99.5% durante pruebas
- **Throughput**: >100 RPS sostenidos
- **Recursos**: <80% CPU y memoria bajo carga normal

### Benchmarks por Tipo de Usuario
- **Usuario Casual**: <2s tiempo de respuesta, 20 req/min
- **Usuario Avanzado**: <1s tiempo de respuesta, 60 req/min
- **Administrador**: <500ms tiempo de respuesta, 100 req/min

## 🔄 Pruebas Regulares

### Frecuencia Recomendada
- **Desarrollo**: Diaria durante desarrollo activo
- **Staging**: Antes de cada deploy a producción
- **Producción**: Semanal o después de cambios significativos

### Automatización
```bash
# Agregar a CI/CD pipeline
.\run-stress-tests.ps1 -Quick

# Cron job para pruebas regulares
0 2 * * * cd /path/to/project && ./run-stress-tests.ps1 -Monitor -Duration 1800
```

## 📞 Soporte

Si encuentras problemas o necesitas ayuda:

1. **Revisar logs**: Siempre revisa los logs del backend primero
2. **Verificar configuración**: Asegúrate de que todas las configuraciones sean correctas
3. **Documentar errores**: Guarda los archivos de reporte para análisis
4. **Escalar gradualmente**: Empieza con pruebas pequeñas y aumenta la carga

---

**¡Recuerda que las pruebas de estrés son una herramienta de diagnóstico, no una solución!** Usa los resultados para identificar y resolver problemas de rendimiento antes de que afecten a los usuarios reales.
