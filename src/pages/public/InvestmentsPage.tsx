import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, AlertTriangle } from "lucide-react";
import { investmentService } from "@/services";
import { Skeleton } from "@/components/ui/States";
import type { InvestmentPlan } from "@/types";
import { formatCurrency } from "@/utils";

export function InvestmentsPage() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investmentService.getPlans().then((data) => {
      setPlans(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-vaulta-text">
          Investment Plans
        </h1>
        <p className="mt-2 text-vaulta-muted max-w-2xl">
          Choose a plan that aligns with your investment goals and risk
          tolerance. All plans include transparent fees and clear terms.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 skeleton rounded-nesviora" />
            ))
          : plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                <div className="mt-4 space-y-2">
                  <div>
                    <p className="text-sm text-vaulta-muted">Minimum</p>
                    <p className="text-2xl font-bold text-vaulta-text">
                      {formatCurrency(plan.minAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-vaulta-muted">Maximum</p>
                    <p className="text-lg font-semibold text-vaulta-text">
                      {formatCurrency(plan.maxAmount)}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
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
                <p className="mt-3 text-xs text-vaulta-muted">
                  {plan.description}
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-vaulta-muted">
                  <div className="flex justify-between">
                    <span>Fees</span>
                    <span className="font-medium text-vaulta-text">
                      {plan.fees}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supported Assets</span>
                    <span className="font-medium text-vaulta-text">
                      {plan.supportedAssets.join(", ")}
                    </span>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-vaulta-cerulean py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vaulta-cerulean-dark"
                >
                  Get Started <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
      </div>

      <div className="mt-8 rounded-nesviora border border-vaulta-warning/20 bg-vaulta-warning/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0 text-vaulta-warning"
          />
          <div>
            <h3 className="text-sm font-semibold text-vaulta-text">
              Risk Disclosure
            </h3>
            <p className="mt-1 text-xs text-vaulta-muted">
              Digital asset investments involve risk, including possible loss of
              principal. Past performance is not indicative of future results.
              Investment and mining estimates are not guarantees. Returns shown
              are target rates and may vary based on market conditions.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-nesviora border border-vaulta-border bg-vaulta-surface p-6">
        <h3 className="text-lg font-semibold text-vaulta-text">
          How Investment Plans Work
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Choose a Plan",
              desc: "Select a plan that matches your investment goals and risk tolerance.",
            },
            {
              title: "Deposit & Invest",
              desc: "Fund your account and allocate capital to your chosen plan.",
            },
            {
              title: "Monitor & Withdraw",
              desc: "Track performance in real-time and withdraw when the term ends.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-vaulta-border p-4"
            >
              <h4 className="text-sm font-semibold text-vaulta-text">
                {item.title}
              </h4>
              <p className="mt-1 text-xs text-vaulta-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
