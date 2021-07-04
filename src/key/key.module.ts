import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from '../templates/template.entity';
import { TemplatesService } from '../templates/templates.service';
import { Request } from '../requests/request.entity';
import { RequestsService } from '../requests/requests.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { KeyController } from './key.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Template, Request])],
  controllers: [KeyController],
  providers: [
    TemplatesService,
    RequestsService,
    UsersService
  ]
})
export class KeyModule {}
