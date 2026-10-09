import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Shield,
  Pickaxe,
  Info,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "@/services";
import { Skeleton, EmptyState } from "@/components/ui/States";
import type { Notification } from "@/types";
import { timeAgo, capitalize } from "@/utils";

const typeIcons: Record<string, typeof Bell> = {
  investment: TrendingUp,
  deposit: ArrowDownToLine,
  withdrawal: ArrowUpFromLine,
  kyc: Shield,
  security: Shield,
  mining: Pickaxe,
  system: Info,
};

export function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      notificationService.getNotifications(user.id).then((data) => {
        setNotifications(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    if (user) {
      await notificationService.markAllAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vaulta-text">Notifications</h1>
          <p className="mt-1 text-sm text-vaulta-muted">
            {unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 rounded-lg border border-vaulta-border px-4 py-2 text-sm font-medium text-vaulta-text hover:border-vaulta-cerulean transition-colors"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-nesviora" />
          ))
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            message="You'll see updates about your investments, deposits, withdrawals, and more here."
          />
        ) : (
          notifications.map((notif, i) => {
            const Icon = typeIcons[notif.type] || Info;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !notif.read && handleMarkRead(notif.id)}
                className={`flex items-start gap-4 rounded-nesviora border p-4 transition-colors cursor-pointer ${
                  notif.read
                    ? "border-vaulta-border bg-vaulta-surface"
                    : "border-vaulta-cerulean/20 bg-vaulta-cerulean/5"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    notif.read
                      ? "bg-vaulta-cerulean/10 text-vaulta-cerulean"
                      : "bg-vaulta-cerulean text-white"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-vaulta-text">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-vaulta-orange" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-vaulta-muted">
                    {notif.message}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs text-vaulta-muted">
                      {timeAgo(notif.createdAt)}
                    </span>
                    <span className="rounded-full bg-vaulta-cerulean/10 px-2 py-0.5 text-xs font-medium text-vaulta-cerulean">
                      {capitalize(notif.type)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
