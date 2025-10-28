# frontend/Dockerfile
FROM node:20-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependencias basadas en el gestor de paquetes preferido
COPY package.json ./
RUN npm install --legacy-peer-deps --only=production

# Reconstruir el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Construir la aplicación
RUN npm run build

# Imagen de producción, copiar todos los archivos y ejecutar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar solo las dependencias de producción
COPY --from=deps /app/node_modules ./node_modules

# Copiar archivos de construcción
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copiar archivos públicos
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copiar package.json para scripts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]
