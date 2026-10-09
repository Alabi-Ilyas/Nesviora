import { useState, useEffect } from 'react';
import { Eye, Ban, CheckCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Badge } from '@/components/ui/StatCard';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { adminService } from '@/services';
import type { User } from '@/types';
import { formatDate, capitalize, getStatusColor } from '@/utils';

export function AdminUsersPage() {
  const { user: admin } = useAuth();
  const { success } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ user: User; action: 'suspend' | 'activate' | 'reset' } | null>(null);

  useEffect(() => {
    adminService.getUsers().then((data) => { setUsers(data); setLoading(false); });
  }, []);

  const handleAction = async () => {
    if (!confirmAction) return;
    const { user, action } = confirmAction;
    if (action === 'suspend') {
      await adminService.updateUserStatus(user.id, 'suspended');
      await adminService.addAuditLog({ adminId: admin?.id || '', adminName: `${admin?.firstName} ${admin?.lastName}`, action: 'User Suspended', target: user.id, ip: '192.168.1.1' });
      success(`User ${user.firstName} ${user.lastName} suspended.`);
    } else if (action === 'activate') {
      await adminService.updateUserStatus(user.id, 'active');
      await adminService.addAuditLog({ adminId: admin?.id || '', adminName: `${admin?.firstName} ${admin?.lastName}`, action: 'User Activated', target: user.id, ip: '192.168.1.1' });
      success(`User ${user.firstName} ${user.lastName} activated.`);
    } else if (action === 'reset') {
      await adminService.addAuditLog({ adminId: admin?.id || '', adminName: `${admin?.firstName} ${admin?.lastName}`, action: 'Security Reset', target: user.id, ip: '192.168.1.1' });
      success(`Security reset for ${user.firstName} ${user.lastName}.`);
    }
    setConfirmAction(null);
    const updated = await adminService.getUsers();
    setUsers(updated);
  };

  const columns: Column<User>[] = [
    { key: 'id', header: 'User ID', render: (r) => <span className="font-mono text-xs text-vaulta-muted">{r.id.slice(0, 12)}</span> },
    { key: 'firstName', header: 'Name', sortable: true, sortValue: (r) => `${r.firstName} ${r.lastName}`, render: (r) => <span className="font-medium text-vaulta-text">{r.firstName} {r.lastName}</span> },
    { key: 'email', header: 'Email', sortable: true, sortValue: (r) => r.email, render: (r) => <span className="text-vaulta-text">{r.email}</span> },
    { key: 'country', header: 'Country', render: (r) => <span className="text-vaulta-muted">{r.country}</span> },
    { key: 'kycStatus', header: 'KYC', sortable: true, sortValue: (r) => r.kycStatus, render: (r) => <Badge className={getStatusColor(r.kycStatus)}>{capitalize(r.kycStatus)}</Badge> },
    { key: 'status', header: 'Status', sortable: true, sortValue: (r) => r.status, render: (r) => <Badge className={getStatusColor(r.status)}>{capitalize(r.status)}</Badge> },
    { key: 'createdAt', header: 'Created', sortable: true, sortValue: (r) => r.createdAt, render: (r) => <span className="text-vaulta-muted text-xs">{formatDate(r.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-vaulta-text">User Management</h1><p className="mt-1 text-sm text-vaulta-muted">Manage platform users</p></div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><p className="text-sm text-vaulta-muted">Total Users</p><h3 className="mt-1 text-2xl font-bold text-vaulta-text">{users.length}</h3></Card>
        <Card><p className="text-sm text-vaulta-muted">Active</p><h3 className="mt-1 text-2xl font-bold text-vaulta-spring-dark dark:text-vaulta-spring">{users.filter((u) => u.status === 'active').length}</h3></Card>
        <Card><p className="text-sm text-vaulta-muted">Suspended</p><h3 className="mt-1 text-2xl font-bold text-vaulta-danger">{users.filter((u) => u.status === 'suspended').length}</h3></Card>
        <Card><p className="text-sm text-vaulta-muted">Verified KYC</p><h3 className="mt-1 text-2xl font-bold text-vaulta-text">{users.filter((u) => u.kycStatus === 'verified').length}</h3></Card>
      </div>

      <Card>
        {loading ? <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 skeleton rounded" />)}</div> : (
          <DataTable columns={columns} data={users} pageSize={15} searchable searchKeys={['firstName', 'lastName', 'email', 'country'] as (keyof User)[]} exportable exportFilename="users"
            actions={(row) => (
              <div className="flex items-center gap-1">
                <button onClick={() => setSelected(row)} className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors" aria-label="View user"><Eye size={16} /></button>
                {row.status === 'active' ? (
                  <button onClick={() => setConfirmAction({ user: row, action: 'suspend' })} className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-danger/10 hover:text-vaulta-danger transition-colors" aria-label="Suspend user"><Ban size={16} /></button>
                ) : (
                  <button onClick={() => setConfirmAction({ user: row, action: 'activate' })} className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-spring/10 hover:text-vaulta-spring-dark dark:text-vaulta-spring transition-colors" aria-label="Activate user"><CheckCircle size={16} /></button>
                )}
                <button onClick={() => setConfirmAction({ user: row, action: 'reset' })} className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-warning/10 hover:text-vaulta-warning transition-colors" aria-label="Reset security"><RotateCcw size={16} /></button>
              </div>
            )}
          />
        )}
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="User Details" size="md">
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['Name', `${selected.firstName} ${selected.lastName}`], ['Email', selected.email], ['Phone', selected.phone], ['Country', selected.country], ['Referral Code', selected.referralCode], ['2FA', selected.twoFactorEnabled ? 'Enabled' : 'Disabled'], ['Created', formatDate(selected.createdAt)]].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-vaulta-border p-3"><p className="text-xs text-vaulta-muted">{label}</p><p className="font-semibold text-vaulta-text">{value}</p></div>
              ))}
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(selected.status)}>Status: {capitalize(selected.status)}</Badge>
              <Badge className={getStatusColor(selected.kycStatus)}>KYC: {capitalize(selected.kycStatus)}</Badge>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirmAction} onClose={() => setConfirmAction(null)} onConfirm={handleAction}
        title={confirmAction?.action === 'suspend' ? 'Suspend User?' : confirmAction?.action === 'activate' ? 'Activate User?' : 'Reset Security?'}
        message={confirmAction?.action === 'suspend' ? `Suspend ${confirmAction.user.firstName} ${confirmAction.user.lastName}? They will lose access to their account.` : confirmAction?.action === 'activate' ? `Activate ${confirmAction.user.firstName} ${confirmAction.user.lastName}?` : `Reset security settings for ${confirmAction?.user.firstName} ${confirmAction?.user.lastName}? This will disable 2FA and reset their password.`}
        confirmLabel={confirmAction?.action === 'suspend' ? 'Suspend' : confirmAction?.action === 'activate' ? 'Activate' : 'Reset'}
        danger={confirmAction?.action === 'suspend'}
      />
    </div>
  );
}
