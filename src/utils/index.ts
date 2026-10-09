import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number, currency = 'USD', minimumFractionDigits = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function timeAgo(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export function generateId(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function generateReference(prefix = 'VLT'): string {
  return `${prefix}${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function truncateAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function generateSparkline(points: number, base: number, volatility: number): number[] {
  const data: number[] = [];
  let value = base;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.48) * volatility;
    data.push(Math.max(0, value));
  }
  return data;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    completed: 'bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring',
    verified: 'bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring',
    confirmed: 'bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring',
    active: 'bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring',
    resolved: 'bg-vaulta-spring/15 text-vaulta-spring-dark dark:text-vaulta-spring',
    pending: 'bg-vaulta-warning/15 text-vaulta-warning',
    processing: 'bg-vaulta-warning/15 text-vaulta-warning',
    under_review: 'bg-vaulta-warning/15 text-vaulta-warning',
    open: 'bg-vaulta-warning/15 text-vaulta-warning',
    in_progress: 'bg-vaulta-warning/15 text-vaulta-warning',
    failed: 'bg-vaulta-danger/15 text-vaulta-danger',
    rejected: 'bg-vaulta-danger/15 text-vaulta-danger',
    cancelled: 'bg-vaulta-danger/15 text-vaulta-danger',
    expired: 'bg-vaulta-danger/15 text-vaulta-danger',
    closed: 'bg-vaulta-muted/15 text-vaulta-muted',
    inactive: 'bg-vaulta-muted/15 text-vaulta-muted',
    suspended: 'bg-vaulta-danger/15 text-vaulta-danger',
    not_submitted: 'bg-vaulta-muted/15 text-vaulta-muted',
  };
  return map[status.toLowerCase()] || 'bg-vaulta-muted/15 text-vaulta-muted';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}
