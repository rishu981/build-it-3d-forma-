import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  Tv,
  ArrowUpRight,
  Clock,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Play,
  Loader2,
} from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { billingService, adProvider } from '../services/billing/billingService';
import { CreditTransaction } from '../types/billing';
import { formatDate } from '../utils/formatters';
import { toast } from 'sonner';

export const SubscriptionPage: React.FC = () => {
  const { user, addCredits } = useUserStore();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    billingService.getTransactions().then(setTransactions);
  }, []);

  // Rewarded Ad Opt-in Flow
  const handleWatchAd = async () => {
    setIsAdPlaying(true);
    setAdCountdown(4);

    const timer = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 900);

    try {
      const result = await adProvider.showAd();
      if (result.completed && result.rewardToken) {
        const claim = await billingService.claimRewardedCredits(result.rewardToken);
        addCredits(5);
        setTransactions([claim.transaction, ...transactions]);
        toast.success('Earned +5 AI Architectural Credits!');
      }
    } catch {
      toast.error('Failed to claim ad reward');
    } finally {
      setIsAdPlaying(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Subscription & AI Credits</h1>
        <p className="text-xs text-muted mt-1">
          Manage your architectural compute quota, view transaction audits, and top up credits.
        </p>
      </div>

      {/* Credit Balance & Rewarded Ad Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Balance Card */}
        <div className="md:col-span-5 p-6 rounded-2xl border border-border bg-surface shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Available Compute Balance
              </span>
              <Badge variant="forma">{user.plan.toUpperCase()} ARCHITECT</Badge>
            </div>
            <div className="my-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono text-forma-600">
                {user.credits.balance}
              </span>
              <span className="text-xs text-muted">AI Credits</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              1 generation consumes 10 credits. Real-time copilot instructions consume 2-5 credits depending on geometric complexity.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
            <span>Total Used: {user.credits.totalUsed}</span>
            <span>Total Earned: {user.credits.totalEarned}</span>
          </div>
        </div>

        {/* Opt-In Rewarded Ad Card */}
        <div className="md:col-span-7 p-6 rounded-2xl border-2 border-dashed border-forma-300 bg-forma-50/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tv className="w-5 h-5 text-forma-600" />
              <h3 className="font-bold text-foreground text-sm">
                Opt-in Sponsor Preview (+5 Credits)
              </h3>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Watch a quick 5-second interactive partner clip to earn verified design credits for free.
              FORMA never interrupts your active drafting session with unprompted popups.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs font-medium text-forma-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 100% Optional & Safe
            </span>
            <Button
              variant="primary"
              size="sm"
              icon={<Play className="w-3.5 h-3.5 fill-white" />}
              onClick={handleWatchAd}
              isLoading={isAdPlaying}
            >
              Watch Sponsor Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Choose Your Tier</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <div className="p-6 rounded-xl border border-border bg-surface text-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-foreground">Free Explorer</h3>
              <Badge variant="outline">Current</Badge>
            </div>
            <p className="text-muted">Basic 2D floor plans and 3D WebGL viewing.</p>
            <div className="text-2xl font-bold font-mono text-foreground">$0 / mo</div>
            <ul className="space-y-2 text-muted-dark">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 10 Free AI Credits / mo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 3 Saved Projects
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Opt-in rewarded sponsor credits
              </li>
            </ul>
          </div>

          {/* Pro Architect */}
          <div className="p-6 rounded-xl border-2 border-forma-500 bg-surface text-xs space-y-4 shadow-card">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-foreground">Pro Architect</h3>
              <Badge variant="forma">Active</Badge>
            </div>
            <p className="text-muted">Full spatial AI power and multi-level CAD blueprints.</p>
            <div className="text-2xl font-bold font-mono text-foreground">$49 / mo</div>
            <ul className="space-y-2 text-muted-dark">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forma-600" /> 120 Monthly AI credits + priority pipeline
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forma-600" /> Unlimited projects & multi-level designs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forma-600" /> Full Vector CAD DXF, SVG, and PDF exports
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Credit Usage History Audit Table */}
      <div className="p-6 rounded-xl border border-border bg-surface text-left">
        <h3 className="text-sm font-semibold text-foreground mb-4">Credit Ledger & Transaction Audit</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted uppercase text-[10px] tracking-wider text-left">
                <th className="pb-2">Date & Time</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Description</th>
                <th className="pb-2 text-right">Credits</th>
                <th className="pb-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-hover/50">
                  <td className="py-2.5 text-muted font-mono">{formatDate(tx.timestamp)}</td>
                  <td className="py-2.5">
                    <Badge variant={tx.amount > 0 ? 'success' : 'outline'} size="sm">
                      {tx.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-2.5 font-medium text-foreground">{tx.description}</td>
                  <td
                    className={`py-2.5 text-right font-mono font-bold ${
                      tx.amount > 0 ? 'text-semantic-success' : 'text-foreground'
                    }`}
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </td>
                  <td className="py-2.5 text-right font-mono text-muted">{tx.balanceAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Ad Player Modal Simulation */}
      <Modal isOpen={isAdPlaying} onClose={() => {}} maxWidth="sm" showCloseButton={false}>
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-forma-50 text-forma-600 flex items-center justify-center mx-auto">
            <Tv className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Sponsor Spotlight</h3>
            <p className="text-xs text-muted mt-1">
              "Sustainable timber engineered beams by ArchWood International."
            </p>
          </div>
          <div className="p-4 bg-surface-muted rounded-xl border border-border">
            <span className="text-xs font-mono font-bold text-forma-600">
              Reward ready in {adCountdown}s...
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
