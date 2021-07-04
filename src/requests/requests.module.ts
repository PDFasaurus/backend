import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { Request } from './request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  providers: [RequestsService],
  controllers: [RequestsController]
})
export class RequestsModule {}
