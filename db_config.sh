docker exec lb-premium-db pg_dump -U postgres lb_premium > /tmp/backup-$(date +%Y%m%d-%H%M%S).sql 
docker exec  lb-premium-backend npm run db:migrate
docker exec  lb-premium-backend npm run db:seed
