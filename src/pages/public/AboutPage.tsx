import { motion } from "framer-motion";
import {
  Shield,
  TrendingUp,
  Users,
  Award,
  Lock,
  Eye,
  Globe,
  Zap,
} from "lucide-react";

export function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Security",
      desc: "Bank-grade security with cold storage, encryption, and continuous monitoring.",
    },
    {
      icon: Eye,
      title: "Transparency",
      desc: "Clear fees, visible terms, and open communication with our community.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      desc: "Continuously improving our platform with the latest fintech and crypto technologies.",
    },
    {
      icon: Lock,
      title: "Compliance",
      desc: "Adhering to regulatory standards with comprehensive KYC and AML procedures.",
    },
  ];

  const stats = [
    { label: "Assets Under Management", value: "$2.4B+" },
    { label: "Active Investors", value: "180K+" },
    { label: "Countries", value: "120+" },
    { label: "Uptime", value: "99.9%" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-vaulta-text">
          About Nesviora Capital Market Limited
        </h1>
        <p className="mt-2 text-vaulta-muted max-w-2xl">
          Building the future of digital asset management with security,
          transparency, and innovation at our core.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-8 shadow-vaulta-sm"
        >
          <h2 className="text-2xl font-bold text-vaulta-text">Our Mission</h2>
          <p className="mt-4 text-sm text-vaulta-muted">
            Nesviora Capital Market Limited was founded with a clear mission: to
            make digital asset investing accessible, secure, and transparent for
            everyone. We believe that the future of finance is digital, and
            we're building the infrastructure to help individuals and
            institutions participate confidently in the digital asset economy.
          </p>
          <p className="mt-3 text-sm text-vaulta-muted">
            Our platform combines institutional-grade security with an intuitive
            user experience, enabling investors of all levels to manage their
            digital portfolios with confidence. From investment plans to mining
            infrastructure, we provide the tools needed to build a diversified
            digital asset strategy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-nesviora border border-vaulta-border bg-vaulta-cerulean p-8 text-white shadow-vaulta-sm"
        >
          <Zap size={32} className="text-vaulta-spring" />
          <h2 className="mt-4 text-2xl font-bold">
            Secure your digital future
          </h2>
          <p className="mt-3 text-sm text-white/80">
            We combine cutting-edge technology with rigorous security practices
            to create a platform that investors can trust. Every feature is
            designed with user protection in mind.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-vaulta-text text-center">
          Our Values
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
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
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-vaulta-muted">{value.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 rounded-nesviora border border-vaulta-border bg-vaulta-surface p-8 shadow-vaulta-sm">
        <h2 className="text-2xl font-bold text-vaulta-text">Our Approach</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "User-Centric",
              desc: "Every decision starts with what's best for our users. We build features that solve real problems.",
            },
            {
              icon: Shield,
              title: "Security First",
              desc: "We never compromise on security. Cold storage, 2FA, and continuous monitoring are standard.",
            },
            {
              icon: Award,
              title: "Excellence",
              desc: "We strive for excellence in every aspect — from code quality to customer support.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-lg border border-vaulta-border p-5"
              >
                <Icon size={24} className="text-vaulta-cerulean" />
                <h3 className="mt-3 font-semibold text-vaulta-text">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-vaulta-muted">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
