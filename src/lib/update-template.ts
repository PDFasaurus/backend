import { User } from '../users/user.entity'
import { Template } from '../templates/template.entity';

export interface IUpdateTemplate {
  id: string,
  name: string,
  content: string,
  deleted: boolean,
}
