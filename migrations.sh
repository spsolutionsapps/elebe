#!/bin/bash
set -e  # Stop on any error
 

# Create backup
echo "💾 Creating database backup..."
docker exec lb-premium-db pg_dump -U postgres lb_premium > /tmp/backup-$(date +%Y%m%d-%H%M%S).sql || echo "⚠️ Backup failed, continuing..."

# Apply migrations
echo "🚀 Applying database migrations..."
docker exec lb-premium-backend npx prisma migrate deploy --schema=prisma/schema.prisma
docker exec lb-premium-backend npx prisma generate        --schema=prisma/schema.prisma

 
 

echo "✅ Migrations applied successfully!"

# Restaurar datos desde backup
#docker exec -i lb-premium-db psql -U postgres -d lb_premium < /tmp/backup-