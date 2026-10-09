import type { User } from "@/types";
import { demoUser, demoAdmin } from "@/data/mockData";

const AUTH_KEY = "nesviora_auth_user";
const USERS_KEY = "nesviora_registered_users";

interface StoredUser extends User {
  password?: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Pre-populate demo accounts
function ensureDemoUsers() {
  const users = getStoredUsers();
  if (!users.find((u) => u.email === demoUser.email)) {
    users.push({ ...demoUser, password: "Demo@12345" });
  }
  if (!users.find((u) => u.email === demoAdmin.email)) {
    users.push({ ...demoAdmin, password: "Admin@12345" });
  }
  saveStoredUsers(users);
}

ensureDemoUsers();

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    await delay();
    const users = getStoredUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user) throw new Error("No account found with this email address.");
    if (user.password !== password)
      throw new Error("Incorrect password. Please try again.");
    if (user.status === "suspended")
      throw new Error(
        "Your account has been suspended. Please contact support.",
      );
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    password: string;
    referralCode?: string;
  }): Promise<User> {
    await delay(500);
    const users = getStoredUsers();
    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const newUser: StoredUser = {
      id: `usr_${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      status: "active",
      role: "user",
      kycStatus: "not_submitted",
      createdAt: new Date().toISOString(),
      referralCode: `NESVIORA-${data.lastName.toUpperCase()}${Date.now().toString(36).toUpperCase().slice(-4)}`,
      twoFactorEnabled: false,
      password: data.password,
      preferences: {
        currency: "USD",
        language: "English",
        notifications: { email: true, push: true, sms: false },
      },
    };
    users.push(newUser);
    saveStoredUsers(users);
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    await delay(300);
    const current = this.getCurrentUser();
    if (!current) throw new Error("Not authenticated");
    const updated = { ...current, ...updates };
    localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === current.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      saveStoredUsers(users);
    }
    return updated;
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await delay(300);
    const current = this.getCurrentUser();
    if (!current) throw new Error("Not authenticated");
    const users = getStoredUsers();
    const user = users.find((u) => u.id === current.id);
    if (!user) throw new Error("User not found");
    if (user.password !== currentPassword)
      throw new Error("Current password is incorrect.");
    user.password = newPassword;
    saveStoredUsers(users);
  },

  async forgotPassword(email: string): Promise<void> {
    await delay();
    const users = getStoredUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!user) throw new Error("No account found with this email address.");
    // In production, send email. For demo, just succeed.
  },

  hasPermission(user: User | null, permission: string): boolean {
    if (!user || user.role !== "admin") return false;
    if (user.adminRole === "super_admin") return true;
    const permissions: Record<string, string[]> = {
      ops_admin: [
        "users",
        "kyc",
        "investments",
        "mining",
        "support",
        "reports",
      ],
      finance_admin: ["deposits", "withdrawals", "transactions", "reports"],
      kyc_admin: ["kyc", "users"],
      support_admin: ["support", "notifications"],
      content_admin: [
        "testimonials",
        "faqs",
        "settings",
        "assets",
        "market",
        "plans",
      ],
    };
    return permissions[user.adminRole || ""]?.includes(permission) ?? false;
  },
};
