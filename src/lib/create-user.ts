import { User } from '../users/user.entity'
import { Template } from '../templates/template.entity';

export interface ICreateUser {
  name: string,
  password: string,
  email: string,
  resetKey?: string,
  apiKey: string,
}
