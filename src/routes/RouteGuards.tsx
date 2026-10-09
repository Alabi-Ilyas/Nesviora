import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-vaulta-bg dark:bg-vaulta-dark-bg flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-vaulta-cerulean"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-vaulta-bg dark:bg-vaulta-dark-bg flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-vaulta-cerulean"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-vaulta-bg dark:bg-vaulta-dark-bg flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-vaulta-danger/10">
            <Shield size={32} className="text-vaulta-danger" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-vaulta-text">
            Access Denied
          </h1>
          <p className="mt-2 text-sm text-vaulta-muted">
            You don't have permission to access this area.
          </p>
          <a
            href="/dashboard"
            className="mt-6 inline-block rounded-lg bg-vaulta-cerulean px-6 py-2.5 text-sm font-semibold text-white hover:bg-vaulta-cerulean-dark transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
