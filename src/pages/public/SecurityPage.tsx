import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  KeyRound,
  FileCheck,
  Eye,
  AlertTriangle,
  Check,
} from "lucide-react";

export function SecurityPage() {
  const features = [
    {
      icon: Lock,
      title: "Cold Storage",
      desc: "The majority of digital assets are stored in offline cold wallets, keeping them safe from online threats.",
    },
    {
      icon: KeyRound,
      title: "Two-Factor Authentication",
      desc: "Enable 2FA to add an extra layer of protection to your account. We support authenticator apps.",
    },
    {
      icon: Shield,
      title: "Encryption",
      desc: "All sensitive data is encrypted in transit and at rest using industry-standard encryption protocols.",
    },
    {
      icon: FileCheck,
      title: "KYC & AML Compliance",
      desc: "Comprehensive identity verification and anti-money laundering procedures protect the platform.",
    },
    {
      icon: Eye,
      title: "Continuous Monitoring",
      desc: "Our security team monitors the platform 24/7 for suspicious activity and potential threats.",
    },
    {
      icon: AlertTriangle,
      title: "Withdrawal Protection",
      desc: "Withdrawals require verification and are reviewed by our team to prevent unauthorized transactions.",
    },
  ];

  const practices = [
    "Use a strong, unique password for your account",
    "Enable two-factor authentication immediately",
    "Never share your password or 2FA codes with anyone",
    "Verify withdrawal addresses before sending funds",
    "Be cautious of phishing emails and fake websites",
    "Keep your devices and browsers updated",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-vaulta-cerulean/10">
          <Shield size={32} className="text-vaulta-cerulean" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-vaulta-text">
          Security at Nesviora Capital Market Limited
        </h1>
        <p className="mt-3 text-vaulta-muted max-w-2xl mx-auto">
          Security is the foundation of everything we do. We employ multiple
          layers of protection to safeguard your assets and data.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-6 shadow-vaulta-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vaulta-cerulean/10 text-vaulta-cerulean">
                <Icon size={24} />
              </div>
              <h3 className="mt-4 font-semibold text-vaulta-text">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-vaulta-muted">{feature.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-8 shadow-vaulta-sm">
          <h2 className="text-xl font-bold text-vaulta-text">
            Security Best Practices for Users
          </h2>
          <ul className="mt-4 space-y-3">
            {practices.map((practice) => (
              <li
                key={practice}
                className="flex items-start gap-3 text-sm text-vaulta-text"
              >
                <Check
                  size={18}
                  className="mt-0.5 shrink-0 text-vaulta-spring-dark dark:text-vaulta-spring"
                />
                {practice}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-nesviora border border-vaulta-warning/20 bg-vaulta-warning/5 p-8">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={24}
              className="mt-0.5 shrink-0 text-vaulta-warning"
            />
            <div>
              <h2 className="text-xl font-bold text-vaulta-text">
                Important Security Notice
              </h2>
              <p className="mt-2 text-sm text-vaulta-muted">
                While we implement comprehensive security measures, no platform
                is 100% immune to risk. Digital assets are inherently volatile
                and carry risk. We recommend diversifying your portfolio and
                only investing what you can afford to lose.
              </p>
              <p className="mt-3 text-sm text-vaulta-muted">
                Nesviora Capital Market Limited staff will never ask for your
                password, 2FA codes, or private keys. If anyone contacts you
                requesting this information, please report it to our support
                team immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
