import { CreditTransaction, UserCredits } from '../../types/billing';
import { MOCK_CREDIT_TRANSACTIONS, MOCK_USER } from '../../mock/mockData';
import { apiClient, USE_MOCK_API } from '../api/client';

export interface RewardedAdProviderAdapter {
  isAvailable(): Promise<boolean>;
  loadAd(): Promise<void>;
  showAd(): Promise<{ completed: boolean; rewardToken?: string }>;
}

// Concrete mock implementation of future ad SDK adapter (e.g. Google AdSense / Unity / AdMob for Web)
export class MockRewardedAdAdapter implements RewardedAdProviderAdapter {
  private loaded = false;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async loadAd(): Promise<void> {
    await new Promise((r) => setTimeout(r, 600));
    this.loaded = true;
  }

  async showAd(): Promise<{ completed: boolean; rewardToken?: string }> {
    if (!this.loaded) {
      await this.loadAd();
    }
    // Simulate user watching 5 seconds of an interactive sponsor clip
    await new Promise((r) => setTimeout(r, 3500));
    this.loaded = false;
    return {
      completed: true,
      rewardToken: `reward_tok_${Date.now()}_verified`,
    };
  }
}

export const adProvider = new MockRewardedAdAdapter();

export const billingService = {
  async getCredits(): Promise<UserCredits> {
    if (USE_MOCK_API) {
      return MOCK_USER.credits;
    }
    const { data } = await apiClient.get<UserCredits>('/credits');
    return data;
  },

  async getTransactions(): Promise<CreditTransaction[]> {
    if (USE_MOCK_API) {
      return MOCK_CREDIT_TRANSACTIONS;
    }
    const { data } = await apiClient.get<CreditTransaction[]>('/credits/history');
    return data;
  },

  async claimRewardedCredits(rewardToken: string): Promise<{ newBalance: number; transaction: CreditTransaction }> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 400));
      const amount = 5;
      MOCK_USER.credits.balance += amount;
      MOCK_USER.credits.totalEarned += amount;

      const tx: CreditTransaction = {
        id: `tx_ad_${Date.now()}`,
        type: 'rewarded_ad',
        amount,
        description: 'Earned 5 AI Credits via Opt-in Sponsor View',
        timestamp: new Date().toISOString(),
        balanceAfter: MOCK_USER.credits.balance,
      };

      MOCK_CREDIT_TRANSACTIONS.unshift(tx);
      return {
        newBalance: MOCK_USER.credits.balance,
        transaction: tx,
      };
    }

    const { data } = await apiClient.post<{ newBalance: number; transaction: CreditTransaction }>('/credits/reward', {
      rewardToken,
    });
    return data;
  },
};
