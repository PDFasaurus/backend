import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Template } from './template.entity';
import { ICreateTemplate } from '../lib/create-template';
import { IUpdateTemplate } from 'src/lib/update-template';
import { User } from 'src/users/user.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templatesRepository: Repository<Template>,
  ) {}

  async findAll(user: Partial<User>): Promise<Template[]> {
    return await this.templatesRepository.find({ deleted: false, user });
  }

  async findOneWithUuid(uuid: string): Promise<Template> {
    return await this.templatesRepository.findOne({ uuid });
  }

  async findOne(id: string): Promise<Template> {
    return await this.templatesRepository.findOne(id);
  }

  async create(template: ICreateTemplate): Promise<Template> {
    return await this.templatesRepository.save(template);
  }

  async update(template: IUpdateTemplate): Promise<UpdateResult> {
    return await this.templatesRepository.update(template.id, template);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.templatesRepository.delete(id);
  }
}
