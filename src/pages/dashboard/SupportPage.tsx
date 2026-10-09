import { useState, useEffect } from "react";
import { LifeBuoy, Plus, Send, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/States";
import { supportService } from "@/services";
import type { SupportTicket } from "@/types";
import { formatDate, capitalize, getStatusColor, timeAgo } from "@/utils";

const categories = [
  "Account",
  "Deposits",
  "Withdrawals",
  "Investments",
  "Mining",
  "Security",
  "KYC",
  "Fees",
  "Other",
];

export function SupportPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    category: "Account",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    message: "",
  });
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    supportService.getTickets(user?.id || "").then((data) => {
      setTickets(data);
      setLoading(false);
    });
  }, [user]);

  const handleCreate = async () => {
    if (!form.subject || !form.message) {
      error("Please fill in all fields.");
      return;
    }
    setCreating(true);
    try {
      await supportService.createTicket(user?.id || "", form);
      success("Support ticket created! Our team will respond shortly.");
      setShowCreate(false);
      setForm({
        subject: "",
        category: "Account",
        priority: "medium",
        message: "",
      });
      const updated = await supportService.getTickets(user?.id || "");
      setTickets(updated);
    } catch (e) {
      error(e instanceof Error ? e.message : "Failed to create ticket");
    } finally {
      setCreating(false);
    }
  };

  const handleReply = async () => {
    if (!reply || !selected) return;
    await supportService.addMessage(selected.id, "user", reply);
    setReply("");
    success("Message sent!");
    const updated = await supportService.getTickets(user?.id || "");
    setTickets(updated);
    const refreshed = updated.find((t) => t.id === selected.id);
    if (refreshed) setSelected(refreshed);
  };

  const priorityColors: Record<string, string> = {
    low: "bg-vaulta-muted/15 text-vaulta-muted",
    medium: "bg-vaulta-cerulean/10 text-vaulta-cerulean",
    high: "bg-vaulta-warning/15 text-vaulta-warning",
    urgent: "bg-vaulta-danger/15 text-vaulta-danger",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vaulta-text">Support</h1>
          <p className="mt-1 text-sm text-vaulta-muted">
            Get help from our support team
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} /> New Ticket
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 skeleton rounded-nesviora" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <EmptyState
            icon={LifeBuoy}
            title="No support tickets"
            message="Create a ticket if you need help with anything."
            action={
              <Button onClick={() => setShowCreate(true)}>
                <Plus size={16} /> New Ticket
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-vaulta-cerulean/10 text-vaulta-cerulean">
                    <MessageSquare size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-vaulta-text truncate">
                      {ticket.subject}
                    </h3>
                    <p className="text-xs text-vaulta-muted mt-0.5">
                      {ticket.category} - {formatDate(ticket.createdAt)}
                    </p>
                    <p className="text-sm text-vaulta-muted mt-1 line-clamp-1">
                      {ticket.message}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge className={getStatusColor(ticket.status)}>
                    {capitalize(ticket.status)}
                  </Badge>
                  <Badge className={priorityColors[ticket.priority]}>
                    {ticket.priority}
                  </Badge>
                  <button
                    onClick={() => setSelected(ticket)}
                    className="text-xs font-medium text-vaulta-cerulean hover:underline"
                  >
                    View
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create ticket modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Support Ticket"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-vaulta-text mb-1.5">
              Subject
            </label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="input-field"
              placeholder="Brief description of your issue"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as typeof form.priority,
                  })
                }
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-vaulta-text mb-1.5">
              Message
            </label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="input-field resize-none"
              placeholder="Describe your issue in detail..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-vaulta-text mb-1.5">
              Attachment (Optional)
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-vaulta-border py-3 text-sm text-vaulta-muted hover:border-vaulta-cerulean transition-colors">
              Click to upload
              <input type="file" className="hidden" />
            </label>
          </div>
          <Button onClick={handleCreate} loading={creating} className="w-full">
            <Send size={16} /> Submit Ticket
          </Button>
        </div>
      </Modal>

      {/* Ticket detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.subject}
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(selected.status)}>
                {capitalize(selected.status)}
              </Badge>
              <Badge className={priorityColors[selected.priority]}>
                {selected.priority}
              </Badge>
              <span className="text-xs text-vaulta-muted">
                {selected.category}
              </span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
              {selected.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${msg.sender === "user" ? "bg-vaulta-cerulean text-white" : "bg-vaulta-bg dark:bg-vaulta-dark-bg text-vaulta-text"}`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/60" : "text-vaulta-muted"}`}
                    >
                      {timeAgo(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {selected.status !== "closed" && (
              <div className="flex gap-2 border-t border-vaulta-border pt-3">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Type your reply..."
                  onKeyDown={(e) => e.key === "Enter" && handleReply()}
                />
                <Button onClick={handleReply}>
                  <Send size={16} />
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
