import { useState } from 'react';
import { Shield, Lock, KeyRound, Mail, Smartphone, Monitor, LogOut, AlertTriangle, Check, Smartphone as Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Card, Badge } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { authService } from '@/services/authService';

export function SecurityPage() {
  const { user, updateProfile } = useAuth();
  const { success, error } = useToast();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [changing, setChanging] = useState(false);

  const securityChecks = [
    { label: 'Password set', done: true },
    { label: 'Email verified', done: true },
    { label: '2FA enabled', done: user?.twoFactorEnabled || false },
    { label: 'KYC verified', done: user?.kycStatus === 'verified' },
    { label: 'Strong password', done: true },
  ];
  const score = Math.round((securityChecks.filter((s) => s.done).length / securityChecks.length) * 100);

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) { error('New passwords do not match.'); return; }
    if (passwords.new.length < 8) { error('Password must be at least 8 characters.'); return; }
    setChanging(true);
    try {
      await authService.changePassword(passwords.current, passwords.new);
      success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (e) {
      error(e instanceof Error ? e.message : 'Failed to change password');
    } finally {
      setChanging(false);
    }
  };

  const handleToggle2FA = async () => {
    const newValue = !user?.twoFactorEnabled;
    await updateProfile({ twoFactorEnabled: newValue });
    success(newValue ? '2FA enabled successfully!' : '2FA disabled.');
  };

  const sessions = [
    { device: 'Chrome on Windows', location: 'New York, US', current: true, lastActive: 'Active now' },
    { device: 'Safari on iPhone', location: 'New York, US', current: false, lastActive: '2 hours ago' },
    { device: 'Firefox on Linux', location: 'San Francisco, US', current: false, lastActive: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">Security</h1>
        <p className="mt-1 text-sm text-vaulta-muted">Manage your account security settings</p>
      </div>

      {/* Security score */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="none" className="text-vaulta-border" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="none" strokeDasharray={`${(score / 100) * 251} 251`} className={score >= 80 ? 'text-vaulta-spring-dark dark:text-vaulta-spring' : score >= 50 ? 'text-vaulta-warning' : 'text-vaulta-danger'} />
            </svg>
            <span className="text-xl font-bold text-vaulta-text">{score}%</span>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-vaulta-text">Security Score</h2>
            <p className="text-sm text-vaulta-muted mt-1">{score >= 80 ? 'Your account is well protected.' : score >= 50 ? 'Improve your security settings.' : 'Your account needs attention.'}</p>
            <div className="mt-3 space-y-1">
              {securityChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-2 text-sm">
                  {check.done ? <Check size={14} className="text-vaulta-spring-dark dark:text-vaulta-spring" /> : <AlertTriangle size={14} className="text-vaulta-warning" />}
                  <span className={check.done ? 'text-vaulta-text' : 'text-vaulta-muted'}>{check.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Password */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Lock size={20} className="text-vaulta-cerulean" />
            <h2 className="font-semibold text-vaulta-text">Password</h2>
          </div>
          <p className="text-sm text-vaulta-muted mb-4">Change your account password regularly to keep your account secure.</p>
          <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
        </Card>

        {/* 2FA */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <KeyRound size={20} className="text-vaulta-cerulean" />
            <h2 className="font-semibold text-vaulta-text">Two-Factor Authentication</h2>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-vaulta-text">Status: {user?.twoFactorEnabled ? <Badge className="bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring">Enabled</Badge> : <Badge className="bg-vaulta-warning/15 text-vaulta-warning">Disabled</Badge>}</p>
              <p className="text-xs text-vaulta-muted mt-1">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant={user?.twoFactorEnabled ? 'danger' : 'primary'} onClick={handleToggle2FA}>
              {user?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
            <Button variant="secondary" onClick={() => setShow2FA(true)}>Setup Guide</Button>
          </div>
        </Card>

        {/* Email verification */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Mail size={20} className="text-vaulta-cerulean" />
            <h2 className="font-semibold text-vaulta-text">Email Verification</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-vaulta-text">{user?.email}</p>
              <div className="mt-1"><Badge className="bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring"><Check size={12} /> Verified</Badge></div>
            </div>
          </div>
        </Card>

        {/* Withdrawal security */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-vaulta-cerulean" />
            <h2 className="font-semibold text-vaulta-text">Withdrawal Security</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-vaulta-muted">2FA required for withdrawals</span>
              <Badge className="bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-vaulta-muted">Withdrawal review</span>
              <Badge className="bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-vaulta-muted">Address whitelist</span>
              <Badge className="bg-vaulta-muted/15 text-vaulta-muted">Disabled</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Active sessions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Monitor size={20} className="text-vaulta-cerulean" />
            <h2 className="font-semibold text-vaulta-text">Active Sessions</h2>
          </div>
          <Button variant="danger" size="sm" onClick={() => success('Logged out from all other devices.')}>
            <LogOut size={14} /> Logout All
          </Button>
        </div>
        <div className="space-y-2">
          {sessions.map((s) => (
            <div key={s.device} className="flex items-center justify-between rounded-lg border border-vaulta-border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-vaulta-cerulean/10">
                  {s.device.includes('iPhone') ? <Phone size={16} className="text-vaulta-cerulean" /> : <Monitor size={16} className="text-vaulta-cerulean" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-vaulta-text">{s.device}</p>
                  <p className="text-xs text-vaulta-muted">{s.location} - {s.lastActive}</p>
                </div>
              </div>
              {s.current ? <Badge className="bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring">Current</Badge> : (
                <button onClick={() => success('Session terminated.')} className="text-xs font-medium text-vaulta-danger hover:underline">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Password modal */}
      <Modal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password" size="sm">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-vaulta-text mb-1.5">Current Password</label><input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-vaulta-text mb-1.5">New Password</label><input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-vaulta-text mb-1.5">Confirm New Password</label><input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="input-field" /></div>
          <Button onClick={handleChangePassword} loading={changing} className="w-full">Update Password</Button>
        </div>
      </Modal>

      {/* 2FA setup modal */}
      <Modal open={show2FA} onClose={() => setShow2FA(false)} title="2FA Setup Guide" size="md">
        <div className="space-y-4">
          <div className="rounded-lg border border-vaulta-border p-4">
            <h3 className="text-sm font-semibold text-vaulta-text">Step 1: Download an Authenticator App</h3>
            <p className="mt-1 text-xs text-vaulta-muted">Install Google Authenticator, Authy, or any TOTP-compatible app on your phone.</p>
          </div>
          <div className="rounded-lg border border-vaulta-border p-4">
            <h3 className="text-sm font-semibold text-vaulta-text">Step 2: Scan QR Code</h3>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white">
                <div className="grid grid-cols-7 gap-px">
                  {Array.from({ length: 49 }).map((_, i) => <div key={i} className={`h-2 w-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />)}
                </div>
              </div>
              <div><p className="text-xs text-vaulta-muted">Scan with your authenticator app</p><code className="mt-2 block text-xs text-vaulta-text">JBSWY3DPEHPK3PXP</code></div>
            </div>
          </div>
          <div className="rounded-lg border border-vaulta-border p-4">
            <h3 className="text-sm font-semibold text-vaulta-text">Step 3: Enter Verification Code</h3>
            <p className="mt-1 text-xs text-vaulta-muted">Enter the 6-digit code from your authenticator app to complete setup.</p>
          </div>
          <p className="text-xs text-vaulta-muted">Save your backup codes in a secure location. You'll need them if you lose access to your authenticator device.</p>
        </div>
      </Modal>
    </div>
  );
}
