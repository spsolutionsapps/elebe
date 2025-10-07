# 🔧 Guía de Solución de Problemas

## ❌ **ERR_CONNECTION_RESET**

### **¿Qué es?**
Error que aparece cuando Next.js está recompilando y pierde la conexión temporalmente.

### **¿Cuándo ocurre?**
- Durante recompilaciones automáticas
- Al hacer cambios en el código
- Cuando Next.js está procesando cambios

### **Soluciones:**

#### **Solución Rápida:**
```bash
# Refrescar la página (F5)
# O esperar 10-15 segundos
```

#### **Solución Completa:**
```bash
# Usar el script automático
./fix-connection-reset.ps1
```

#### **Solución Manual:**
```bash
# 1. Limpiar cache
docker-compose -f docker-compose.dev.yml down
docker volume rm elebe_frontend_next

# 2. Reiniciar
docker-compose -f docker-compose.dev.yml up -d
```

## 🐌 **Aplicación Lenta**

### **Problema:**
- Usar `docker-compose up -d --build`
- Recompila todo desde cero

### **Solución:**
```bash
# Usar siempre este comando
docker-compose -f docker-compose.dev.yml up -d
```

## 🔄 **Hot Reload No Funciona**

### **Problema:**
- Cambios no se reflejan
- Necesitas refrescar manualmente

### **Solución:**
```bash
# Verificar que estés usando docker-compose.dev.yml
docker ps
# Debe mostrar: lb-premium-frontend-dev
```

## 🚫 **Puerto Ocupado**

### **Problema:**
- Puerto 3000 o 3001 en uso
- Error al iniciar contenedores

### **Solución:**
```bash
# Detener todos los contenedores
docker-compose -f docker-compose.dev.yml down

# Verificar puertos
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matar proceso si es necesario
taskkill /PID <PID_NUMBER> /F
```

## 💾 **Problemas de Memoria**

### **Problema:**
- Aplicación muy lenta
- Errores de memoria

### **Solución:**
```bash
# Limpiar Docker
docker system prune -f

# Reiniciar Docker Desktop
# O reiniciar la computadora
```

## 🎯 **Comandos Útiles**

```bash
# Ver estado de contenedores
docker ps

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Ver logs específicos
docker logs lb-premium-frontend-dev
docker logs lb-premium-backend-dev

# Reiniciar un contenedor específico
docker restart lb-premium-frontend-dev

# Ver uso de recursos
docker stats
```

## ✅ **Verificación Rápida**

```bash
# 1. Verificar contenedores
docker ps

# 2. Probar endpoints
curl http://localhost:3000
curl http://localhost:3001/api/health

# 3. Ver logs si hay problemas
docker-compose -f docker-compose.dev.yml logs --tail=20
```
