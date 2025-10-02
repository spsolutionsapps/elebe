# 🐳 Comandos de Docker para LB Premium

## 📋 **Comandos Básicos**

### **1. Arrancar todos los servicios:**
```bash
docker-compose up -d
```

### **2. Arrancar solo un servicio específico:**
```bash
docker-compose up -d frontend
docker-compose up -d backend
docker-compose up -d postgres
```

### **3. Reconstruir y arrancar (cuando cambias código):**
```bash
docker-compose up -d --build frontend
docker-compose up -d --build backend
docker-compose up -d --build
```

### **4. Reconstruir sin caché (cuando hay problemas):**
```bash
docker-compose build --no-cache frontend
docker-compose build --no-cache backend
docker-compose build --no-cache
```

## 🔍 **Comandos de Diagnóstico**

### **5. Ver estado de todos los contenedores:**
```bash
docker-compose ps
```

### **6. Ver logs en tiempo real:**
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f
```

### **7. Ver logs de los últimos 50 registros:**
```bash
docker-compose logs --tail=50 frontend
docker-compose logs --tail=50 backend
```

## 🛠️ **Comandos de Mantenimiento**

### **8. Parar todos los servicios:**
```bash
docker-compose down
```

### **9. Parar y eliminar volúmenes (CUIDADO: borra la base de datos):**
```bash
docker-compose down -v
```

### **10. Reiniciar un servicio específico:**
```bash
docker-compose restart frontend
docker-compose restart backend
docker-compose restart postgres
```

### **11. Ejecutar comandos dentro de un contenedor:**
```bash
docker-compose exec frontend sh
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres -d lb_premium
```

## 🚀 **Comandos de Desarrollo**

### **12. Cuando cambias código del frontend:**
```bash
docker-compose up -d --build frontend
```

### **13. Cuando cambias código del backend:**
```bash
docker-compose up -d --build backend
```

### **14. Cuando cambias docker-compose.yml:**
```bash
docker-compose up -d --build
```

### **15. Verificar que las imágenes se suban correctamente:**
```bash
docker-compose exec backend ls -la /app/uploads/
```

### **16. Probar endpoints del backend:**
```bash
curl http://localhost:3001/api/inquiries/test
curl http://localhost:3001/uploads/image-xxx.jpg
```

## 🔧 **Comandos de Solución de Problemas**

### **17. Limpiar todo y empezar de nuevo:**
```bash
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

### **18. Ver uso de recursos:**
```bash
docker stats
```

### **19. Ver imágenes de Docker:**
```bash
docker images
```

### **20. Eliminar imágenes no utilizadas:**
```bash
docker image prune -f
```

## 📱 **URLs de Acceso**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api/docs
- **Base de datos**: localhost:5432

## ⚠️ **Comandos Peligrosos (usar con cuidado)**

### **21. Eliminar todo (incluyendo base de datos):**
```bash
docker-compose down -v --rmi all
docker system prune -a -f
```

### **22. Resetear base de datos:**
```bash
docker-compose down
docker volume rm lb-premium_postgres_data
docker-compose up -d
```

## 🎯 **Flujo de Trabajo Típico**

### **Para cambios en el frontend:**
```bash
# 1. Hacer cambios en el código
# 2. Reconstruir y arrancar
docker-compose up -d --build frontend

# 3. Verificar que funcione
docker-compose ps
```

### **Para cambios en el backend:**
```bash
# 1. Hacer cambios en el código
# 2. Reconstruir y arrancar
docker-compose up -d --build backend

# 3. Verificar logs
docker-compose logs -f backend
```

### **Para problemas generales:**
```bash
# 1. Ver estado
docker-compose ps

# 2. Ver logs
docker-compose logs -f

# 3. Si no funciona, reiniciar todo
docker-compose down
docker-compose up -d --build
```

## 💡 **Consejos Útiles**

- **Usa `--build`** cuando cambies código
- **Usa `--no-cache`** si hay problemas extraños
- **Siempre verifica** con `docker-compose ps`
- **Los logs son tu mejor amigo** para debuggear
- **La base de datos se mantiene** entre reinicios (a menos que uses `-v`)

---
*Creado para el proyecto LB Premium - Sistema CRM*
