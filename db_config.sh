#!/bin/bash
set -e  # Stop on any error

echo "🔄 Starting database configuration..."

# Create backup
echo "💾 Creating database backup..."
docker exec lb-premium-db pg_dump -U postgres lb_premium > /tmp/backup-$(date +%Y%m%d-%H%M%S).sql || echo "⚠️ Backup failed, continuing..."

# Apply migrations
echo "🚀 Applying database migrations..."
docker exec lb-premium-backend npm run db:migrate

# Seed database
echo "🌱 Seeding database..."
docker exec lb-premium-backend npm run db:seed

echo "✅ Database configuration completed successfully!"

# Restaurar datos desde backup
#docker exec -i lb-premium-db psql -U postgres -d lb_premium < /tmp/backup-