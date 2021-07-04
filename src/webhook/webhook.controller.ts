import { Controller, Post, Put, Delete, Req, HttpCode, Body } from '@nestjs/common';
import { TemplatesService } from '../templates/templates.service';
import { RequestsService } from '../requests/requests.service';
import { WebhookService } from './webhook.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { IUserSubscription } from '../lib/user-subscription';
import * as moment from "moment";

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async subscription(@Body() body: any): Promise<any> {
    try {
      switch (body.alert_name) {
        case 'subscription_payment_succeeded':
          await this.subscriptionPaymentSucceeded(body);
          break;
        case 'subscription_created':
          await this.subscriptionCreated(body);
          break;
        case 'subscription_cancelled':
          await this.subscriptionCancelled(body);
          break;
      }

      return { success: true };
    } catch(error) {
      throw(error)
    }
  }

  async subscriptionPaymentSucceeded(body: any): Promise<boolean> {
    try {
      const { email, quantity, next_bill_date } = body;
      const user: User = await this.usersService.findOneWithEmail(email);
      const requestLimit: number = Number(process.env.PLAN_LIMIT_INCREMENT) * parseInt(quantity);
      const currentBalance = user.balance || 0;
      const newBalance = requestLimit - currentBalance;
      const subscription: IUserSubscription = {
        balance: newBalance,
        lastPaymentDate: moment().toDate(),
        nextBillDate: moment(next_bill_date).toDate(),
        plan: parseInt(quantity),
      }

      await this.usersService.updateSubscription(user.id, subscription);

      return true
    } catch(error) {
      throw(error)
    }
  }

  async subscriptionCreated(body: any): Promise<boolean> {
    try {
      const { email, cancel_url, update_url, subscription_id, next_bill_date } = body;
      const user: User = await this.usersService.findOneWithEmail(email);
      const subscription: IUserSubscription = {
        cancelUrl: cancel_url,
        updateUrl: update_url,
        subscriptionId: subscription_id,
        lastPaymentDate: moment().toDate(),
        nextBillDate: moment(next_bill_date).toDate(),
      }

      await this.usersService.updateSubscription(user.id, subscription);

      return true
    } catch(error) {
      throw(error)
    }
  }

  async subscriptionCancelled(body: any): Promise<boolean> {
    const { subscription_id } = body
    const user: User = await this.usersService.findOneWithSubscriptionId(Number(subscription_id))
    const userId: number = Number(user.id);
    await this.usersService.cancelSubscription(userId)
    return true;
  }
}
