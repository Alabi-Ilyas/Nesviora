import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ProtectedRoute, AdminRoute } from '@/routes/RouteGuards';
import { PublicLayout } from '@/layouts/PublicLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Public pages
import { LandingPage } from '@/pages/public/LandingPage';
import { MarketsPage } from '@/pages/public/MarketsPage';
import { InvestmentsPage } from '@/pages/public/InvestmentsPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { HowItWorksPage } from '@/pages/public/HowItWorksPage';
import { SecurityPage } from '@/pages/public/SecurityPage';
import { FAQPage } from '@/pages/public/FAQPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { TermsPage, PrivacyPage, RiskDisclosurePage } from '@/pages/public/LegalPages';

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { OnboardingPage } from '@/pages/auth/OnboardingPage';

// Dashboard pages
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { PortfolioPage } from '@/pages/dashboard/PortfolioPage';
import { InvestmentsPage as DashboardInvestmentsPage } from '@/pages/dashboard/InvestmentsPage';
import { DepositPage } from '@/pages/dashboard/DepositPage';
import { WithdrawPage } from '@/pages/dashboard/WithdrawPage';
import { TransactionsPage } from '@/pages/dashboard/TransactionsPage';
import { WalletPage } from '@/pages/dashboard/WalletPage';
import { SecurityPage as DashboardSecurityPage } from '@/pages/dashboard/SecurityPage';
import { ProfilePage } from '@/pages/dashboard/ProfilePage';
import { SupportPage } from '@/pages/dashboard/SupportPage';
import { ReferralsPage } from '@/pages/dashboard/ReferralsPage';
import { NotificationsPage } from '@/pages/dashboard/NotificationsPage';

// Admin pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminKYCPage } from '@/pages/admin/AdminKYCPage';
import { AdminDepositsPage } from '@/pages/admin/AdminDepositsPage';
import { AdminWithdrawalsPage } from '@/pages/admin/AdminWithdrawalsPage';
import { AdminTransactionsPage } from '@/pages/admin/AdminTransactionsPage';
import { AdminAssetsPage } from '@/pages/admin/AdminAssetsPage';
import { AdminPlansPage } from '@/pages/admin/AdminPlansPage';
import {
  AdminTestimonialsPage, AdminFAQsPage, AdminSupportPage,
  AdminNotificationsPage, AdminAuditLogsPage, AdminSettingsPage,
  AdminReportsPage, AdminAdminsPage,
} from '@/pages/admin/AdminPages';

import { ComingSoon } from '@/pages/ComingSoon';

// Error pages
import { NotFoundPage, ForbiddenPage, ServerErrorPage } from '@/pages/ErrorPages';

function Loading() {
  return (
    <div className="min-h-screen bg-vaulta-bg dark:bg-vaulta-dark-bg flex items-center justify-center">
      <svg className="animate-spin h-8 w-8 text-vaulta-cerulean" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/markets" element={<MarketsPage />} />
                <Route path="/investments" element={<InvestmentsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/risk-disclosure" element={<RiskDisclosurePage />} />
              </Route>

              {/* Auth routes (no layout) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

              {/* Dashboard routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardPage />} />
                <Route path="portfolio" element={<ComingSoon />} />
                <Route path="investments" element={<DashboardInvestmentsPage />} />
                <Route path="deposit" element={<ComingSoon />} />
                <Route path="withdraw" element={<ComingSoon />} />
                <Route path="transactions" element={<ComingSoon />} />
                <Route path="wallet" element={<ComingSoon />} />
                <Route path="security" element={<DashboardSecurityPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="referrals" element={<ComingSoon />} />
                <Route path="notifications" element={<ComingSoon />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Navigate to="users" replace />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="kyc" element={<ComingSoon />} />
                <Route path="investments" element={<AdminPlansPage />} />
                <Route path="deposits" element={<ComingSoon />} />
                <Route path="withdrawals" element={<ComingSoon />} />
                <Route path="transactions" element={<ComingSoon />} />
                <Route path="assets" element={<ComingSoon />} />
                <Route path="plans" element={<AdminPlansPage />} />
                <Route path="testimonials" element={<AdminTestimonialsPage />} />
                <Route path="faqs" element={<ComingSoon />} />
                <Route path="support" element={<AdminSupportPage />} />
                <Route path="notifications" element={<ComingSoon />} />
                <Route path="reports" element={<ComingSoon />} />
                <Route path="settings" element={<ComingSoon />} />
                <Route path="admins" element={<ComingSoon />} />
                <Route path="audit-logs" element={<ComingSoon />} />
              </Route>

              {/* Error routes */}
              <Route path="/403" element={<ForbiddenPage />} />
              <Route path="/500" element={<ServerErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
