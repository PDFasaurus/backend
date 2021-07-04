
import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { ICreateUser } from 'src/lib/create-user';
import { v4 as uuidv4 } from 'uuid';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('login')
  async login(@Request() req, @Body() body) {
    try {
      const { email, password } = body;
      const user: User = await this.authService.validateUser(email, password);
      return await this.authService.authenticate(user);
    } catch (e) {
      throw(e)
    }
  }

  @Post('signup')
  async signup(@Request() req, @Body() body) {
    try {
      const { email, name, password } = body;
      const newUser: ICreateUser = {
        email,
        name,
        password,
        apiKey: uuidv4()
      }
      return this.usersService.create(newUser)
    } catch (e) {
      throw(e)
    }
  }

  @Post('reset')
  async reset(@Request() req, @Body() body) {
    try {
      const { email } = body;

      return this.authService.reset(email);
    } catch (e) {
      throw(e)
    }
  }

  @Post('update')
  async update(@Request() req, @Body() body) {
    try {
      const { email, resetToken, password } = body;

      return this.authService.update(email, resetToken, password);
    } catch (e) {
      throw(e)
    }
  }
}
