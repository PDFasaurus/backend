import { User } from '../users/user.entity'
import { Template } from '../templates/template.entity';

export interface ICreateRequest {
  apiKey: string,
  template: Template,
  user: User,
}
