# Librerías y Utilidades

Este directorio contiene configuraciones y utilidades del proyecto.

## auth.ts

Configuración de NextAuth.js para autenticación.

### Características

- Autenticación por credenciales (email/password)
- Integración con Prisma
- Encriptación de contraseñas con bcrypt
- Manejo de sesiones JWT

## prisma.ts

Instancia de Prisma Client para conexión a la base de datos.

### Características

- Singleton pattern para evitar múltiples conexiones
- Configuración para desarrollo y producción

## email.ts

Utilidades para envío de emails con Nodemailer.

### Funciones

- `sendEmail()`: Envía emails usando SMTP
- `generateInquiryEmail()`: Genera HTML para emails de consulta

## utils.ts

Utilidades generales del proyecto.

### Funciones

- `cn()`: Función para combinar clases de TailwindCSS
