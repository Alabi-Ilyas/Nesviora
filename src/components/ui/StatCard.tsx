import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  positive?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  positive = true,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-nesviora border border-vaulta-border bg-vaulta-surface p-5 shadow-vaulta-sm transition-all hover:shadow-nesviora",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm text-vaulta-muted">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-vaulta-text">{value}</h3>
          {change && (
            <p
              className={cn(
                "mt-1.5 text-sm font-medium",
                positive
                  ? "text-vaulta-spring-dark dark:text-vaulta-spring"
                  : "text-vaulta-danger",
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-vaulta-cerulean/10 text-vaulta-cerulean">
          <Icon size={21} />
        </div>
      </div>
    </motion.div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-nesviora border border-vaulta-border bg-vaulta-surface p-5 shadow-vaulta-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
