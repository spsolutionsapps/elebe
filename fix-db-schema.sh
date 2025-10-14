#!/bin/bash

echo "🔧 Fixing database schema - adding missing views column..."

# Apply the SQL fix to add the missing views column
docker exec lb-premium-backend psql $DATABASE_URL -f /app/fix_views_column.sql

echo "✅ Database schema fix completed!"

# Now run the original db_config.sh
echo "🌱 Running database migration and seeding..."
sh db_config.sh
