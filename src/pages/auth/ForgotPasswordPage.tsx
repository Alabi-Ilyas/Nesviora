import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { authService } from "@/services/authService";

import { Logo } from "@/components/ui/Logo";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vaulta-bg dark:bg-vaulta-dark-bg flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center">
          <Logo className="h-20" />
        </div>

        <div className="mt-8 rounded-nesviora border border-vaulta-border bg-vaulta-surface p-8 shadow-nesviora">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-vaulta-spring/10">
                <CheckCircle
                  size={28}
                  className="text-vaulta-spring-dark dark:text-vaulta-spring"
                />
              </div>
              <h1 className="mt-4 text-xl font-bold text-vaulta-text">
                Check Your Email
              </h1>
              <p className="mt-2 text-sm text-vaulta-muted">
                If an account exists with {email}, you'll receive a password
                reset link shortly.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-vaulta-cerulean hover:underline"
              >
                <ArrowLeft size={16} /> Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-vaulta-text">
                Forgot Password
              </h1>
              <p className="mt-1 text-sm text-vaulta-muted">
                Enter your email and we'll send you a reset link
              </p>

              {err && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-vaulta-danger/20 bg-vaulta-danger/5 px-3 py-2 text-sm text-vaulta-danger">
                  <AlertCircle size={16} /> {err}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-vaulta-muted"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-9"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-vaulta-cerulean py-2.5 text-sm font-semibold text-white transition-all hover:bg-vaulta-cerulean-dark active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-4 w-4"
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
                  ) : (
                    <>
                      Send Reset Link <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <Link
                to="/login"
                className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-vaulta-cerulean hover:underline"
              >
                <ArrowLeft size={16} /> Back to login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
