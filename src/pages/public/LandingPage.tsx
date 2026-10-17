import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  TrendingUp,
  Pickaxe,
  Wallet,
  ArrowRight,
  Check,
  Lock,
  BarChart3,
  Zap,
  Globe,
  Users,
  Award,
} from "lucide-react";
import { cryptoService } from "@/services/cryptoService";
import { investmentService, miningService, contentService } from "@/services";
import {
  AreaChart,
  PieChartComponent,
  MiniSparkline,
} from "@/components/charts/Charts";
import type {
  Asset,
  InvestmentPlan,
  MiningPlan,
  Testimonial,
  FAQ,
} from "@/types";
import { formatCurrency, formatCompact } from "@/utils";

export function LandingPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [miningPlans, setMiningPlans] = useState<MiningPlan[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<
    { time: string; value: number }[]
  >([]);

  useEffect(() => {
    Promise.all([
      cryptoService.getMarkets(),
      investmentService.getPlans(),
      miningService.getPlans(),
      contentService.getTestimonials(),
      contentService.getFAQs(),
      cryptoService.getPortfolioChart(30),
    ]).then(([a, p, m, t, f, chart]) => {
      setAssets(a);
      setPlans(p.filter((p) => p.status === "active"));
      setMiningPlans(m.filter((m) => m.status === "active").slice(0, 3));
      setTestimonials(t.filter((x) => !x.isDemo));
      setFaqs(f.slice(0, 6));
      setPortfolioData(chart);
      setLoading(false);
    });
  }, []);

  const allocationData = [
    { name: "BTC", value: 45 },
    { name: "ETH", value: 25 },
    { name: "USDT", value: 20 },
    { name: "Other", value: 10 },
  ];

  const stats = [
    { label: "Assets Under Management", value: "$2.4B+", icon: Wallet },
    { label: "Active Investors", value: "180K+", icon: Users },
    { label: "Countries Supported", value: "120+", icon: Globe },
    { label: "Uptime", value: "99.9%", icon: Zap },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Smart Investing",
      desc: "Diversified investment plans designed for different risk appetites and capital levels.",
    },
    {
      icon: Pickaxe,
      title: "Mining Infrastructure",
      desc: "Cloud mining contracts with transparent pricing and real-time monitoring.",
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      desc: "Cold storage, 2FA, encryption, and continuous monitoring protect your assets.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      desc: "Track portfolio performance, asset allocation, and market movements in real time.",
    },
    {
      icon: Lock,
      title: "KYC Verified",
      desc: "Comprehensive identity verification ensures a secure and compliant platform.",
    },
    {
      icon: Award,
      title: "Low Fees",
      desc: "Competitive and transparent fee structure with no hidden charges.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vaulta-cerulean/5 via-transparent to-vaulta-spring/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-vaulta-border bg-vaulta-surface px-3 py-1 text-xs font-medium text-vaulta-muted">
                <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-vaulta-spring" />
                Trusted by 180,000+ investors worldwide
              </div>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-vaulta-text lg:text-5xl xl:text-6xl">
                Build your digital asset strategy with confidence
              </h1>
              <p className="mt-5 text-lg text-vaulta-muted">
                Nesviora Capital Market Limited is a cryptocurrency investment
                and digital asset management platform. Invest, monitor, and grow
                your portfolio with institutional-grade tools and security.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-vaulta-cerulean px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-vaulta-cerulean-dark active:scale-[0.98]"
                >
                  Create Account <ArrowRight size={18} />
                </Link>
                <Link
                  to="/markets"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-vaulta-border bg-vaulta-surface px-6 py-3 text-sm font-semibold text-vaulta-text transition-all hover:border-vaulta-cerulean active:scale-[0.98]"
                >
                  Explore Markets
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-vaulta-muted">
                <div className="flex items-center gap-2">
                  <Check
                    size={16}
                    className="text-vaulta-spring-dark dark:text-vaulta-spring"
                  />{" "}
                  No hidden fees
                </div>
                <div className="flex items-center gap-2">
                  <Check
                    size={16}
                    className="text-vaulta-spring-dark dark:text-vaulta-spring"
                  />{" "}
                  24/7 support
                </div>
              </div>
            </motion.div>

            {/* Dashboard preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-5 shadow-vaulta-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-vaulta-muted">
                    Total Portfolio Value
                  </p>
                  <h3 className="text-2xl font-bold text-vaulta-text">
                    $24,850.00
                  </h3>
                </div>
                <span className="rounded-lg bg-vaulta-spring/10 px-2.5 py-1 text-xs font-medium text-vaulta-spring-dark dark:text-vaulta-spring">
                  +12.4%
                </span>
              </div>
              <AreaChart data={portfolioData} height={180} />
              <div className="mt-4 grid grid-cols-4 gap-3">
                {assets.slice(0, 4).map((asset) => (
                  <div
                    key={asset.id}
                    className="rounded-lg border border-vaulta-border p-3"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-vaulta-text">
                        {asset.symbol}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-vaulta-muted">
                      {formatCurrency(
                        asset.price,
                        "USD",
                        asset.price < 1 ? 4 : 0,
                      )}
                    </p>
                    <p
                      className={`text-xs font-medium ${asset.change24h >= 0 ? "text-vaulta-spring-dark dark:text-vaulta-spring" : "text-vaulta-danger"}`}
                    >
                      {asset.change24h >= 0 ? "+" : ""}
                      {asset.change24h.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live market ticker */}
      <section className="border-y border-vaulta-border bg-vaulta-surface py-4">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <span className="shrink-0 text-xs font-semibold text-vaulta-muted">
              LIVE MARKETS
            </span>
            {loading ? (
              <div className="flex gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 w-32 skeleton rounded" />
                ))}
              </div>
            ) : (
              assets.map((asset) => (
                <Link
                  key={asset.id}
                  to="/markets"
                  className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-1.5 hover:bg-vaulta-cerulean/5 transition-colors"
                >
                  <span className="text-sm font-bold text-vaulta-text">
                    {asset.symbol}
                  </span>
                  <span className="text-sm text-vaulta-muted">
                    {formatCurrency(
                      asset.price,
                      "USD",
                      asset.price < 1 ? 4 : 0,
                    )}
                  </span>
                  <span
                    className={`text-xs font-medium ${asset.change24h >= 0 ? "text-vaulta-spring-dark dark:text-vaulta-spring" : "text-vaulta-danger"}`}
                  >
                    {asset.change24h >= 0 ? "+" : ""}
                    {asset.change24h.toFixed(2)}%
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-6 text-center shadow-vaulta-sm"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-vaulta-cerulean/10 text-vaulta-cerulean">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-vaulta-text">
                    {stat.value}
                  </h3>
                  <p className="mt-1 text-sm text-vaulta-muted">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-vaulta-surface dark:bg-vaulta-dark-surface">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-vaulta-text">
              How Nesviora Capital Market Limited Works
            </h2>
            <p className="mt-3 text-vaulta-muted">
              Get started in three simple steps
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create Your Account",
                desc: "Sign up, complete your profile, and verify your identity through our KYC process.",
              },
              {
                step: "02",
                title: "Deposit Funds",
                desc: "Choose from multiple deposit methods including crypto transfer, bank transfer, or card.",
              },
              {
                step: "03",
                title: "Start Investing",
                desc: "Select an investment plan or mining contract, and monitor your portfolio in real time.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative rounded-nesviora border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg p-6"
              >
                <span className="text-4xl font-bold text-vaulta-cerulean/20">
                  {item.step}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-vaulta-text">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-vaulta-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment plans */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-vaulta-text">
              Investment Plans
            </h2>
            <p className="mt-3 text-vaulta-muted max-w-2xl">
              Choose a plan that fits your investment goals and risk tolerance.
              All plans include transparent fees and terms.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-72 skeleton rounded-nesviora" />
                ))
              : plans.map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative rounded-nesviora border p-6 shadow-vaulta-sm transition-all hover:shadow-nesviora ${
                      plan.name === "GROWTH"
                        ? "border-vaulta-cerulean ring-1 ring-vaulta-cerulean/20"
                        : "border-vaulta-border"
                    }`}
                  >
                    {plan.name === "GROWTH" && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-vaulta-cerulean px-3 py-0.5 text-xs font-semibold text-white">
                        Popular
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-vaulta-text">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-xs text-vaulta-muted">
                      {plan.durationDays} days
                    </p>
                    <div className="mt-4">
                      <p className="text-sm text-vaulta-muted">Minimum</p>
                      <p className="text-2xl font-bold text-vaulta-text">
                        {formatCurrency(plan.minAmount)}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-vaulta-muted">Maximum</p>
                      <p className="text-lg font-semibold text-vaulta-text">
                        {formatCurrency(plan.maxAmount)}
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-medium ${
                            plan.riskLevel === "low"
                              ? "bg-vaulta-spring/10 text-vaulta-spring-dark dark:text-vaulta-spring"
                              : plan.riskLevel === "medium"
                                ? "bg-vaulta-warning/10 text-vaulta-warning"
                                : "bg-vaulta-danger/10 text-vaulta-danger"
                          }`}
                        >
                          {plan.riskLevel} risk
                        </span>
                      </div>
                      <p className="text-xs text-vaulta-muted">
                        {plan.description}
                      </p>
                    </div>
                    <Link
                      to="/register"
                      className="mt-5 block rounded-lg bg-vaulta-cerulean py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-vaulta-cerulean-dark"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                ))}
          </div>
          <p className="mt-6 text-center text-xs text-vaulta-muted">
            Digital asset investments involve risk, including possible loss of
            principal. Returns are not guaranteed.
          </p>
        </div>
      </section>

      {/* Mining overview */}
      <section className="py-16 bg-vaulta-surface dark:bg-vaulta-dark-surface">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-vaulta-text">
              Mining Infrastructure
            </h2>
            <p className="mt-3 text-vaulta-muted max-w-2xl">
              Cloud mining contracts with industry-leading hardware and
              transparent pricing.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 skeleton rounded-nesviora" />
                ))
              : miningPlans.map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-nesviora border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg p-6 shadow-vaulta-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vaulta-orange/10 text-vaulta-orange">
                        <Pickaxe size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-vaulta-text">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-vaulta-muted">
                          {plan.asset}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-vaulta-muted">Hashrate</span>
                        <span className="font-medium text-vaulta-text">
                          {plan.hashrate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-vaulta-muted">Duration</span>
                        <span className="font-medium text-vaulta-text">
                          {plan.durationDays} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-vaulta-muted">Price</span>
                        <span className="font-medium text-vaulta-text">
                          {formatCurrency(plan.price)}
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/mining"
                      className="mt-4 block rounded-lg border border-vaulta-border py-2 text-center text-sm font-medium text-vaulta-text hover:border-vaulta-cerulean transition-colors"
                    >
                      View Details
                    </Link>
                  </motion.div>
                ))}
          </div>
          <p className="mt-6 text-center text-xs text-vaulta-muted">
            Mining estimates are not guarantees of profit. Actual results depend
            on network conditions and market factors.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-vaulta-text">
              Why Choose Nesviora Capital Market Limited
            </h2>
            <p className="mt-3 text-vaulta-muted max-w-2xl">
              A comprehensive platform built for digital asset management
            </p>
          </div>
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
                  <h3 className="mt-4 text-lg font-semibold text-vaulta-text">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-vaulta-muted">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio visualization */}
      <section className="py-16 bg-vaulta-surface dark:bg-vaulta-dark-surface">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-vaulta-text">
                Track Your Portfolio in Real Time
              </h2>
              <p className="mt-4 text-vaulta-muted">
                Monitor your investments, mining contracts, and asset allocation
                with intuitive dashboards. Make informed decisions with
                real-time market data and performance analytics.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Real-time portfolio valuation",
                  "Asset allocation visualization",
                  "Transaction history and records",
                  "Performance tracking with time filters",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-vaulta-text"
                  >
                    <Check
                      size={18}
                      className="text-vaulta-spring-dark dark:text-vaulta-spring"
                    />{" "}
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-vaulta-cerulean px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-vaulta-cerulean-dark"
              >
                Start Investing <ArrowRight size={18} />
              </Link>
            </div>
            <div className="rounded-nesviora border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg p-6 shadow-nesviora">
              <h3 className="text-sm font-semibold text-vaulta-text mb-4">
                Asset Allocation
              </h3>
              <PieChartComponent
                data={allocationData}
                height={220}
                valuePrefix=""
              />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {allocationData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        background: [
                          "#006989",
                          "#0CF574",
                          "#FF7D00",
                          "#FFB020",
                        ][i],
                      }}
                    />
                    <span className="text-sm text-vaulta-text">
                      {item.name}
                    </span>
                    <span className="text-sm text-vaulta-muted">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (only shown when there are real ones) */}
      {testimonials.length > 0 && (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-vaulta-text">
              What Our Users Say
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-6 shadow-vaulta-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vaulta-cerulean text-sm font-semibold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-vaulta-text">{t.name}</p>
                      {t.verified && (
                        <Check
                          size={14}
                          className="text-vaulta-spring-dark dark:text-vaulta-spring"
                        />
                      )}
                    </div>
                    <p className="text-xs text-vaulta-muted">{t.country}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-vaulta-muted">"{t.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* FAQ preview */}
      <section className="py-16 bg-vaulta-surface dark:bg-vaulta-dark-surface">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-vaulta-text">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-nesviora border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg p-4"
              >
                <h3 className="font-semibold text-vaulta-text text-sm">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm text-vaulta-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1 text-sm font-medium text-vaulta-cerulean hover:underline"
            >
              View all FAQs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="rounded-nesviora bg-vaulta-cerulean p-10 text-center shadow-vaulta-lg lg:p-16">
            <h2 className="text-3xl font-bold text-white lg:text-4xl">
              Secure your digital future today
            </h2>
            <p className="mt-4 text-white/80">
              Join 180,000+ investors who trust Nesviora Capital Market Limited
              with their digital asset portfolio.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-vaulta-spring px-6 py-3 text-sm font-semibold text-vaulta-black transition-all hover:bg-vaulta-spring-dark active:scale-[0.98]"
              >
                Create Account <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
