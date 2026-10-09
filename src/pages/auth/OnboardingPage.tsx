import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FileCheck,
  Lock,
  Wallet,
  LayoutDashboard,
  Check,
  ArrowRight,
  ArrowLeft,
  SkipForward,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { kycService } from "@/services";

export function OnboardingPage() {
  const { user, updateProfile } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [kyc, setKyc] = useState({
    legalName: "",
    dateOfBirth: "",
    country: "",
    address: "",
    idType: "Passport",
    idNumber: "",
  });

  const steps = [
    {
      icon: User,
      title: "Personal Details",
      desc: "Review your personal information",
    },
    {
      icon: FileCheck,
      title: "Identity Verification",
      desc: "Complete KYC verification",
    },
    { icon: Lock, title: "Security Setup", desc: "Secure your account" },
    { icon: Wallet, title: "Wallet Setup", desc: "Set up your wallets" },
    {
      icon: LayoutDashboard,
      title: "Dashboard Introduction",
      desc: "Get started with Vaulta",
    },
  ];

  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (step === 1 && kyc.legalName) {
      setLoading(true);
      try {
        await kycService.submitKYC(user?.id || "", kyc);
        success("KYC submitted for review!");
      } catch {
        // continue anyway
      }
      setLoading(false);
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleSkip = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div className="min-h-screen bg-vaulta-bg dark:bg-vaulta-dark-bg flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-vaulta-text">
            Welcome to Vaulta{user ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="mt-2 text-sm text-vaulta-muted">
            Let's get your account set up in a few quick steps
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    i < step
                      ? "bg-vaulta-spring text-vaulta-black"
                      : i === step
                        ? "bg-vaulta-cerulean text-white"
                        : "bg-vaulta-border text-vaulta-muted"
                  }`}
                >
                  {i < step ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <span
                  className={`mt-1.5 text-xs ${i <= step ? "text-vaulta-text font-medium" : "text-vaulta-muted"}`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full bg-vaulta-border overflow-hidden">
            <motion.div
              className="h-full bg-vaulta-cerulean"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="rounded-vaulta border border-vaulta-border bg-vaulta-surface p-8 shadow-vaulta">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vaulta-cerulean/10 text-vaulta-cerulean">
                  <CurrentIcon size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-vaulta-text">
                    {steps[step].title}
                  </h2>
                  <p className="text-sm text-vaulta-muted">
                    {steps[step].desc}
                  </p>
                </div>
              </div>

              {step === 0 && (
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        First Name
                      </label>
                      <p className="font-medium text-vaulta-text">
                        {user?.firstName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Last Name
                      </label>
                      <p className="font-medium text-vaulta-text">
                        {user?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">Email</label>
                      <p className="font-medium text-vaulta-text">
                        {user?.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">Phone</label>
                      <p className="font-medium text-vaulta-text">
                        {user?.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Country
                      </label>
                      <p className="font-medium text-vaulta-text">
                        {user?.country}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-vaulta-muted">
                    Your details look correct? Continue to the next step.
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Legal Name
                      </label>
                      <input
                        value={kyc.legalName}
                        onChange={(e) =>
                          setKyc({ ...kyc, legalName: e.target.value })
                        }
                        className="input-field mt-1"
                        placeholder="Full legal name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={kyc.dateOfBirth}
                        onChange={(e) =>
                          setKyc({ ...kyc, dateOfBirth: e.target.value })
                        }
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Country
                      </label>
                      <input
                        value={kyc.country || user?.country || ""}
                        onChange={(e) =>
                          setKyc({ ...kyc, country: e.target.value })
                        }
                        className="input-field mt-1"
                        placeholder="Country"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        ID Type
                      </label>
                      <select
                        value={kyc.idType}
                        onChange={(e) =>
                          setKyc({ ...kyc, idType: e.target.value })
                        }
                        className="input-field mt-1"
                      >
                        <option>Passport</option>
                        <option>Driver License</option>
                        <option>National ID</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Address
                      </label>
                      <input
                        value={kyc.address}
                        onChange={(e) =>
                          setKyc({ ...kyc, address: e.target.value })
                        }
                        className="input-field mt-1"
                        placeholder="Your address"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        ID Number
                      </label>
                      <input
                        value={kyc.idNumber}
                        onChange={(e) =>
                          setKyc({ ...kyc, idNumber: e.target.value })
                        }
                        className="input-field mt-1"
                        placeholder="ID number"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-vaulta-muted">
                    Your KYC will be reviewed by our team within 24-48 hours.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-vaulta-border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-vaulta-text">
                          Two-Factor Authentication
                        </p>
                        <p className="text-xs text-vaulta-muted">
                          Add an extra layer of security
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          await updateProfile({ twoFactorEnabled: true });
                          success("2FA enabled!");
                        }}
                        className="rounded-lg bg-vaulta-cerulean px-3 py-1.5 text-xs font-semibold text-white hover:bg-vaulta-cerulean-dark"
                      >
                        Enable
                      </button>
                    </div>
                  </div>
                  <div className="rounded-lg border border-vaulta-border p-4">
                    <p className="font-medium text-vaulta-text">
                      Email Verification
                    </p>
                    <p className="text-xs text-vaulta-muted mt-1">
                      Your email {user?.email} is verified.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <p className="text-sm text-vaulta-muted">
                    Your wallets will be automatically created for supported
                    assets. You can add or remove wallets from the Wallet page.
                  </p>
                  <div className="rounded-lg border border-vaulta-border p-4">
                    <p className="text-sm font-medium text-vaulta-text">
                      Default wallets to be created:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["BTC", "ETH", "USDT", "SOL", "BNB"].map((a) => (
                        <span
                          key={a}
                          className="rounded-lg bg-vaulta-cerulean/10 px-3 py-1 text-xs font-medium text-vaulta-cerulean"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-sm text-vaulta-muted">
                    Your account is ready! Here's what you can do:
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      {
                        icon: LayoutDashboard,
                        title: "View Dashboard",
                        desc: "Track your portfolio",
                      },
                      {
                        icon: Wallet,
                        title: "Deposit Funds",
                        desc: "Add funds to your wallet",
                      },
                      {
                        icon: FileCheck,
                        title: "Invest",
                        desc: "Choose an investment plan",
                      },
                      {
                        icon: Wallet,
                        title: "Start Mining",
                        desc: "Purchase mining contracts",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-lg border border-vaulta-border p-4"
                      >
                        <item.icon size={20} className="text-vaulta-cerulean" />
                        <p className="mt-2 text-sm font-medium text-vaulta-text">
                          {item.title}
                        </p>
                        <p className="text-xs text-vaulta-muted">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-vaulta-muted hover:text-vaulta-text transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              {step < steps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-vaulta-border px-4 py-2 text-sm font-medium text-vaulta-muted hover:border-vaulta-cerulean transition-colors"
                >
                  <SkipForward size={14} /> Skip
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-vaulta-cerulean px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-vaulta-cerulean-dark active:scale-[0.98] disabled:opacity-50"
              >
                {loading
                  ? "Submitting..."
                  : step === steps.length - 1
                    ? "Go to Dashboard"
                    : "Continue"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FileCheck,
  Lock,
  Wallet,
  LayoutDashboard,
  Check,
  ArrowRight,
  ArrowLeft,
  SkipForward,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { kycService } from "@/services";

export function OnboardingPage() {
  const { user, updateProfile } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [kyc, setKyc] = useState({
    legalName: "",
    dateOfBirth: "",
    country: "",
    address: "",
    idType: "Passport",
    idNumber: "",
  });

  const steps = [
    {
      icon: User,
      title: "Personal Details",
      desc: "Review your personal information",
    },
    {
      icon: FileCheck,
      title: "Identity Verification",
      desc: "Complete KYC verification",
    },
    { icon: Lock, title: "Security Setup", desc: "Secure your account" },
    { icon: Wallet, title: "Wallet Setup", desc: "Set up your wallets" },
    {
      icon: LayoutDashboard,
      title: "Dashboard Introduction",
      desc: "Get started with Nesviora Capital Market Limited",
    },
  ];

  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (step === 1 && kyc.legalName) {
      setLoading(true);
      try {
        await kycService.submitKYC(user?.id || "", kyc);
        success("KYC submitted for review!");
      } catch {
        // continue anyway
      }
      setLoading(false);
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleSkip = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div className="min-h-screen bg-vaulta-bg dark:bg-vaulta-dark-bg flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-vaulta-text">
            Welcome to Nesviora Capital Market Limited
            {user ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="mt-2 text-sm text-vaulta-muted">
            Let's get your account set up in a few quick steps
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    i < step
                      ? "bg-vaulta-spring text-vaulta-black"
                      : i === step
                        ? "bg-vaulta-cerulean text-white"
                        : "bg-vaulta-border text-vaulta-muted"
                  }`}
                >
                  {i < step ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <span
                  className={`mt-1.5 text-xs ${i <= step ? "text-vaulta-text font-medium" : "text-vaulta-muted"}`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full bg-vaulta-border overflow-hidden">
            <motion.div
              className="h-full bg-vaulta-cerulean"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-8 shadow-nesviora">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vaulta-cerulean/10 text-vaulta-cerulean">
                  <CurrentIcon size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-vaulta-text">
                    {steps[step].title}
                  </h2>
                  <p className="text-sm text-vaulta-muted">
                    {steps[step].desc}
                  </p>
                </div>
              </div>

              {step === 0 && (
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        First Name
                      </label>
                      <p className="font-medium text-vaulta-text">
                        {user?.firstName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Last Name
                      </label>
                      <p className="font-medium text-vaulta-text">
                        {user?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">Email</label>
                      <p className="font-medium text-vaulta-text">
                        {user?.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">Phone</label>
                      <p className="font-medium text-vaulta-text">
                        {user?.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Country
                      </label>
                      <p className="font-medium text-vaulta-text">
                        {user?.country}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-vaulta-muted">
                    Your details look correct? Continue to the next step.
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Legal Name
                      </label>
                      <input
                        value={kyc.legalName}
                        onChange={(e) =>
                          setKyc({ ...kyc, legalName: e.target.value })
                        }
                        className="input-field mt-1"
                        placeholder="Full legal name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={kyc.dateOfBirth}
                        onChange={(e) =>
                          setKyc({ ...kyc, dateOfBirth: e.target.value })
                        }
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Country
                      </label>
                      <input
                        value={kyc.country || user?.country || ""}
                        onChange={(e) =>
                          setKyc({ ...kyc, country: e.target.value })
                        }
                        className="input-field mt-1"
                        placeholder="Country"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        ID Type
                      </label>
                      <select
                        value={kyc.idType}
                        onChange={(e) =>
                          setKyc({ ...kyc, idType: e.target.value })
                        }
                        className="input-field mt-1"
                      >
                        <option>Passport</option>
                        <option>Driver License</option>
                        <option>National ID</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        Address
                      </label>
                      <input
                        value={kyc.address}
                        onChange={(e) =>
                          setKyc({ ...kyc, address: e.target.value })
                        }
                        className="input-field mt-1"
                        placeholder="Your address"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-vaulta-muted">
                        ID Number
                      </label>
                      <input
                        value={kyc.idNumber}
                        onChange={(e) =>
                          setKyc({ ...kyc, idNumber: e.target.value })
                        }
                        className="input-field mt-1"
                        placeholder="ID number"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-vaulta-muted">
                    Your KYC will be reviewed by our team within 24-48 hours.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-vaulta-border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-vaulta-text">
                          Two-Factor Authentication
                        </p>
                        <p className="text-xs text-vaulta-muted">
                          Add an extra layer of security
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          await updateProfile({ twoFactorEnabled: true });
                          success("2FA enabled!");
                        }}
                        className="rounded-lg bg-vaulta-cerulean px-3 py-1.5 text-xs font-semibold text-white hover:bg-vaulta-cerulean-dark"
                      >
                        Enable
                      </button>
                    </div>
                  </div>
                  <div className="rounded-lg border border-vaulta-border p-4">
                    <p className="font-medium text-vaulta-text">
                      Email Verification
                    </p>
                    <p className="text-xs text-vaulta-muted mt-1">
                      Your email {user?.email} is verified.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <p className="text-sm text-vaulta-muted">
                    Your wallets will be automatically created for supported
                    assets. You can add or remove wallets from the Wallet page.
                  </p>
                  <div className="rounded-lg border border-vaulta-border p-4">
                    <p className="text-sm font-medium text-vaulta-text">
                      Default wallets to be created:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["BTC", "ETH", "USDT", "SOL", "BNB"].map((a) => (
                        <span
                          key={a}
                          className="rounded-lg bg-vaulta-cerulean/10 px-3 py-1 text-xs font-medium text-vaulta-cerulean"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-sm text-vaulta-muted">
                    Your account is ready! Here's what you can do:
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      {
                        icon: LayoutDashboard,
                        title: "View Dashboard",
                        desc: "Track your portfolio",
                      },
                      {
                        icon: Wallet,
                        title: "Deposit Funds",
                        desc: "Add funds to your wallet",
                      },
                      {
                        icon: FileCheck,
                        title: "Invest",
                        desc: "Choose an investment plan",
                      },
                      {
                        icon: Wallet,
                        title: "Start Mining",
                        desc: "Purchase mining contracts",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-lg border border-vaulta-border p-4"
                      >
                        <item.icon size={20} className="text-vaulta-cerulean" />
                        <p className="mt-2 text-sm font-medium text-vaulta-text">
                          {item.title}
                        </p>
                        <p className="text-xs text-vaulta-muted">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-vaulta-muted hover:text-vaulta-text transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              {step < steps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-vaulta-border px-4 py-2 text-sm font-medium text-vaulta-muted hover:border-vaulta-cerulean transition-colors"
                >
                  <SkipForward size={14} /> Skip
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-vaulta-cerulean px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-vaulta-cerulean-dark active:scale-[0.98] disabled:opacity-50"
              >
                {loading
                  ? "Submitting..."
                  : step === steps.length - 1
                    ? "Go to Dashboard"
                    : "Continue"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
