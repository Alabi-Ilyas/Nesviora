import { useState } from 'react';
import { Shield, Lock, KeyRound, Mail, Monitor, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Card, Badge } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { authService } from '@/services/authService';

const on = 'bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring';
const soon = 'bg-vaulta-warning/15 text-vaulta-warning';

// Only shows what the platform really does today. Password change is live (it also signs out other devices);
// 2FA, address whitelisting and per-device session lists are not built yet and are labelled as such.
export function SecurityPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [changing, setChanging] = useState(false);

  const handleChangePassword = async () => {
    if (!passwords.current) { error('Enter your current password.'); return; }
    if (passwords.new !== passwords.confirm) { error('New passwords do not match.'); return; }
    if (passwords.new.length < 8) { error('Password must be at least 8 characters.'); return; }
    setChanging(true);
    try {
      await authService.changePassword(passwords.current, passwords.new);
      success('Password changed. Other devices have been signed out.');
      setShowPasswordModal(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (e) {
      error(e instanceof Error ? e.message : 'Failed to change password');
    } finally {
      setChanging(false);
    }
  };

  const field = (label: string, key: 'current' | 'new' | 'confirm') => (
    <div>
      <label className="block text-sm font-medium text-vaulta-text mb-1.5">{label}</label>
      <input
        type="password"
        value={passwords[key]}
        onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
        className="input-field"
        autoComplete={key === 'current' ? 'current-password' : 'new-password'}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">Security</h1>
        <p className="mt-1 text-sm text-vaulta-muted">Manage your account security settings</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Lock size={20} className="text-vaulta-cerulean" />
            <h2 className="font-semibold text-vaulta-text">Password</h2>
          </div>
          <p className="text-sm text-vaulta-muted mb-4">
            Change your password regularly. Changing it also signs you out of every other device.
          </p>
          <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <KeyRound size={20} className="text-vaulta-cerulean" />
            <h2 className="font-semibold text-vaulta-text">Two-Factor Authentication</h2>
          </div>
          <div className="mb-2"><Badge className={soon}>Coming soon</Badge></div>
          <p className="text-sm text-vaulta-muted">
            Two-factor authentication is not active yet. Until then, use a strong password you don't use anywhere else.
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Mail size={20} className="text-vaulta-cerulean" />
            <h2 className="font-semibold text-vaulta-text">Account Email</h2>
          </div>
          <p className="text-sm text-vaulta-text break-all">{user?.email}</p>
          <p className="mt-1 text-xs text-vaulta-muted">Contact support if you need to change your email address.</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-vaulta-cerulean" />
            <h2 className="font-semibold text-vaulta-text">Withdrawal Protection</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-vaulta-muted">Manual review of every withdrawal</span>
              <Badge className={on}><Check size={12} /> Active</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-vaulta-muted">2FA on withdrawals</span>
              <Badge className={soon}>Coming soon</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-vaulta-muted">Withdrawal address whitelist</span>
              <Badge className={soon}>Coming soon</Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-2">
          <Monitor size={20} className="text-vaulta-cerulean" />
          <h2 className="font-semibold text-vaulta-text">Signed-in Devices</h2>
        </div>
        <p className="text-sm text-vaulta-muted">
          If you think someone else has access to your account, change your password. That signs out every other device immediately.
        </p>
      </Card>

      <Modal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password" size="sm">
        <div className="space-y-4">
          {field('Current Password', 'current')}
          {field('New Password', 'new')}
          {field('Confirm New Password', 'confirm')}
          <Button onClick={handleChangePassword} loading={changing} className="w-full">Update Password</Button>
        </div>
      </Modal>
    </div>
  );
}
