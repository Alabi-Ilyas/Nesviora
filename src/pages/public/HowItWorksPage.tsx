import { motion } from "framer-motion";
import {
  UserPlus,
  FileCheck,
  Wallet,
  TrendingUp,
  Monitor,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export function HowItWorksPage() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Account",
      desc: "Sign up with your email, complete your profile with personal details, and set up your security preferences.",
    },
    {
      icon: FileCheck,
      title: "Complete KYC Verification",
      desc: "Verify your identity by providing legal name, date of birth, address, and a government-issued ID. This ensures platform security and regulatory compliance.",
    },
    {
      icon: Wallet,
      title: "Deposit Funds",
      desc: "Choose from multiple deposit methods including crypto transfer Funds appear in your wallet once confirmed.",
    },
    {
      icon: TrendingUp,
      title: "Choose an Investment Plan",
      desc: "Select from STARTER, GROWTH, PRO, or ELITE plans based on your capital and risk tolerance. Each plan has clear terms and transparent fees.",
    },
    {
      icon: Monitor,
      title: "Monitor & Grow",
      desc: "Track your portfolio performance in real time, view mining activity, and manage your assets from a single dashboard.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-vaulta-text">
          How Nesviora Capital Market Limited Works
        </h1>
        <p className="mt-3 text-vaulta-muted max-w-2xl mx-auto">
          Get started with Nesviora Capital Market Limited in five simple steps.
          From account creation to portfolio management, we guide you through
          every stage.
        </p>
      </motion.div>

      <div className="mt-12 space-y-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-6 rounded-nesviora border border-vaulta-border bg-vaulta-surface p-6 shadow-vaulta-sm"
            >
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vaulta-cerulean text-white">
                  <Icon size={22} />
                </div>
                {i < steps.length - 1 && (
                  <div className="mt-2 h-full w-px bg-vaulta-border" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-vaulta-cerulean/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-semibold text-vaulta-text">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-vaulta-muted">{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 rounded-nesviora bg-vaulta-cerulean p-8 text-center shadow-vaulta-lg">
        <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
        <p className="mt-2 text-white/80">
          Create your account today and start building your digital asset
          portfolio.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-vaulta-spring px-6 py-3 text-sm font-semibold text-vaulta-black transition-all hover:bg-vaulta-spring-dark active:scale-[0.98]"
        >
          Create Account <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
