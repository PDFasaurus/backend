import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult, MoreThan, LessThan } from 'typeorm';
import { User } from './user.entity';
import { IUpdateUserKey } from '../lib/update-user-key';
import { ICreateUser } from 'src/lib/create-user';
import { hash, compare } from 'bcryptjs';
import * as moment from "moment";
import { Request } from '../requests/request.entity';
import { IUserSubscription } from '../lib/user-subscription';
import { Subscription } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findOneWithSubscriptionId(subscriptionId: number): Promise<User> {
    return await this.usersRepository.findOne({ subscriptionId });
  }

  async findOneWithEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ email });
  }

  async findOneWithEmailAndResetToken(email: string, resetToken: string): Promise<User> {
    return await this.usersRepository.findOne({ email, resetToken });
  }

  async findOneWithApiKey(apiKey: string): Promise<User> {
    return await this.usersRepository.findOne({ apiKey });
  }

  async findOneWithApiKeyWithRequests(apiKey: string): Promise<any> {
    /**
      https://typeorm.io/#/select-query-builder/inner-and-left-joins

      SELECT *
      FROM "user"
      INNER JOIN "request"
      ON "request"."userId" = "user"."id"
      WHERE "request"."created_at" >= CURRENT_TIMESTAMP
      AND "request"."created_at" < CURRENT_TIMESTAMP
      AND "user"."apiKey"='afb05112-ebf5-44f4-8580-9d729a14b42a';

      This should be working - but is not returning any REQUEST records
    */

    const start = moment().startOf("month").format("YYYY-MM-DD hh:mm:ss");
    const end = moment().endOf("month").format("YYYY-MM-DD hh:mm:ss");
    const res = await this.usersRepository.createQueryBuilder("u")
      .select("*")
      .innerJoin(Request, "r", "\"r\".\"userId\" = \"u\".\"id\"")
      .where(`("r"."created_at" >= '${start}')`)
      .andWhere(`("r"."created_at" < '${end}')`)
      .where("\"u\".\"apiKey\" = :apiKey", { apiKey })
      .getMany()

    return res
  }

  async updateApiKey(user: IUpdateUserKey): Promise<UpdateResult> {
    return await this.usersRepository.update(user.id, user);
  }

  async update(user: User): Promise<UpdateResult> {
    if (user.password) user.password = await hash(user.password, 10);

    return await this.usersRepository.update(user.id, user);
  }

  async cancelSubscription(userId: number): Promise<UpdateResult> {
    return await this.usersRepository.update(userId, { plan: 0, balance: 0 });
  }

  async updateSubscriptionPlan(userId: number, plan: number, balance: number): Promise<UpdateResult> {
    return await this.usersRepository.update(userId, { plan, balance });
  }

  async updateSubscription(userId: number, subscription: IUserSubscription): Promise<UpdateResult> {
    return await this.usersRepository.update(userId, subscription);
  }

  async create(user: ICreateUser): Promise<User> {
    user.password = await hash(user.password, 10);

    return await this.usersRepository.save(user);
  }
}
