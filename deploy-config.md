# Configuración de Deployment Automático con Migraciones

## 1. Configurar GitHub Secrets

En tu repositorio de GitHub, ve a Settings > Secrets and variables > Actions y agrega:

- `DATABASE_URL`: Tu URL de conexión a la base de datos de producción
  ```
  postgresql://usuario:password@host:puerto/database
  ```

## 2. Configurar el Webhook en Digital Ocean

### Opción A: Usando GitHub Actions (Recomendado)

El workflow `.github/workflows/deploy-migrations.yml` se ejecutará automáticamente cuando:
- Hagas push a `main` o `master`
- Modifiques archivos en `backend/prisma/migrations/` o `backend/prisma/schema.prisma`

### Opción B: Usando Script Post-Deploy

1. **En tu servidor de Digital Ocean**, agrega este script a tu proceso de deployment:

```bash
# Agregar al final de tu script de deployment
cd /ruta/a/tu/proyecto/elebe
chmod +x scripts/post-deploy-migrations.sh
./scripts/post-deploy-migrations.sh
```

2. **O si usas PowerShell en Windows Server**:
```powershell
cd C:\ruta\a\tu\proyecto\elebe
.\scripts\post-deploy-migrations.ps1
```

## 3. Configurar el Webhook de GitHub

En tu repositorio de GitHub:
1. Ve a Settings > Webhooks
2. Agrega un nuevo webhook con:
   - **Payload URL**: `https://tu-servidor.com/webhook/deploy`
   - **Content type**: `application/json`
   - **Events**: Solo `Push events`

## 4. Script de Webhook en tu servidor

Crea un endpoint en tu servidor que reciba el webhook:

```javascript
// webhook-deploy.js
const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

app.post('/webhook/deploy', (req, res) => {
    console.log('Webhook recibido, ejecutando migraciones...');
    
    exec('cd /ruta/a/tu/proyecto/elebe && ./scripts/post-deploy-migrations.sh', 
         (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).send('Error en deployment');
        }
        console.log('Migraciones aplicadas:', stdout);
        res.status(200).send('Deployment exitoso');
    });
});

app.listen(3001, () => {
    console.log('Webhook server running on port 3001');
});
```

## 5. Verificación

Después de configurar todo:

1. **Haz un commit** con cambios en el esquema de Prisma
2. **Push a GitHub**
3. **Verifica** que el workflow se ejecute en GitHub Actions
4. **Comprueba** que las migraciones se apliquen en producción

## 6. Monitoreo

Para verificar que todo funciona:

```bash
# En tu servidor de producción
cd /ruta/a/tu/proyecto/elebe/backend
npx prisma migrate status
```

## 7. Rollback (si es necesario)

Si algo sale mal, puedes hacer rollback:

```bash
# Ver migraciones aplicadas
npx prisma migrate status

# Hacer rollback a una migración específica
npx prisma migrate resolve --rolled-back 20250115_add_category_table
```
