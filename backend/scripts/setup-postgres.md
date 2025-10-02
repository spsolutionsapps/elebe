# 🔐 CONFIGURACIÓN DE POSTGRESQL

## 📋 PASOS PARA CONFIGURAR POSTGRESQL:

### 1. **Abrir pgAdmin (Interfaz gráfica)**
- Buscar "pgAdmin" en el menú de Windows
- Abrir pgAdmin 4

### 2. **Conectar al servidor**
- Click derecho en "Servers" → "Register" → "Server"
- **Name**: `localhost`
- **Host**: `localhost`
- **Port**: `5432`
- **Username**: `postgres`
- **Password**: [Tu contraseña actual]

### 3. **Cambiar la contraseña de postgres**
- Click derecho en "postgres" → "Properties"
- **Password**: Cambiar a `password`
- **Save password**: ✅ Marcar

### 4. **Crear la base de datos**
- Click derecho en "Databases" → "Create" → "Database"
- **Database**: `lb_premium`
- **Owner**: `postgres`
- Click en "Save"

### 5. **Verificar la conexión**
- Ejecutar: `node scripts/create-db.js`
- Debería mostrar: "Base de datos lb_premium creada exitosamente"

## 🔧 ALTERNATIVA: Usar SQLite temporalmente

Si prefieres no configurar PostgreSQL ahora, podemos usar SQLite:

```bash
# Cambiar en prisma/schema.prisma:
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

## 📞 ¿NECESITAS AYUDA?

1. **¿Tienes pgAdmin instalado?**
2. **¿Recuerdas la contraseña de postgres?**
3. **¿Prefieres usar SQLite temporalmente?**

¡Dime qué prefieres hacer!
