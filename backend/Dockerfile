# backend/Dockerfile
FROM node:20-alpine

# Instalar dependencias del sistema
# Incluye dependencias para sharp (conversión de imágenes a WebP)
RUN apk add --no-cache \
    openssl \
    vips-dev \
    vips-tools \
    python3 \
    make \
    g++

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias (incluyendo devDependencies para build)
RUN npm install

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar código fuente
COPY src ./src
COPY scripts ./scripts
COPY tsconfig.json ./
COPY nest-cli.json ./

# Compilar el código TypeScript
RUN npm run build

# Limpiar node_modules y reinstalar solo production
RUN rm -rf node_modules && npm install --only=production

# Crear directorio para uploads
RUN mkdir -p uploads

# Exponer puerto
EXPOSE 3001

# Comando de inicio
CMD ["node", "dist/main.js"]