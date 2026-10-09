import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Pickaxe,
  ArrowRight,
  AlertTriangle,
  Zap,
  Clock,
  Cpu,
} from "lucide-react";
import { miningService } from "@/services";
import { Skeleton, EmptyState } from "@/components/ui/States";
import { Modal } from "@/components/ui/Modal";
import type { MiningPlan } from "@/types";
import { formatCurrency } from "@/utils";

export function MiningPage() {
  const [plans, setPlans] = useState<MiningPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MiningPlan | null>(null);

  useEffect(() => {
    miningService.getPlans().then((data) => {
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
          Mining Infrastructure
        </h1>
        <p className="mt-2 text-vaulta-muted max-w-2xl">
          Cloud mining contracts with industry-leading hardware and transparent
          pricing. Monitor your mining activity in real time.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-72 skeleton rounded-nesviora" />
          ))
        ) : plans.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Pickaxe}
              title="No mining plans available"
              message="Check back later for new mining contracts."
            />
          </div>
        ) : (
          plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-6 shadow-vaulta-sm transition-all hover:shadow-nesviora"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vaulta-orange/10 text-vaulta-orange">
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-vaulta-text">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-vaulta-muted">{plan.asset}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-vaulta-muted">
                    <Zap size={14} /> Hashrate
                  </span>
                  <span className="font-medium text-vaulta-text">
                    {plan.hashrate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-vaulta-muted">
                    <Clock size={14} /> Duration
                  </span>
                  <span className="font-medium text-vaulta-text">
                    {plan.durationDays} days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-vaulta-muted">Electricity Fee</span>
                  <span className="font-medium text-vaulta-text">
                    ${plan.electricityFee}/kWh
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-vaulta-muted">Capacity</span>
                  <span className="font-medium text-vaulta-text">
                    {plan.capacity} units
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-vaulta-muted">
                {plan.description}
              </p>

              <div className="mt-4 border-t border-vaulta-border pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-vaulta-muted">Price</p>
                    <p className="text-xl font-bold text-vaulta-text">
                      {formatCurrency(plan.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-vaulta-muted">
                      Est. Daily Output
                    </p>
                    <p className="text-sm font-medium text-vaulta-spring-dark dark:text-vaulta-spring">
                      {plan.estimatedDailyOutput} {plan.asset}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSelected(plan)}
                  className="flex-1 rounded-lg border border-vaulta-border py-2 text-center text-sm font-medium text-vaulta-text hover:border-vaulta-cerulean transition-colors"
                >
                  View Details
                </button>
                <Link
                  to="/register"
                  className="flex-1 rounded-lg bg-vaulta-cerulean py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-vaulta-cerulean-dark"
                >
                  Purchase
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-8 rounded-nesviora border border-vaulta-warning/20 bg-vaulta-warning/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0 text-vaulta-warning"
          />
          <div>
            <h3 className="text-sm font-semibold text-vaulta-text">
              Important Notice
            </h3>
            <p className="mt-1 text-xs text-vaulta-muted">
              Mining estimates are not guarantees of profit. Actual mining
              rewards depend on network difficulty, block rewards, market
              prices, and operational costs. Past performance is not indicative
              of future results.
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-vaulta-muted">{selected.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Asset</p>
                <p className="font-semibold text-vaulta-text">
                  {selected.asset}
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Hashrate</p>
                <p className="font-semibold text-vaulta-text">
                  {selected.hashrate}
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Contract Duration</p>
                <p className="font-semibold text-vaulta-text">
                  {selected.durationDays} days
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Electricity Fee</p>
                <p className="font-semibold text-vaulta-text">
                  ${selected.electricityFee}/kWh
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Est. Daily Output</p>
                <p className="font-semibold text-vaulta-spring-dark dark:text-vaulta-spring">
                  {selected.estimatedDailyOutput} {selected.asset}
                </p>
              </div>
              <div className="rounded-lg border border-vaulta-border p-3">
                <p className="text-xs text-vaulta-muted">Price</p>
                <p className="font-semibold text-vaulta-text">
                  {formatCurrency(selected.price)}
                </p>
              </div>
            </div>
            <p className="text-xs text-vaulta-muted">
              Estimated daily output is based on current network conditions and
              may vary. This is not a guarantee of returns.
            </p>
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 rounded-lg bg-vaulta-cerulean py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vaulta-cerulean-dark"
            >
              Create Account to Purchase <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
}
