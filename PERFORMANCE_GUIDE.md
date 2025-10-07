# 🚀 Guía de Rendimiento de Docker

## ❌ **COMANDO LENTO (NO USAR EN DESARROLLO)**

```bash
docker-compose up -d --build
```

**Problemas:**
- 🔴 Rebuilda las imágenes desde cero cada vez
- 🔴 Descarga todas las dependencias nuevamente
- 🔴 Compila todo el código
- 🔴 No usa cache de Docker
- 🔴 Tarda 5-10 minutos cada vez
- 🔴 Consume mucha CPU y memoria

## ✅ **COMANDO RÁPIDO (USAR EN DESARROLLO)**

```bash
docker-compose -f docker-compose.dev.yml up -d
```

**Ventajas:**
- 🟢 Usa imágenes ya construidas
- 🟢 Hot reload automático
- 🟢 Mounts de desarrollo configurados
- 🟢 Tarda solo 30-60 segundos
- 🟢 Cambios se reflejan inmediatamente
- 🟢 Usa cache de Docker

## 📋 **Scripts Recomendados**

### Para Desarrollo Diario:
```bash
# Usar este script (creado automáticamente)
./start-dev.ps1
```

### Para Detener:
```bash
docker-compose -f docker-compose.dev.yml down
```

### Para Ver Logs:
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

## 🔧 **Cuándo Usar Cada Comando**

### `docker-compose up -d --build` (LENTO)
- ✅ Solo cuando cambias `Dockerfile`
- ✅ Solo cuando cambias `package.json` (dependencias)
- ✅ Solo en producción
- ❌ **NUNCA** para cambios de código

### `docker-compose -f docker-compose.dev.yml up -d` (RÁPIDO)
- ✅ Para desarrollo diario
- ✅ Para cambios de código
- ✅ Para testing
- ✅ Para debugging

## 🎯 **Resultado**

**Antes:** 5-10 minutos cada vez + aplicación lenta
**Ahora:** 30-60 segundos + aplicación rápida

## 💡 **Tip**

Una vez que uses `docker-compose.dev.yml`, **NUNCA** vuelvas a usar `docker-compose up -d --build` para desarrollo.
