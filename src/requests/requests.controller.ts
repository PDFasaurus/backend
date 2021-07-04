import { Controller, Get, Post, Req, Query, HttpCode, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { RequestsService } from './requests.service'
import { Request } from './request.entity';
import { IPagination } from '../lib/pagination';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async findPage(@Req() request: ExpressRequest): Promise<IPagination> {
    try {
      const { query: { page } } = request;
      const currentPage: number = !page ? 0 : parseInt(page.toString());
      const req: any = request;
      const requestUser: any = req.user;
      const userId: number = requestUser.user;
      const requests: IPagination = await this.requestsService.findPage(userId, currentPage);

      return requests
    } catch(error) {
      throw(error);
    }
  }
}
