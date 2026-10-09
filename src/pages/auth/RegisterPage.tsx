import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Globe,
  ArrowRight,
  AlertCircle,
  Check,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export function RegisterPage() {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "",
    "bg-vaulta-danger",
    "bg-vaulta-warning",
    "bg-vaulta-cerulean",
    "bg-vaulta-spring",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setErr("Password must be at least 8 characters long.");
      return;
    }
    if (!form.terms) {
      setErr("Please accept the Terms and Conditions to continue.");
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        country: form.country,
        password: form.password,
        referralCode: form.referralCode || undefined,
      });
      success(`Welcome to Nesviora Capital Market Limited, ${user.firstName}!`);
      navigate("/onboarding");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Registration failed";
      setErr(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vaulta-bg dark:bg-vaulta-dark-bg flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vaulta-cerulean">
              <Shield size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-vaulta-text">
              NESVIORA
            </span>
          </Link>
        </div>

        <div className="mt-8 rounded-nesviora border border-vaulta-border bg-vaulta-surface p-8 shadow-nesviora">
          <h1 className="text-xl font-bold text-vaulta-text">
            Create Your Account
          </h1>
          <p className="mt-1 text-sm text-vaulta-muted">
            Join Nesviora Capital Market Limited and start investing in digital
            assets
          </p>

          {err && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-vaulta-danger/20 bg-vaulta-danger/5 px-3 py-2 text-sm text-vaulta-danger">
              <AlertCircle size={16} /> {err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-vaulta-muted"
                  />
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="input-field pl-9"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="input-field"
                  placeholder="Doe"
                />
              </div>
            </div>

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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-9"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-vaulta-muted"
                  />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="input-field pl-9"
                    placeholder="+1 555 0123"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                  Country
                </label>
                <div className="relative">
                  <Globe
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-vaulta-muted"
                  />
                  <select
                    required
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    className="input-field pl-9"
                  >
                    <option value="">Select...</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Nigeria</option>
                    <option>Germany</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>France</option>
                    <option>Japan</option>
                    <option>Brazil</option>
                    <option>India</option>
                    <option>South Africa</option>
                    <option>Singapore</option>
                    <option>UAE</option>
                    <option>Netherlands</option>
                    <option>Spain</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-vaulta-muted"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="input-field pl-9 pr-10"
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-vaulta-muted hover:text-vaulta-text"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {strength > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 flex-1 rounded ${s <= strength ? strengthColors[strength] : "bg-vaulta-border"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-vaulta-muted">
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-vaulta-muted"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="input-field pl-9"
                  placeholder="Re-enter password"
                />
                {form.confirmPassword &&
                  form.password === form.confirmPassword && (
                    <Check
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-vaulta-spring-dark dark:text-vaulta-spring"
                    />
                  )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                value={form.referralCode}
                onChange={(e) =>
                  setForm({ ...form, referralCode: e.target.value })
                }
                className="input-field"
                placeholder="NESVIORA-XXXX"
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-vaulta-muted cursor-pointer">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                className="mt-0.5 rounded border-vaulta-border"
              />
              <span>
                I accept the{" "}
                <Link
                  to="/terms"
                  className="text-vaulta-cerulean hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-vaulta-cerulean hover:underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

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
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-vaulta-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-vaulta-cerulean hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
