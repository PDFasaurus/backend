import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { UsersModule } from '../users/users.module';
import { TemplatesModule } from '../templates/templates.module';
import { RequestsModule } from '../requests/requests.module';
import { UsersService } from '../users/users.service';
import { TemplatesService } from '../templates/templates.service';
import { RequestsService } from '../requests/requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from '../templates/template.entity';
import { Request } from '../requests/request.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    UsersModule,
    TemplatesModule,
    RequestsModule,
    TypeOrmModule.forFeature([User, Template, Request]),
  ],
  controllers: [WebhookController],
  providers: [
    UsersService,
    TemplatesService,
    RequestsService,
    WebhookService
  ]
})
export class WebhookModule {}
