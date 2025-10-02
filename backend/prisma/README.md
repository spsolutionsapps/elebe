# Prisma ORM

Este directorio contiene la configuración de Prisma ORM para la base de datos.

## schema.prisma

Esquema principal de la base de datos con todos los modelos.

### Modelos

#### User
- Administradores del sistema
- Autenticación con NextAuth

#### Slide
- Imágenes del slider principal
- Título, subtítulo, descripción opcionales
- Orden de visualización

#### Product
- Productos del catálogo
- Nombre, descripción, precio opcional, imagen

#### Service
- Servicios ofrecidos
- Nombre, descripción, imagen opcional

#### About
- Contenido de la sección "Nosotros"
- Título, contenido HTML, imágenes

#### Inquiry
- Consultas de productos
- Datos del cliente + productos seleccionados

#### InquiryProduct
- Relación entre consultas y productos
- Cantidad de cada producto

## Comandos Útiles

```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Ver base de datos
npx prisma studio

# Resetear base de datos
npx prisma migrate reset
```

## Configuración

La base de datos se configura mediante la variable de entorno `DATABASE_URL` en el archivo `.env`.
