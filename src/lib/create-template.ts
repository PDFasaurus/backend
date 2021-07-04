import { User } from '../users/user.entity'
import { Template } from '../templates/template.entity';

export interface ICreateTemplate {
  name: string,
  uuid: string,
  content: string,
  user: Partial<User>,
}
