import { User } from '../users/user.entity';

export const user: User = <User>{
  id: "3e8b241f-cec1-4a69-aa4c-c8b3403f9b4d",
  name: "Jo du Plessis",
  password: "",
  email: "jo@joduplessis.com",
  resetToken: "",
  plan: 1,
  subscriptionId: 1,
  balance: 100,
  cancelUrl: "",
  updateUrl: "",
  nextBillDate: new Date(),
  lastPaymentDate: new Date(),
  apiKey: "",
  isActive: true,
  templates: [],
  requests: [],
  created_at: new Date(),
  updated_at: new Date(),
};
