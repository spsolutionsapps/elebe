# 🔧 Guía de Configuración - LB Premium

## 📋 Resumen de Mejoras Implementadas

### ✅ **Problemas de Hardcoding Corregidos:**

1. **Docker Compose**: Ahora usa variables de entorno
2. **CORS**: Configuración dinámica para desarrollo y producción
3. **Scripts**: Detección automática de archivos .env
4. **Documentación**: Guías actualizadas

---

## 🚀 **Configuración Rápida**

### **Opción 1: Usar valores por defecto**
```bash
# Simplemente ejecuta (usa valores por defecto)
docker-compose up -d --build
```

### **Opción 2: Personalizar configuración**
```bash
# 1. Copia el archivo de ejemplo
cp env.docker.example .env

# 2. Edita .env con tus valores
nano .env  # o usa tu editor preferido

# 3. Ejecuta Docker
docker-compose up -d --build
```

---

## ⚙️ **Variables de Entorno Disponibles**

### **Base de Datos**
```bash
POSTGRES_DB=lb_premium                    # Nombre de la base de datos
POSTGRES_USER=postgres                    # Usuario de PostgreSQL
POSTGRES_PASSWORD=postgres123             # Contraseña (¡cambiar en producción!)
POSTGRES_PORT=5432                        # Puerto de PostgreSQL
DATABASE_URL=postgresql://...             # URL completa de conexión
```

### **URLs de la Aplicación**
```bash
FRONTEND_URL=http://localhost:3000        # URL del frontend
ADMIN_URL=http://localhost:3002           # URL del panel de admin
NEXT_PUBLIC_API_URL=http://localhost:3001/api  # URL de la API
```

### **Configuración del Servidor**
```bash
NODE_ENV=production                       # Entorno (production/development)
PORT=3001                                 # Puerto del backend
FRONTEND_PORT=3000                        # Puerto del frontend
```

### **Seguridad**
```bash
JWT_SECRET=your-super-secret-jwt-key      # Clave JWT (¡cambiar en producción!)
```

### **CORS Avanzado**
```bash
PRODUCTION_DOMAINS=https://tu-dominio.com,https://admin.tu-dominio.com
```

---

## 🌐 **Configuración para Producción**

### **1. Crear archivo .env para producción**
```bash
# .env para producción
POSTGRES_PASSWORD=tu-password-super-seguro
JWT_SECRET=tu-jwt-secret-muy-largo-y-seguro
FRONTEND_URL=https://tu-dominio.com
ADMIN_URL=https://admin.tu-dominio.com
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api
DATABASE_URL=postgresql://usuario:password@servidor:5432/lb_premium
PRODUCTION_DOMAINS=https://tu-dominio.com,https://admin.tu-dominio.com
```

### **2. Configurar dominio personalizado**
```bash
# En tu servidor de producción
export FRONTEND_URL=https://tu-dominio.com
export ADMIN_URL=https://admin.tu-dominio.com
export NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api
export PRODUCTION_DOMAINS=https://tu-dominio.com,https://admin.tu-dominio.com
```

---

## 🔒 **Mejoras de Seguridad Implementadas**

### **1. CORS Dinámico**
- ✅ Desarrollo: Permite cualquier puerto localhost
- ✅ Producción: Solo dominios específicos
- ✅ Configuración flexible via variables de entorno

### **2. Variables de Entorno**
- ✅ Contraseñas configurables
- ✅ URLs dinámicas
- ✅ Configuración por entorno

### **3. Headers de Seguridad**
- ✅ Métodos HTTP específicos
- ✅ Headers permitidos controlados
- ✅ Credenciales configuradas

---

## 🛠️ **Comandos Útiles**

### **Desarrollo**
```bash
# Iniciar con configuración personalizada
cp env.docker.example .env
# Editar .env
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Reiniciar servicios
docker-compose restart
```

### **Producción**
```bash
# Configurar variables de entorno
export POSTGRES_PASSWORD=password-seguro
export JWT_SECRET=jwt-secret-muy-largo
export FRONTEND_URL=https://tu-dominio.com

# Iniciar servicios
docker-compose up -d --build
```

---

## 📊 **Monitoreo y Logs**

### **Ver estado de servicios**
```bash
docker-compose ps
```

### **Ver logs en tiempo real**
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo base de datos
docker-compose logs -f postgres
```

### **Verificar configuración CORS**
```bash
# Los logs del backend mostrarán:
# 🌐 CORS enabled for origins: http://localhost:3000, http://localhost:3002
```

---

## 🚨 **Troubleshooting**

### **Problema: Servicios no inician**
```bash
# Verificar archivo .env
cat .env

# Ver logs de error
docker-compose logs

# Reconstruir desde cero
docker-compose down
docker-compose up -d --build
```

### **Problema: CORS errors**
```bash
# Verificar variables de entorno
echo $FRONTEND_URL
echo $ADMIN_URL

# Verificar logs del backend
docker-compose logs backend | grep CORS
```

### **Problema: Base de datos no conecta**
```bash
# Verificar variables de base de datos
echo $DATABASE_URL
echo $POSTGRES_PASSWORD

# Ver logs de PostgreSQL
docker-compose logs postgres
```

---

## ✅ **Checklist de Configuración**

### **Desarrollo**
- [ ] Docker instalado y funcionando
- [ ] Archivo .env creado (opcional)
- [ ] Servicios iniciados con `docker-compose up -d`
- [ ] Frontend accesible en http://localhost:3000
- [ ] Backend accesible en http://localhost:3001/api

### **Producción**
- [ ] Contraseñas seguras configuradas
- [ ] JWT_SECRET cambiado
- [ ] URLs de producción configuradas
- [ ] PRODUCTION_DOMAINS configurado
- [ ] Certificados SSL configurados
- [ ] Firewall configurado
- [ ] Backup de base de datos configurado

---

## 🎯 **Próximos Pasos**

1. **Configurar dominio personalizado** (cuando esté listo para producción)
2. **Implementar SSL/HTTPS** (certificados)
3. **Configurar backup automático** de base de datos
4. **Implementar monitoreo** (logs, métricas)
5. **Configurar CI/CD** para despliegues automáticos

---

**¡Tu aplicación ahora está configurada de manera profesional y segura!** 🚀
