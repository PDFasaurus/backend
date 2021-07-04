import { User } from '../users/user.entity'
import { Template } from '../templates/template.entity';

export interface IUserSubscription {
  cancelUrl?: string;
  updateUrl?: string;
  balance?: number;
  plan?: number;
  lastPaymentDate?: Date;
  nextBillDate?: Date;
  subscriptionId?: number,
}
