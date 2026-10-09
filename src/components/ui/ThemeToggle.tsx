import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-vaulta-border bg-vaulta-surface p-1 transition-colors hover:border-vaulta-cerulean"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`flex h-7 w-7 items-center justify-center rounded-full ${
          theme === "dark"
            ? "bg-vaulta-dark-surface ml-auto"
            : "bg-vaulta-surface"
        }`}
      >
        {theme === "dark" ? (
          <Moon size={15} className="text-vaulta-spring" />
        ) : (
          <Sun size={15} className="text-vaulta-orange" />
        )}
      </motion.div>
    </button>
  );
}
