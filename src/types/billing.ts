export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export interface PlanFeature {
  name: string;
  includedInFree: boolean;
  includedInPro: boolean;
  tooltip?: string;
}

export interface CreditTransaction {
  id: string;
  type: 'generation' | 'modification' | 'bonus' | 'purchase' | 'rewarded_ad';
  amount: number; // negative for usage, positive for gain
  description: string;
  timestamp: string;
  balanceAfter: number;
}

export interface UserCredits {
  balance: number;
  totalEarned: number;
  totalUsed: number;
  freeGenerationsRemaining: number;
}
