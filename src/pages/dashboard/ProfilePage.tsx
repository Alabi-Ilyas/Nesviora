import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Globe,
  Bell,
  Shield,
  Camera,
  Check,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Card, Badge } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { capitalize, getStatusColor } from "@/utils";

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { success, error } = useToast();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    country: user?.country || "",
  });
  const [prefs, setPrefs] = useState(
    user?.preferences || {
      currency: "USD",
      language: "English",
      notifications: { email: true, push: true, sms: false },
    },
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        country: form.country,
        preferences: prefs,
      });
      success("Profile updated successfully!");
    } catch (e) {
      error(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vaulta-text">Profile</h1>
        <p className="mt-1 text-sm text-vaulta-muted">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile header */}
      <Card>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-vaulta-cerulean text-2xl font-bold text-white">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-vaulta-surface border border-vaulta-border text-vaulta-muted hover:text-vaulta-cerulean transition-colors">
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-vaulta-text">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-vaulta-muted">{user?.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge className={getStatusColor(user?.status || "active")}>
                {capitalize(user?.status || "active")}
              </Badge>
              <Badge
                className={getStatusColor(user?.kycStatus || "not_submitted")}
              >
                KYC: {capitalize(user?.kycStatus || "not submitted")}
              </Badge>
              {user?.twoFactorEnabled && (
                <Badge className="bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring">
                  <Check size={12} /> 2FA
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal info */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <User size={20} className="text-vaulta-cerulean" />
            <h2 className="font-semibold text-vaulta-text">
              Personal Information
            </h2>
          </div>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-vaulta-muted mb-1">
                  First Name
                </label>
                <input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs text-vaulta-muted mb-1">
                  Last Name
                </label>
                <input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Email
              </label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-vaulta-muted" />
                <input
                  value={user?.email || ""}
                  disabled
                  className="input-field opacity-60"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Phone
              </label>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-vaulta-muted" />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-vaulta-muted mb-1">
                Country
              </label>
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-vaulta-muted" />
                <input
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-vaulta-cerulean" />
            <h2 className="font-semibold text-vaulta-text">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-vaulta-muted mb-1">
                  Currency
                </label>
                <select
                  value={prefs.currency}
                  onChange={(e) =>
                    setPrefs({ ...prefs, currency: e.target.value })
                  }
                  className="input-field"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>NGN</option>
                  <option>JPY</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-vaulta-muted mb-1">
                  Language
                </label>
                <select
                  value={prefs.language}
                  onChange={(e) =>
                    setPrefs({ ...prefs, language: e.target.value })
                  }
                  className="input-field"
                >
                  <option>English</option>
                  <option>French</option>
                  <option>Spanish</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-vaulta-text mb-2">
                Notification Preferences
              </h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between rounded-lg border border-vaulta-border p-3 cursor-pointer">
                  <span className="text-sm text-vaulta-text">
                    Email Notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={prefs.notifications.email}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        notifications: {
                          ...prefs.notifications,
                          email: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-vaulta-border"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-vaulta-border p-3 cursor-pointer">
                  <span className="text-sm text-vaulta-text">
                    Push Notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={prefs.notifications.push}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        notifications: {
                          ...prefs.notifications,
                          push: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-vaulta-border"
                  />
                </label>
                <label className="flex items-center justify-between rounded-lg border border-vaulta-border p-3 cursor-pointer">
                  <span className="text-sm text-vaulta-text">
                    SMS Notifications
                  </span>
                  <input
                    type="checkbox"
                    checked={prefs.notifications.sms}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        notifications: {
                          ...prefs.notifications,
                          sms: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-vaulta-border"
                  />
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Identity verification */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Shield size={20} className="text-vaulta-cerulean" />
          <h2 className="font-semibold text-vaulta-text">
            Identity Verification
          </h2>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-vaulta-border p-4">
          <div>
            <p className="text-sm font-medium text-vaulta-text">KYC Status</p>
            <p className="text-xs text-vaulta-muted mt-1">
              Verify your identity to unlock all features
            </p>
          </div>
          <Badge className={getStatusColor(user?.kycStatus || "not_submitted")}>
            {capitalize(user?.kycStatus || "not submitted")}
          </Badge>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
