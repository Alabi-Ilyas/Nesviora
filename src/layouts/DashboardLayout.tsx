import { Logo } from '@/components/ui/Logo';
import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wallet, TrendingUp, Pickaxe, ArrowDownToLine,
  ArrowUpFromLine, ArrowLeftRight, Users, LifeBuoy, Settings,
  Menu, X, LogOut, Shield, Bell, Search, ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const sidebarLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Wallet', path: '/dashboard/wallet', icon: Wallet },
  { label: 'Deposit', path: '/dashboard/deposit', icon: ArrowDownToLine },
  { label: 'Withdraw', path: '/dashboard/withdraw', icon: ArrowUpFromLine },
  { label: 'Investments', path: '/dashboard/investments', icon: TrendingUp },
  { label: 'Transactions', path: '/dashboard/transactions', icon: ArrowLeftRight },
  { label: 'Support', path: '/dashboard/support', icon: LifeBuoy },
  { label: 'Security', path: '/dashboard/security', icon: Shield },
  { label: 'Profile', path: '/dashboard/profile', icon: Settings },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Desktop sidebar can be collapsed; the choice is remembered. Below lg the menu button opens the drawer.
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebar-collapsed') === '1'; } catch { return false; }
  });
  const toggleMenu = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setCollapsed((c) => {
        const next = !c;
        try { localStorage.setItem('sidebar-collapsed', next ? '1' : '0'); } catch { /* ignore */ }
        return next;
      });
    } else {
      setSidebarOpen(true);
    }
  };
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2 px-4 py-5">
        <Logo to="/" className="h-12" />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2 scrollbar-hide">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-vaulta-cerulean text-white'
                  : 'text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean'
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-vaulta-border p-3">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2">
          <ThemeToggle />
          <span className="text-xs text-vaulta-muted">Theme</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-vaulta-muted transition-colors hover:bg-vaulta-danger/10 hover:text-vaulta-danger"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-vaulta-bg dark:bg-vaulta-dark-bg">

      {/* Desktop sidebar */}
      <aside className={`fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-vaulta-border bg-vaulta-surface dark:bg-vaulta-dark-surface ${collapsed ? "" : "lg:flex"}`}>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-vaulta-border bg-vaulta-surface dark:bg-vaulta-dark-surface lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={collapsed ? "" : "lg:pl-64"}>
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-vaulta-border bg-vaulta-surface/80 backdrop-blur-md px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMenu}
              className="rounded-lg p-2 text-vaulta-text"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-vaulta-muted" />
              <input
                type="text"
                placeholder="Search... (press /)"
                className="w-64 rounded-lg border border-vaulta-border bg-vaulta-bg dark:bg-vaulta-dark-bg py-2 pl-9 pr-3 text-sm text-vaulta-text placeholder:text-vaulta-muted focus:border-vaulta-cerulean focus:outline-none focus:ring-2 focus:ring-vaulta-cerulean/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/notifications"
              className="relative rounded-lg p-2 text-vaulta-muted hover:bg-vaulta-cerulean/10 hover:text-vaulta-cerulean transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-vaulta-orange" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-vaulta-cerulean/10 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vaulta-cerulean text-sm font-semibold text-white">
                  {user?.firstName?.[0] ?? 'U'}
                </div>
                <span className="hidden text-sm font-medium text-vaulta-text md:block">
                  {user?.firstName} {user?.lastName}
                </span>
                <ChevronDown size={16} className="hidden text-vaulta-muted md:block" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-12 w-48 rounded-lg border border-vaulta-border bg-vaulta-surface py-1.5 shadow-vaulta-lg"
                  >
                    <Link to="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-vaulta-text hover:bg-vaulta-cerulean/10 transition-colors">
                      Profile
                    </Link>
                    <Link to="/dashboard/security" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-vaulta-text hover:bg-vaulta-cerulean/10 transition-colors">
                      Security
                    </Link>
                    <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-vaulta-danger hover:bg-vaulta-danger/10 transition-colors">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
