import { type ReactNode } from 'react';
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-5 shadow-vaulta-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-11 w-11 rounded-xl" />
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, message, action }: {
  icon?: typeof Inbox; title: string; message?: string; action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-vaulta-cerulean/10">
        <Icon size={28} className="text-vaulta-cerulean" />
      </div>
      <h3 className="text-lg font-semibold text-vaulta-text">{title}</h3>
      {message && <p className="text-sm text-vaulta-muted max-w-sm">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-vaulta-danger/10">
        <AlertCircle size={28} className="text-vaulta-danger" />
      </div>
      <h3 className="text-lg font-semibold text-vaulta-text">Something went wrong</h3>
      <p className="text-sm text-vaulta-muted max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-vaulta-cerulean px-4 py-2 text-sm font-semibold text-white hover:bg-vaulta-cerulean-dark transition-colors"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      )}
    </div>
  );
}

export function DemoBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-vaulta-orange/10 px-4 py-1.5 text-xs font-medium text-vaulta-orange">
      <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-vaulta-orange" />
      Demo Environment — Data shown is simulated for demonstration purposes only
    </div>
  );
}
