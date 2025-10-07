# 🚀 Inicio Rápido - LB Premium

## ❌ **SCRIPTS LENTOS (NO USAR)**

```bash
./build-docker.ps1    # ❌ MUY LENTO - rebuilda todo
./start-docker.ps1    # ❌ MUY LENTO - rebuilda todo
```

**Problemas:**
- 🔴 Rebuilda las imágenes desde cero
- 🔴 Tarda 5-10 minutos cada vez
- 🔴 Consume mucha CPU y memoria
- 🔴 No usa cache de Docker

## ✅ **SCRIPT RÁPIDO (SIEMPRE USAR)**

```bash
./start-dev.ps1       # ✅ RÁPIDO - usa cache
```

**Ventajas:**
- 🟢 Usa imágenes ya construidas
- 🟢 Tarda solo 30-60 segundos
- 🟢 Hot reload automático
- 🟢 Cambios se reflejan inmediatamente

## 📋 **Comandos para Desarrollo**

### **Para Iniciar (SIEMPRE usar este):**
```bash
./start-dev.ps1
```

### **Para Detener:**
```bash
docker-compose -f docker-compose.dev.yml down
```

### **Para Ver Logs:**
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### **Para Ver Estado:**
```bash
docker-compose -f docker-compose.dev.yml ps
```

## 🎯 **Regla de Oro**

**Para desarrollo diario:** `./start-dev.ps1`
**Para producción:** `./build-docker.ps1`

## 🔧 **Si Hay Problemas**

```bash
# Limpiar cache si hay problemas
./fix-connection-reset.ps1
```

## 📊 **Comparación de Tiempos**

| Script | Tiempo | Uso |
|--------|--------|-----|
| `build-docker.ps1` | 5-10 min | ❌ Solo producción |
| `start-docker.ps1` | 5-10 min | ❌ Solo producción |
| `start-dev.ps1` | 30-60 seg | ✅ Desarrollo diario |

## 💡 **Tip**

Una vez que uses `start-dev.ps1`, **NUNCA** vuelvas a usar los otros scripts para desarrollo.
