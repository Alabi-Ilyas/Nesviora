import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, MessageSquare, HelpCircle, Send } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Card, Badge } from '@/components/ui/StatCard';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { contentService, supportService, notificationService, adminService } from '@/services';
import type { Testimonial, FAQ, SupportTicket, AuditLog, PlatformSettings, Notification } from '@/types';
import { formatDate, capitalize, getStatusColor, formatDateTime } from '@/utils';

// ==================== TESTIMONIALS ====================
export function AdminTestimonialsPage() {
  const { success, error } = useToast();
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>({});
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  useEffect(() => { contentService.getAllTestimonials().then(setItems).catch((e) => error(e instanceof Error ? e.message : 'Could not load testimonials')).finally(() => setLoading(false)); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!form.name?.trim() || !form.comment?.trim()) { error('Name and comment are required.'); return; }
    setSaving(true);
    try {
      if (editing) { await contentService.updateTestimonial(editing.id, form); success('Testimonial updated!'); }
      else { await contentService.createTestimonial({ ...(form as Omit<Testimonial, 'id'>), isDemo: false }); success('Testimonial created!'); }
      setShowForm(false); setEditing(null); setForm({});
      setItems(await contentService.getAllTestimonials());
    } catch (e) {
      error(e instanceof Error ? e.message : 'Could not save the testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await contentService.deleteTestimonial(deleteTarget.id);
      success('Testimonial deleted.');
      setDeleteTarget(null);
      setItems(await contentService.getAllTestimonials());
    } catch (e) {
      error(e instanceof Error ? e.message : 'Could not delete the testimonial');
    }
  };

  const columns: Column<Testimonial>[] = [
    { key: 'name', header: 'Name', sortable: true, sortValue: (r) => r.name, render: (r) => <span className="font-medium text-vaulta-text">{r.name}</span> },
    { key: 'country', header: 'Country', render: (r) => <span className="text-vaulta-muted">{r.country}</span> },
    { key: 'comment', header: 'Comment', render: (r) => <span className="text-vaulta-muted text-xs line-clamp-1 max-w-xs">{r.comment}</span> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-vaulta-muted text-xs">{formatDate(r.date)}</span> },
    { key: 'verified', header: 'Verified', render: (r) => <Badge className={r.verified ? 'bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring' : 'bg-vaulta-muted/15 text-vaulta-muted'}>{r.verified ? 'Yes' : 'No'}</Badge> },
    { key: 'isDemo', header: 'Type', render: (r) => <Badge className={r.isDemo ? 'bg-vaulta-warning/15 text-vaulta-warning' : 'bg-vaulta-cerulean/10 text-vaulta-cerulean'}>{r.isDemo ? 'Demo' : 'Real'}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-vaulta-text">Testimonials</h1><p className="mt-1 text-sm text-vaulta-muted">Manage testimonials</p></div>
        <Button onClick={() => { setEditing(null); setForm({ name: '', country: '', comment: '', date: new Date().toISOString().slice(0, 10), verified: false, isDemo: false }); setShowForm(true); }}><Plus size={16} /> Add Testimonial</Button>
      </div>
      <Card>
        {loading ? <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 skeleton rounded" />)}</div> : (
          <DataTable columns={columns} data={items} pageSize={10} searchable searchKeys={['name', 'country'] as (keyof Testimonial)[]}
            actions={(row) => (<div className="flex items-center gap-1">
              <button onClick={() => { setEditing(row); setForm(row); setShowForm(true); }} className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"><Edit size={16} /></button>
              <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-danger/10 hover:text-vaulta-danger transition-colors"><Trash2 size={16} /></button>
            </div>)}
          />
        )}
      </Card>
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'} size="md">
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div><label className="block text-xs text-vaulta-muted mb-1">Name</label><input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
            <div><label className="block text-xs text-vaulta-muted mb-1">Country</label><input value={form.country || ''} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field" /></div>
          </div>
          <div><label className="block text-xs text-vaulta-muted mb-1">Comment</label><textarea rows={3} value={form.comment || ''} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="input-field resize-none" /></div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-vaulta-text cursor-pointer"><input type="checkbox" checked={form.verified || false} onChange={(e) => setForm({ ...form, verified: e.target.checked })} className="rounded border-vaulta-border" /> Verified</label>
          </div>
          <Button onClick={handleSave} loading={saving} className="w-full">{editing ? 'Update' : 'Create'}</Button>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Testimonial?" message="Are you sure you want to delete this testimonial?" confirmLabel="Delete" danger />
    </div>
  );
}

// ==================== FAQS ====================
export function AdminFAQsPage() {
  const { success } = useToast();
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState<Partial<FAQ>>({});
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null);

  useEffect(() => { contentService.getFAQs().then((d) => { setItems(d); setLoading(false); }); }, []);

  const handleSave = async () => {
    if (editing) { await contentService.updateFAQ(editing.id, form); success('FAQ updated!'); }
    else { await contentService.createFAQ(form as Omit<FAQ, 'id'>); success('FAQ created!'); }
    setShowForm(false); setEditing(null); setForm({});
    const updated = await contentService.getFAQs(); setItems(updated);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await contentService.deleteFAQ(deleteTarget.id); success('FAQ deleted.'); setDeleteTarget(null);
    const updated = await contentService.getFAQs(); setItems(updated);
  };

  const columns: Column<FAQ>[] = [
    { key: 'question', header: 'Question', sortable: true, sortValue: (r) => r.question, render: (r) => <span className="font-medium text-vaulta-text line-clamp-1 max-w-xs">{r.question}</span> },
    { key: 'category', header: 'Category', sortable: true, sortValue: (r) => r.category, render: (r) => <Badge className="bg-vaulta-cerulean/10 text-vaulta-cerulean">{r.category}</Badge> },
    { key: 'answer', header: 'Answer', render: (r) => <span className="text-vaulta-muted text-xs line-clamp-1 max-w-md">{r.answer}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-vaulta-text">FAQs</h1><p className="mt-1 text-sm text-vaulta-muted">Manage frequently asked questions</p></div>
        <Button onClick={() => { setEditing(null); setForm({ question: '', answer: '', category: 'Account' }); setShowForm(true); }}><Plus size={16} /> Add FAQ</Button>
      </div>
      <Card>
        {loading ? <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 skeleton rounded" />)}</div> : (
          <DataTable columns={columns} data={items} pageSize={10} searchable searchKeys={['question', 'category'] as (keyof FAQ)[]}
            actions={(row) => (<div className="flex items-center gap-1">
              <button onClick={() => { setEditing(row); setForm(row); setShowForm(true); }} className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"><Edit size={16} /></button>
              <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-danger/10 hover:text-vaulta-danger transition-colors"><Trash2 size={16} /></button>
            </div>)}
          />
        )}
      </Card>
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit FAQ' : 'Add FAQ'} size="md">
        <div className="space-y-4">
          <div><label className="block text-xs text-vaulta-muted mb-1">Question</label><input value={form.question || ''} onChange={(e) => setForm({ ...form, question: e.target.value })} className="input-field" /></div>
          <div><label className="block text-xs text-vaulta-muted mb-1">Category</label><select value={form.category || 'Account'} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">{['Account', 'Investments', 'Mining', 'Deposits', 'Withdrawals', 'Security', 'KYC', 'Fees', 'Crypto'].map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="block text-xs text-vaulta-muted mb-1">Answer</label><textarea rows={4} value={form.answer || ''} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="input-field resize-none" /></div>
          <Button onClick={handleSave} className="w-full">{editing ? 'Update' : 'Create'}</Button>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete FAQ?" message="Are you sure you want to delete this FAQ?" confirmLabel="Delete" danger />
    </div>
  );
}

// ==================== SUPPORT ====================
export function AdminSupportPage() {
  const { success } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState('');

  useEffect(() => { supportService.getAllTickets().then((d) => { setTickets(d); setLoading(false); }); }, []);

  const handleReply = async () => {
    if (!reply || !selected) return;
    await supportService.addMessage(selected.id, 'support', reply);
    setReply(''); success('Reply sent!');
    const updated = await supportService.getAllTickets(); setTickets(updated);
    const refreshed = updated.find((t) => t.id === selected.id); if (refreshed) setSelected(refreshed);
  };

  const handleStatusChange = async (id: string, status: SupportTicket['status']) => {
    await supportService.updateTicketStatus(id, status);
    success(`Ticket marked as ${status}.`);
    const updated = await supportService.getAllTickets(); setTickets(updated);
  };

  const columns: Column<SupportTicket>[] = [
    { key: 'subject', header: 'Subject', sortable: true, sortValue: (r) => r.subject, render: (r) => <span className="font-medium text-vaulta-text line-clamp-1 max-w-xs">{r.subject}</span> },
    { key: 'category', header: 'Category', render: (r) => <span className="text-vaulta-text">{r.category}</span> },
    { key: 'priority', header: 'Priority', sortable: true, sortValue: (r) => r.priority, render: (r) => <Badge className={r.priority === 'urgent' ? 'bg-vaulta-danger/15 text-vaulta-danger' : r.priority === 'high' ? 'bg-vaulta-warning/15 text-vaulta-warning' : 'bg-vaulta-cerulean/10 text-vaulta-cerulean'}>{r.priority}</Badge> },
    { key: 'status', header: 'Status', sortable: true, sortValue: (r) => r.status, render: (r) => <Badge className={getStatusColor(r.status)}>{capitalize(r.status)}</Badge> },
    { key: 'createdAt', header: 'Created', sortable: true, sortValue: (r) => r.createdAt, render: (r) => <span className="text-vaulta-muted text-xs">{formatDate(r.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-vaulta-text">Support Management</h1><p className="mt-1 text-sm text-vaulta-muted">Manage support tickets</p></div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><p className="text-sm text-vaulta-muted">Open</p><h3 className="mt-1 text-2xl font-bold text-vaulta-warning">{tickets.filter((t) => t.status === 'open').length}</h3></Card>
        <Card><p className="text-sm text-vaulta-muted">In Progress</p><h3 className="mt-1 text-2xl font-bold text-vaulta-cerulean">{tickets.filter((t) => t.status === 'in_progress').length}</h3></Card>
        <Card><p className="text-sm text-vaulta-muted">Resolved</p><h3 className="mt-1 text-2xl font-bold text-vaulta-spring-dark dark:text-vaulta-spring">{tickets.filter((t) => t.status === 'resolved').length}</h3></Card>
        <Card><p className="text-sm text-vaulta-muted">Closed</p><h3 className="mt-1 text-2xl font-bold text-vaulta-muted">{tickets.filter((t) => t.status === 'closed').length}</h3></Card>
      </div>
      <Card>
        {loading ? <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 skeleton rounded" />)}</div> : (
          <DataTable columns={columns} data={tickets} pageSize={15} searchable searchKeys={['subject', 'category', 'status'] as (keyof SupportTicket)[]}
            actions={(row) => <button onClick={() => setSelected(row)} className="rounded-lg p-1.5 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"><Eye size={16} /></button>}
          />
        )}
      </Card>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.subject} size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(selected.status)}>{capitalize(selected.status)}</Badge>
              <Badge className={selected.priority === 'urgent' ? 'bg-vaulta-danger/15 text-vaulta-danger' : 'bg-vaulta-warning/15 text-vaulta-warning'}>{selected.priority}</Badge>
              <span className="text-xs text-vaulta-muted">{selected.category}</span>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
              {selected.messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'support' ? 'bg-vaulta-cerulean text-white' : 'bg-vaulta-bg dark:bg-vaulta-dark-bg text-vaulta-text'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.status !== 'closed' && (
                <>
                  <Button size="sm" variant="secondary" onClick={() => handleStatusChange(selected.id, 'in_progress')}>In Progress</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleStatusChange(selected.id, 'resolved')}>Resolve</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleStatusChange(selected.id, 'closed')}>Close</Button>
                </>
              )}
            </div>
            {selected.status !== 'closed' && (
              <div className="flex gap-2 border-t border-vaulta-border pt-3">
                <input value={reply} onChange={(e) => setReply(e.target.value)} className="input-field flex-1" placeholder="Type reply..." onKeyDown={(e) => e.key === 'Enter' && handleReply()} />
                <Button onClick={handleReply}><Send size={16} /></Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ==================== NOTIFICATIONS ====================
export function AdminNotificationsPage() {
  const { success } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'system' as Notification['type'], audience: 'all' as string });

  useEffect(() => { notificationService.getAllNotifications().then((d) => { setNotifications(d); setLoading(false); }); }, []);

  const handleSend = async () => {
    if (!form.title || !form.message) { return; }
    await notificationService.sendNotification({ userId: form.audience === 'all' ? 'all' : 'specific', type: form.type, title: form.title, message: form.message });
    success('Notification sent!');
    setShowForm(false); setForm({ title: '', message: '', type: 'system', audience: 'all' });
    const updated = await notificationService.getAllNotifications(); setNotifications(updated);
  };

  const columns: Column<Notification>[] = [
    { key: 'title', header: 'Title', sortable: true, sortValue: (r) => r.title, render: (r) => <span className="font-medium text-vaulta-text">{r.title}</span> },
    { key: 'type', header: 'Type', sortable: true, sortValue: (r) => r.type, render: (r) => <Badge className="bg-vaulta-cerulean/10 text-vaulta-cerulean">{capitalize(r.type)}</Badge> },
    { key: 'message', header: 'Message', render: (r) => <span className="text-vaulta-muted text-xs line-clamp-1 max-w-md">{r.message}</span> },
    { key: 'createdAt', header: 'Date', sortable: true, sortValue: (r) => r.createdAt, render: (r) => <span className="text-vaulta-muted text-xs">{formatDateTime(r.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-vaulta-text">Notifications</h1><p className="mt-1 text-sm text-vaulta-muted">Send and manage notifications</p></div>
        <Button onClick={() => setShowForm(true)}><Plus size={16} /> Send Notification</Button>
      </div>
      <Card>
        {loading ? <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 skeleton rounded" />)}</div> : (
          <DataTable columns={columns} data={notifications} pageSize={15} searchable searchKeys={['title', 'type'] as (keyof Notification)[]} />
        )}
      </Card>
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Send Notification" size="md">
        <div className="space-y-4">
          <div><label className="block text-xs text-vaulta-muted mb-1">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" /></div>
          <div className="grid gap-3 md:grid-cols-2">
            <div><label className="block text-xs text-vaulta-muted mb-1">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Notification['type'] })} className="input-field">{['system', 'investment', 'deposit', 'withdrawal', 'kyc', 'security', 'mining'].map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label className="block text-xs text-vaulta-muted mb-1">Audience</label><select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="input-field"><option value="all">All Users</option><option value="verified">Verified Users</option><option value="specific">Specific User</option></select></div>
          </div>
          <div><label className="block text-xs text-vaulta-muted mb-1">Message</label><textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" /></div>
          <Button onClick={handleSend} className="w-full"><Send size={16} /> Send</Button>
        </div>
      </Modal>
    </div>
  );
}

// ==================== AUDIT LOGS ====================
export function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminService.getAuditLogs().then((d) => { setLogs(d); setLoading(false); }); }, []);

  const columns: Column<AuditLog>[] = [
    { key: 'adminName', header: 'Admin', sortable: true, sortValue: (r) => r.adminName, render: (r) => <span className="font-medium text-vaulta-text">{r.adminName}</span> },
    { key: 'action', header: 'Action', sortable: true, sortValue: (r) => r.action, render: (r) => <Badge className="bg-vaulta-cerulean/10 text-vaulta-cerulean">{r.action}</Badge> },
    { key: 'target', header: 'Target', render: (r) => <span className="font-mono text-xs text-vaulta-muted">{r.target}</span> },
    { key: 'ip', header: 'IP', render: (r) => <span className="text-vaulta-muted text-xs">{r.ip}</span> },
    { key: 'timestamp', header: 'Timestamp', sortable: true, sortValue: (r) => r.timestamp, render: (r) => <span className="text-vaulta-muted text-xs">{formatDateTime(r.timestamp)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-vaulta-text">Audit Logs</h1><p className="mt-1 text-sm text-vaulta-muted">Track all admin actions</p></div>
      <Card>
        {loading ? <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 skeleton rounded" />)}</div> : (
          <DataTable columns={columns} data={logs} pageSize={20} searchable searchKeys={['adminName', 'action', 'target'] as (keyof AuditLog)[]} exportable exportFilename="audit_logs" />
        )}
      </Card>
    </div>
  );
}

// ==================== SETTINGS ====================
export function AdminSettingsPage() {
  const { success } = useToast();
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { adminService.getSettings().then((d) => { setSettings(d); setLoading(false); }); }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await adminService.updateSettings(settings);
    success('Settings updated successfully!');
    setSaving(false);
  };

  if (loading || !settings) return <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-nesviora" />)}</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-vaulta-text">Platform Settings</h1><p className="mt-1 text-sm text-vaulta-muted">Configure platform-wide settings</p></div>

      <Card>
        <h2 className="font-semibold text-vaulta-text mb-4">General</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="block text-xs text-vaulta-muted mb-1">Platform Name</label><input value={settings.general.platformName} onChange={(e) => setSettings({ ...settings, general: { ...settings.general, platformName: e.target.value } })} className="input-field" /></div>
          <div><label className="block text-xs text-vaulta-muted mb-1">Timezone</label><select value={settings.general.timezone} onChange={(e) => setSettings({ ...settings, general: { ...settings.general, timezone: e.target.value } })} className="input-field"><option>UTC</option><option>America/New_York</option><option>Europe/London</option><option>Africa/Lagos</option></select></div>
          <div><label className="block text-xs text-vaulta-muted mb-1">Default Currency</label><select value={settings.general.defaultCurrency} onChange={(e) => setSettings({ ...settings, general: { ...settings.general, defaultCurrency: e.target.value } })} className="input-field"><option>USD</option><option>EUR</option><option>GBP</option><option>NGN</option></select></div>
          <div><label className="flex items-center justify-between rounded-lg border border-vaulta-border p-3 cursor-pointer"><span className="text-sm text-vaulta-text">Maintenance Mode</span><input type="checkbox" checked={settings.general.maintenanceMode} onChange={(e) => setSettings({ ...settings, general: { ...settings.general, maintenanceMode: e.target.checked } })} className="rounded border-vaulta-border" /></label></div>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-vaulta-text mb-4">Fees (%)</h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[['Deposit Fee', 'depositFee'], ['Withdrawal Fee', 'withdrawalFee'], ['Investment Fee', 'investmentFee'], ['Mining Fee', 'miningFee'], ['Referral Fee ($)', 'referralFee']].map(([label, key]) => (
            <div key={key}><label className="block text-xs text-vaulta-muted mb-1">{label}</label><input type="number" step="0.1" value={settings.fees[key as keyof typeof settings.fees]} onChange={(e) => setSettings({ ...settings, fees: { ...settings.fees, [key]: parseFloat(e.target.value) } })} className="input-field" /></div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-vaulta-text mb-4">Security</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between rounded-lg border border-vaulta-border p-3 cursor-pointer"><span className="text-sm text-vaulta-text">2FA Required for All Users</span><input type="checkbox" checked={settings.security.twoFactorRequired} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, twoFactorRequired: e.target.checked } })} className="rounded border-vaulta-border" /></label>
          <label className="flex items-center justify-between rounded-lg border border-vaulta-border p-3 cursor-pointer"><span className="text-sm text-vaulta-text">Withdrawal Verification Required</span><input type="checkbox" checked={settings.security.withdrawalVerification} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, withdrawalVerification: e.target.checked } })} className="rounded border-vaulta-border" /></label>
          <label className="flex items-center justify-between rounded-lg border border-vaulta-border p-3 cursor-pointer"><span className="text-sm text-vaulta-text">KYC Required</span><input type="checkbox" checked={settings.security.kycRequired} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, kycRequired: e.target.checked } })} className="rounded border-vaulta-border" /></label>
          <div><label className="block text-xs text-vaulta-muted mb-1">Session Timeout (minutes)</label><input type="number" value={settings.security.sessionTimeout} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionTimeout: parseInt(e.target.value) } })} className="input-field max-w-xs" /></div>
        </div>
      </Card>

      <div className="flex justify-end"><Button onClick={handleSave} loading={saving}>Save Settings</Button></div>
    </div>
  );
}

// ==================== REPORTS ====================
export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-vaulta-text">Reports</h1><p className="mt-1 text-sm text-vaulta-muted">Platform analytics and reporting</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Total Revenue', '$1.2M', '+18%'], ['Total Users', '121', '+12%'],
          ['Active Investments', '245', '+8%'], ['Support Resolution Rate', '94%', '+3%'],
        ].map(([label, value, change]) => (
          <Card key={label}><p className="text-sm text-vaulta-muted">{label}</p><h3 className="mt-1 text-2xl font-bold text-vaulta-text">{value}</h3><p className="mt-1 text-xs text-vaulta-spring-dark dark:text-vaulta-spring">{change}</p></Card>
        ))}
      </div>
      <Card>
        <h2 className="font-semibold text-vaulta-text mb-4">Report Exports</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {['User Report', 'Transaction Report', 'Deposit Report', 'Withdrawal Report', 'Investment Report', 'Mining Report'].map((r) => (
            <div key={r} className="flex items-center justify-between rounded-lg border border-vaulta-border p-4">
              <span className="text-sm font-medium text-vaulta-text">{r}</span>
              <Button variant="secondary" size="sm">Export</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ==================== ADMINS ====================
export function AdminAdminsPage() {
  const { user } = { user: null };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-vaulta-text">Administrators</h1><p className="mt-1 text-sm text-vaulta-muted">Manage admin accounts and roles</p></div>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-vaulta-border">
              <th className="px-3 py-2 text-left font-semibold text-vaulta-muted">Name</th>
              <th className="px-3 py-2 text-left font-semibold text-vaulta-muted">Email</th>
              <th className="px-3 py-2 text-left font-semibold text-vaulta-muted">Role</th>
              <th className="px-3 py-2 text-left font-semibold text-vaulta-muted">Status</th>
            </tr></thead>
            <tbody>
              {[{ name: 'Admin Manager', email: 'admin@nesviora.test', role: 'super_admin', status: 'active' }].map((a) => (
                <tr key={a.email} className="border-b border-vaulta-border last:border-0">
                  <td className="px-3 py-3 font-medium text-vaulta-text">{a.name}</td>
                  <td className="px-3 py-3 text-vaulta-text">{a.email}</td>
                  <td className="px-3 py-3"><Badge className="bg-vaulta-cerulean/10 text-vaulta-cerulean">{a.role.replace('_', ' ')}</Badge></td>
                  <td className="px-3 py-3"><Badge className="bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring">Active</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold text-vaulta-text mb-4">Role Permissions</h2>
        <div className="space-y-2">
          {[
            ['Super Admin', 'Full access to all features and settings'],
            ['Operations Admin', 'Users, KYC, investments, mining, support'],
            ['Finance Admin', 'Deposits, withdrawals, transactions, reports'],
            ['KYC Admin', 'KYC review and user management'],
            ['Support Admin', 'Support tickets and notifications'],
            ['Content Admin', 'Testimonials, FAQs, settings, assets'],
          ].map(([role, perms]) => (
            <div key={role} className="flex items-center justify-between rounded-lg border border-vaulta-border p-3">
              <div><p className="text-sm font-medium text-vaulta-text">{role}</p><p className="text-xs text-vaulta-muted">{perms}</p></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
