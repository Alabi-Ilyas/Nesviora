import { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "Markets", path: "/markets" },
  { label: "Invest", path: "/investments" },
  { label: "Security", path: "/security" },
  { label: "About", path: "/about" },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src="/assets/images/nesviora_logo_tight.png"
        alt="Nesviora Capital Market Limited"
        className="h-12 w-auto rounded-md object-contain"
      />
    </Link>
  );
}

export function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-vaulta-bg dark:bg-vaulta-dark-bg">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-vaulta-border bg-vaulta-surface/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-vaulta-cerulean"
                    : "text-vaulta-muted hover:text-vaulta-text"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="hidden items-center gap-2 lg:flex">
                <button
                  onClick={() =>
                    navigate(user.role === "admin" ? "/admin" : "/dashboard")
                  }
                  className="rounded-lg bg-vaulta-cerulean px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-vaulta-cerulean-dark"
                >
                  {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-vaulta-muted hover:text-vaulta-text transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-vaulta-cerulean px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-vaulta-cerulean-dark"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-vaulta-text lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-vaulta-border lg:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-vaulta-cerulean/10 text-vaulta-cerulean"
                        : "text-vaulta-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-vaulta-border" />
                {user ? (
                  <Link
                    to={user.role === "admin" ? "/admin" : "/dashboard"}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-vaulta-cerulean px-3 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-vaulta-muted"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg bg-vaulta-cerulean px-3 py-2.5 text-center text-sm font-semibold text-white"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-vaulta-border bg-vaulta-surface">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2">
              <Logo />
              <p className="mt-4 max-w-xs text-sm text-vaulta-muted">
                Secure your digital future. Invest, monitor, and grow your
                digital asset portfolio with confidence.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-lg bg-vaulta-cerulean/10 px-3 py-1 text-xs font-medium text-vaulta-cerulean">
                  Secure
                </span>
                <span className="rounded-lg bg-vaulta-spring/10 px-3 py-1 text-xs font-medium text-vaulta-spring-dark dark:text-vaulta-spring">
                  Transparent
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-vaulta-text">
                Platform
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    to="/markets"
                    className="text-vaulta-muted hover:text-vaulta-cerulean transition-colors"
                  >
                    Markets
                  </Link>
                </li>
                <li>
                  <Link
                    to="/investments"
                    className="text-vaulta-muted hover:text-vaulta-cerulean transition-colors"
                  >
                    Invest
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    className="text-vaulta-muted hover:text-vaulta-cerulean transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-vaulta-text">
                Company
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="text-vaulta-muted hover:text-vaulta-cerulean transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="text-vaulta-muted hover:text-vaulta-cerulean transition-colors"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-vaulta-muted hover:text-vaulta-cerulean transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-vaulta-muted hover:text-vaulta-cerulean transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-vaulta-text">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    to="/terms"
                    className="text-vaulta-muted hover:text-vaulta-cerulean transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-vaulta-muted hover:text-vaulta-cerulean transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/risk-disclosure"
                    className="text-vaulta-muted hover:text-vaulta-cerulean transition-colors"
                  >
                    Risk Disclosure
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-vaulta-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-vaulta-muted">
              © 2026 Nesviora Capital Market Limited. All rights reserved.
            </p>
            <p className="text-xs text-vaulta-muted">
              Digital asset investments involve risk. Past performance is not
              indicative of future results.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
