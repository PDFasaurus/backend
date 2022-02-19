import { Controller, Get, Post, Put, Delete, Req, HttpCode, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { IUpdateUserKey } from '../lib/update-user-key';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('key')
export class KeyController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  async key(@Req() request: ExpressRequest, @Headers('authorization') authorization: string): Promise<any> {
    try {
      const req: any = request;
      const requestUser: any = req.user;
      const userId: string = requestUser.user;
      const { apiKey } = await this.usersService.findOne(userId);

      return { apiKey }
    } catch(error) {
      throw(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('new')
  @HttpCode(200)
  async newKey(@Req() request: ExpressRequest, @Headers('authorization') authorization: string): Promise<any> {
    try {
      const req: any = request;
      const requestUser: any = req.user;
      const userId: string = requestUser.user;
      const newKey = uuidv4();
      const updateUserKey: IUpdateUserKey = {
        id: userId,
        apiKey: newKey,
      }

      await this.usersService.updateApiKey(updateUserKey);

      return { newKey }
    } catch(error) {
      throw(error)
    }
  }
}
