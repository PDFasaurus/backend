import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TemplatesModule } from './templates/templates.module';
import { RequestsModule } from './requests/requests.module';
import { GenerateModule } from './generate/generate.module';
import { KeyModule } from './key/key.module';
import { AuthModule } from './auth/auth.module';
import { WebhookModule } from './webhook/webhook.module';
import { RavenModule, RavenInterceptor } from 'nest-raven';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    RavenModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true, // should be false for Migrations
      logging: process.env.NODE_ENV != 'production',
      ssl: false, //process.env.NODE_ENV == 'production' ? { rejectUnauthorized: false } : false,
    }),
    UsersModule,
    TemplatesModule,
    RequestsModule,
    GenerateModule,
    KeyModule,
    AuthModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
  ],
})
export class AppModule {}
