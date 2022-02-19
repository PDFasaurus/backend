import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { Request } from './request.entity';
import { IPagination, PAGE_SIZE } from '../lib/pagination';
import { ICreateRequest } from '../lib/create-request';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request) private requestsRepository: Repository<Request>,
  ) {}

  async findPage(userId: string, page?: number): Promise<IPagination> {
    const internalPage = page || 0
    const [results, total] = await this.requestsRepository.findAndCount({
      where: { user: userId },
      relations: ['template'],
      take: PAGE_SIZE,
      skip: internalPage * PAGE_SIZE,
    })

    const pagination: IPagination = { results, total };
    return pagination;
  }

  async create(request: ICreateRequest): Promise<Request> {
    return await this.requestsRepository.save(request);
  }

  async totalForMonth(start: string, end: string): Promise<any> {
    return await this.requestsRepository
      .createQueryBuilder("request")
      .select("COUNT(*) as count")
      .where(`("request"."created_at" >= '${start}')`)
      .andWhere(`("request"."created_at" < '${end}')`)
      .getRawOne()
  }
}
