import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS with dynamic configuration
  const corsOrigins: (string | RegExp)[] = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3002',
  ];

  // Add production domains if specified
  if (process.env.PRODUCTION_DOMAINS) {
    const productionDomains = process.env.PRODUCTION_DOMAINS.split(',').map(domain => domain.trim());
    corsOrigins.push(...productionDomains);
  }

  // In development, allow any localhost port
  if (process.env.NODE_ENV !== 'production') {
    corsOrigins.push(/^http:\/\/localhost:\d+$/);
  }

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Fashion Style API')
    .setDescription('API para el sistema CRM de Fashion Style')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Fashion Style API running on port ${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);
  console.log(`🌐 CORS enabled for origins: ${corsOrigins.join(', ')}`);
}

bootstrap();
