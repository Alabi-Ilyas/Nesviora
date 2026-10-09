import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, Eye } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Badge } from '@/components/ui/StatCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { kycService, adminService } from '@/services';
import type { KYCSubmission } from '@/types';
import { formatDate, capitalize, getStatusColor } from '@/utils';

export function AdminKYCPage() {
  const { user: admin } = useAuth();
  const { success } = useToast();
  const [kycs, setKycs] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<KYCSubmission | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => { kycService.getAllKYCs().then((d) => { setKycs(d); setLoading(false); }); }, []);

  const handleAction = async (status: KYCSubmission['status']) => {
    if (!selected) return;
    await kycService.updateKYCStatus(selected.id, status, admin?.email || '', note || undefined);
    await adminService.addAuditLog({ adminId: admin?.id || '', adminName: `${admin?.firstName} ${admin?.lastName}`, action: `KYC ${capitalize(status)}`, target: selected.id, ip: '192.168.1.1', metadata: note });
    success(`KYC ${status === 'verified' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'}.`);
    setSelected(null);
    setNote('');
    const updated = await kycService.getAllKYCs();
    setKycs(updated);
  };

  const columns: Column<KYCSubmission>[] = [
    { key: 'legalName', header: 'Name', sortable: true, sortValue: (r) => r.legalName, render: (r) => <span className="font-medium text-vaulta-text">{r.legalName}</span> },
    { key: 'country', header: 'Country', render: (r) => <span className="text-vaulta-muted">{r.country}</span> },
    { key: 'idType', header: 'ID Type', render: (r) => <span className="text-vaulta-text">{r.idType}</span> },
    { key: 'submittedAt', header: 'Submitted', sortable: true, sortValue: (r) => r.submittedAt, render: (r) => <span className="text-vaulta-muted text-xs">{formatDate(r.submittedAt)}</span> },
    { key: 'status', header: 'Status', sortable: true, sortValue: (r) => r.status, render: (r) => <Badge className={getStatusColor(r.status)}>{capitalize(r.status)}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-vaulta-text">KYC Management</h1><p className="mt-1 text-sm text-vaulta-muted">Review and verify user identities</p></div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><p className="text-sm text-vaulta-muted">Pending</p><h3 className="mt-1 text-2xl font-bold text-vaulta-warning">{kycs.filter((k) => k.status === 'pending').length}</h3></Card>
        <Card><p className="text-sm text-vaulta-muted">Under Review</p><h3 className="mt-1 text-2xl font-bold text-vaulta-cerulean">{kycs.filter((k) => k.status === 'under_review').length}</h3></Card>
        <Card><p className="text-sm text-vaulta-muted">Verified</p><h3 className="mt-1 text-2xl font-bold text-vaulta-spring-dark dark:text-vaulta-spring">{kycs.filter((k) => k.status === 'verified').length}</h3></Card>
        <Card><p className="text-sm text-vaulta-muted">Rejected</p><h3 className="mt-1 text-2xl font-bold text-vaulta-danger">{kycs.filter((k) => k.status === 'rejected').length}</h3></Card>
      </div>

      <Card>
        {loading ? <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 skeleton rounded" />)}</div> : (
          <DataTable columns={columns} data={kycs} pageSize={15} searchable searchKeys={['legalName', 'country', 'status'] as (keyof KYCSubmission)[]} exportable exportFilename="kyc_submissions"
            actions={(row) => <button onClick={() => setSelected(row)} className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"><Eye size={16} /></button>}
          />
        )}
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="KYC Review" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['Legal Name', selected.legalName], ['Date of Birth', selected.dateOfBirth], ['Country', selected.country], ['Address', selected.address], ['ID Type', selected.idType], ['ID Number', selected.idNumber], ['Submitted', formatDate(selected.submittedAt)]].map(([l, v]) => (
                <div key={l} className="rounded-lg border border-vaulta-border p-3"><p className="text-xs text-vaulta-muted">{l}</p><p className="font-semibold text-vaulta-text">{v}</p></div>
              ))}
            </div>
            <div className="rounded-lg border border-vaulta-border p-4">
              <div className="flex items-center gap-2 mb-2"><FileText size={16} className="text-vaulta-cerulean" /><p className="text-sm font-medium text-vaulta-text">Document</p></div>
              <div className="rounded-lg bg-vaulta-bg dark:bg-vaulta-dark-bg p-8 text-center"><p className="text-sm text-vaulta-muted">ID document preview (demo)</p></div>
            </div>
            <div><label className="block text-sm font-medium text-vaulta-text mb-1.5">Internal Note</label><textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className="input-field resize-none" placeholder="Add an internal note..." /></div>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => handleAction('under_review')}>Request Info</Button>
              <Button variant="danger" className="flex-1" onClick={() => handleAction('rejected')}><XCircle size={16} /> Reject</Button>
              <Button className="flex-1" onClick={() => handleAction('verified')}><CheckCircle size={16} /> Approve</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
