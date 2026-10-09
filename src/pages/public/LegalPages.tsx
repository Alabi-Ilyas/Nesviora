import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-vaulta-text">{title}</h1>
        <p className="mt-2 text-sm text-vaulta-muted">
          Last updated: {lastUpdated}
        </p>
      </motion.div>
      <div className="mt-8 space-y-6">{children}</div>
    </div>
  );
}

export function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing and using Nesviora Capital Market Limited, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.",
    },
    {
      title: "2. Eligibility",
      body: "You must be at least 18 years old and legally capable of entering into contracts. You are responsible for ensuring that your use of the platform complies with local laws.",
    },
    {
      title: "3. Account Registration",
      body: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account and password.",
    },
    {
      title: "4. Investment Plans",
      body: "Nesviora Capital Market Limited offers investment plans with different risk levels and durations. Returns are not guaranteed and depend on market conditions. You acknowledge the risks associated with digital asset investments.",
    },
    {
      title: "5. Fees",
      body: "Nesviora Capital Market Limited charges fees for certain transactions including investments, withdrawals, and mining contracts. Fees are clearly displayed before you confirm any transaction.",
    },
    {
      title: "6. Prohibited Activities",
      body: "You agree not to use the platform for illegal activities, money laundering, fraud, or any activity that violates applicable laws and regulations.",
    },
    {
      title: "7. Limitation of Liability",
      body: "Nesviora Capital Market Limited shall not be liable for indirect, incidental, or consequential damages arising from your use of the platform. Digital asset investments carry inherent risk.",
    },
    {
      title: "8. Modifications",
      body: "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.",
    },
    {
      title: "9. Termination",
      body: "We may suspend or terminate your account if you violate these terms or engage in suspicious activity. You may close your account at any time.",
    },
    {
      title: "10. Governing Law",
      body: "These terms are governed by applicable laws. Disputes shall be resolved through binding arbitration or in courts of competent jurisdiction.",
    },
  ];

  return (
    <LegalLayout title="Terms of Service" lastUpdated="October 2024">
      {sections.map((s) => (
        <div
          key={s.title}
          className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-6"
        >
          <h2 className="font-semibold text-vaulta-text">{s.title}</h2>
          <p className="mt-2 text-sm text-vaulta-muted">{s.body}</p>
        </div>
      ))}
    </LegalLayout>
  );
}

export function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      body: "We collect personal information you provide during registration including name, email, phone, country, and KYC verification documents. We also collect transaction data and usage analytics.",
    },
    {
      title: "2. How We Use Your Information",
      body: "We use your information to provide and improve our services, verify your identity, process transactions, communicate with you, and comply with legal obligations.",
    },
    {
      title: "3. Data Security",
      body: "We employ industry-standard security measures including encryption, cold storage, and access controls to protect your data. However, no method of transmission over the internet is 100% secure.",
    },
    {
      title: "4. Data Retention",
      body: "We retain your personal information for as long as your account is active or as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.",
    },
    {
      title: "5. Sharing of Information",
      body: "We do not sell your personal information. We may share data with service providers, legal authorities when required, and in connection with corporate transactions.",
    },
    {
      title: "6. Your Rights",
      body: "You have the right to access, correct, or delete your personal information. You can also opt out of certain communications and data processing activities.",
    },
    {
      title: "7. Cookies",
      body: "We use cookies and similar technologies to improve your experience, analyze traffic, and personalize content. You can control cookies through your browser settings.",
    },
    {
      title: "8. Children's Privacy",
      body: "Our services are not directed to individuals under 18. We do not knowingly collect personal information from minors.",
    },
    {
      title: "9. Changes to This Policy",
      body: "We may update this privacy policy from time to time. We will notify you of significant changes through the platform or via email.",
    },
  ];

  return (
    <LegalLayout title="Privacy Policy" lastUpdated="October 2024">
      {sections.map((s) => (
        <div
          key={s.title}
          className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-6"
        >
          <h2 className="font-semibold text-vaulta-text">{s.title}</h2>
          <p className="mt-2 text-sm text-vaulta-muted">{s.body}</p>
        </div>
      ))}
    </LegalLayout>
  );
}

export function RiskDisclosurePage() {
  return (
    <LegalLayout title="Risk Disclosure" lastUpdated="October 2024">
      <div className="rounded-nesviora border border-vaulta-warning/30 bg-vaulta-warning/5 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={24}
            className="mt-0.5 shrink-0 text-vaulta-warning"
          />
          <div>
            <h2 className="font-semibold text-vaulta-text">
              Important Risk Warning
            </h2>
            <p className="mt-2 text-sm text-vaulta-muted">
              Digital asset investments involve risk, including possible loss of
              principal. Past performance is not indicative of future results.
              Investment and mining estimates are not guarantees.
            </p>
          </div>
        </div>
      </div>

      {[
        {
          title: "Digital Asset Volatility",
          body: "Cryptocurrencies are highly volatile. Prices can fluctuate significantly in short periods, leading to substantial gains or losses. You should only invest what you can afford to lose.",
        },
        {
          title: "No Guaranteed Returns",
          body: "Nesviora Capital Market Limited does not guarantee any returns on investments. Target return rates are estimates based on historical data and market projections. Actual results may vary.",
        },
        {
          title: "Mining Risks",
          body: "Mining rewards depend on network difficulty, block rewards, and cryptocurrency prices. Estimated daily outputs are not guarantees of profit. Mining contracts may not always be profitable.",
        },
        {
          title: "Regulatory Risk",
          body: "Cryptocurrency regulations vary by jurisdiction and are evolving. Changes in regulations could affect the availability and legality of our services in certain regions.",
        },
        {
          title: "Technology Risk",
          body: "Digital assets rely on blockchain technology, which may be subject to vulnerabilities, bugs, or attacks. While we implement robust security, no system is completely immune.",
        },
        {
          title: "Liquidity Risk",
          body: "Some digital assets may have limited liquidity, making it difficult to buy or sell quickly without affecting the price. Withdrawal processing times may vary.",
        },
        {
          title: "No Insurance",
          body: "Digital asset investments on this platform are not insured by government deposit insurance. You acknowledge that you may lose some or all of your invested capital.",
        },
        {
          title: "Your Responsibility",
          body: "You are responsible for your investment decisions. We recommend conducting your own research and, if necessary, consulting with a qualified financial advisor before investing.",
        },
      ].map((s) => (
        <div
          key={s.title}
          className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-6"
        >
          <h2 className="font-semibold text-vaulta-text">{s.title}</h2>
          <p className="mt-2 text-sm text-vaulta-muted">{s.body}</p>
        </div>
      ))}

      <div className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-6">
        <h2 className="font-semibold text-vaulta-text">Acknowledgment</h2>
        <p className="mt-2 text-sm text-vaulta-muted">
          By using Nesviora Capital Market Limited, you acknowledge that you
          have read, understood, and accepted the risks outlined in this
          disclosure. You confirm that you are making investment decisions
          voluntarily and with full awareness of the associated risks.
        </p>
      </div>
    </LegalLayout>
  );
}
