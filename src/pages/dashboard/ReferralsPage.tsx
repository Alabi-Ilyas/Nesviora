import { useState, useEffect } from 'react';
import { Users, Copy, Check, Gift, TrendingUp, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Card } from '@/components/ui/StatCard';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/States';
import { referralService } from '@/services';
import type { Referral } from '@/types';
import { formatCurrency, formatDate, capitalize, getStatusColor, copyToClipboard } from '@/utils';

export function ReferralsPage() {
  const { user } = useAuth();
  const { success } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    referralService.getReferrals(user?.id || '').then((data) => {
      setReferrals(data);
      setLoading(false);
    });
  }, [user]);

  const referralLink = `https://nesviora.io/register?ref=${user?.referralCode || ''}`;
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter((r) => r.status === 'completed').length;
  const totalRewards = referrals.reduce((s, r) => s + r.reward, 0);

  const handleCopy = async (text: string, type: 'code' | 'link') => {
    await copyToClipboard(text);
    setCopied(true);
    success(`${type === 'code' ? 'Referral code' : 'Referral link'} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const columns: Column<Referral>[] = [
    { key: 'refereeName', header: 'Referred User', sortable: true, sortValue: (r) => r.refereeName, render: (r) => <span className="text-vaulta-text">{r.refereeName}</span> },
    { key: 'createdAt', header: 'Date', sortable: true, sortValue: (r) => r.createdAt, render: (r) => <span className="text-vaulta-muted text-xs">{formatDate(r.createdAt)}</span> },
    { key: 'reward', header: 'Reward', sortable: true, sortValue: (r) => r.reward, render: (r) => <span className="font-semibold text-vaulta-spring-dark dark:text-vaulta-spring">{formatCurrency(r.reward)}</span> },
    { key: 'status', header: 'Status', sortable: true, sortValue: (r) => r.status, render: (r) => <span className={`badge ${getStatusColor(r.status)}`}>{capitalize(r.status)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">Referrals</h1>
        <p className="mt-1 text-sm text-vaulta-muted">Invite friends and earn rewards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><div className="flex items-center justify-between"><div><p className="text-sm text-vaulta-muted">Total Referrals</p><h3 className="mt-1 text-2xl font-bold text-vaulta-text">{totalReferrals}</h3></div><Users size={21} className="text-vaulta-cerulean" /></div></Card>
        <Card><div className="flex items-center justify-between"><div><p className="text-sm text-vaulta-muted">Active Referrals</p><h3 className="mt-1 text-2xl font-bold text-vaulta-text">{activeReferrals}</h3></div><TrendingUp size={21} className="text-vaulta-spring-dark dark:text-vaulta-spring" /></div></Card>
        <Card><div className="flex items-center justify-between"><div><p className="text-sm text-vaulta-muted">Total Rewards</p><h3 className="mt-1 text-2xl font-bold text-vaulta-text">{formatCurrency(totalRewards)}</h3></div><Gift size={21} className="text-vaulta-orange" /></div></Card>
      </div>

      {/* Referral code & link */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-vaulta-text mb-4">Your Referral Code</h2>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg px-4 py-3">
              <code className="text-lg font-bold text-vaulta-cerulean">{user?.referralCode}</code>
            </div>
            <button onClick={() => handleCopy(user?.referralCode || '', 'code')} className="rounded-lg border border-vaulta-border p-3 text-vaulta-muted hover:border-vaulta-cerulean hover:text-vaulta-cerulean transition-colors">
              {copied ? <Check size={18} className="text-vaulta-spring-dark dark:text-vaulta-spring" /> : <Copy size={18} />}
            </button>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold text-vaulta-text mb-4">Referral Link</h2>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg px-4 py-3">
              <code className="text-sm text-vaulta-text truncate block">{referralLink}</code>
            </div>
            <button onClick={() => handleCopy(referralLink, 'link')} className="rounded-lg border border-vaulta-border p-3 text-vaulta-muted hover:border-vaulta-cerulean hover:text-vaulta-cerulean transition-colors">
              {copied ? <Check size={18} className="text-vaulta-spring-dark dark:text-vaulta-spring" /> : <LinkIcon size={18} />}
            </button>
          </div>
        </Card>
      </div>

      {/* How it works */}
      <Card>
        <h2 className="font-semibold text-vaulta-text mb-4">How Referrals Work</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { step: '1', title: 'Share Your Link', desc: 'Send your referral link to friends and family.' },
            { step: '2', title: 'They Sign Up', desc: 'When they create an account using your link, they become your referral.' },
            { step: '3', title: 'You Earn Rewards', desc: 'Get $25 for each referral who completes KYC verification.' },
          ].map((item) => (
            <div key={item.step} className="rounded-lg border border-vaulta-border p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vaulta-cerulean text-white text-sm font-bold">{item.step}</div>
              <h3 className="mt-3 text-sm font-semibold text-vaulta-text">{item.title}</h3>
              <p className="mt-1 text-xs text-vaulta-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Referral history */}
      <Card>
        <h2 className="font-semibold text-vaulta-text mb-4">Referral History</h2>
        {loading ? (
          <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 skeleton rounded" />)}</div>
        ) : referrals.length === 0 ? (
          <EmptyState icon={Users} title="No referrals yet" message="Share your referral link to start earning rewards." />
        ) : (
          <DataTable columns={columns} data={referrals} pageSize={10} exportable exportFilename="referrals" />
        )}
      </Card>
    </div>
  );
}
