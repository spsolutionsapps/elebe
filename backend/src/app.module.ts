import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { SlidesModule } from './slides/slides.module';
import { AboutModule } from './about/about.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { ClientsModule } from './clients/clients.module';
import { RemindersModule } from './reminders/reminders.module';
import { TasksModule } from './tasks/tasks.module';
import { UploadModule } from './upload/upload.module';
import { TestModule } from './test/test.module';
import { BrandsModule } from './brands/brands.module';
import { CartModule } from './cart/cart.module';
import { HealthModule } from './health/health.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CacheModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    ServicesModule,
    SlidesModule,
    AboutModule,
    InquiriesModule,
    ClientsModule,
    RemindersModule,
    TasksModule,
    UploadModule,
    TestModule,
    BrandsModule,
    CartModule,
    HealthModule,
    CategoriesModule,
  ],
})
export class AppModule {}
