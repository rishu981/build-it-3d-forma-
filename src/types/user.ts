import { SubscriptionPlan, UserCredits } from './billing';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: SubscriptionPlan;
  credits: UserCredits;
  companyName?: string;
  role?: string;
  createdAt: string;
}
