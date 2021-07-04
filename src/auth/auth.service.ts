import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { hash, compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { send, setApiKey } from '@sendgrid/mail';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
    setApiKey(process.env.SENDGRID_API_KEY);
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findOneWithEmail(email);

      if (!user) throw('Not found')

      const isEqual = await compare(password, user.password)

      if (isEqual) return user

      throw('Not vaild')
    } catch (e) {
      throw(e)
    }
  }

  async authenticate(user: User): Promise<any> {
    if (!user) throw('Not found')

    return {
      access_token: this.jwtService.sign({ email: user.email, sub: user.id })
    }
  }

  async reset(email: string): Promise<User> {
    try {
      const token = uuidv4();
      const user = await this.usersService.findOneWithEmail(email);
      if (!user) throw('Not found');

      await send({
        to: user.email,
        from: 'support@pdfasaurus.com',
        text: 'template',
        html: 'template',
        templateId: 'd-9761a7e7551b415cb4b4490457f7c360',
        dynamicTemplateData: { token }
      });

      user.resetToken = token
      this.usersService.update(user);
      return user;
    } catch (e) {
      throw(e)
    }
  }

  async update(email: string, resetToken:string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findOneWithEmailAndResetToken(email, resetToken);
      if (!user) throw('Not found');
      user.password = password;
      this.usersService.update(user);
      return user;
    } catch (e) {
      throw(e)
    }
  }
 }
