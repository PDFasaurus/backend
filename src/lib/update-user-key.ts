import { User } from '../users/user.entity'
import { Template } from '../templates/template.entity';

export interface IUpdateUserKey {
  id: number,
  apiKey: string,
}
