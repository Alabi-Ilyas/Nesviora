import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertTriangle, ShieldAlert, ServerCrash } from "lucide-react";

function ErrorLayout({
  icon: Icon,
  code,
  title,
  message,
}: {
  icon: typeof Home;
  code: string;
  title: string;
  message: string;
}) {
  return (
    <div className="min-h-screen bg-vaulta-bg dark:bg-vaulta-dark-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-vaulta-cerulean/10">
          <Icon size={40} className="text-vaulta-cerulean" />
        </div>
        <h1 className="mt-6 text-6xl font-bold text-vaulta-text">{code}</h1>
        <h2 className="mt-2 text-xl font-semibold text-vaulta-text">{title}</h2>
        <p className="mt-2 text-sm text-vaulta-muted max-w-md mx-auto">
          {message}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-vaulta-cerulean px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vaulta-cerulean-dark"
        >
          <Home size={16} /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <ErrorLayout
      icon={AlertTriangle}
      code="404"
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
    />
  );
}

export function ForbiddenPage() {
  return (
    <ErrorLayout
      icon={ShieldAlert}
      code="403"
      title="Access Denied"
      message="You don't have permission to access this page."
    />
  );
}

export function ServerErrorPage() {
  return (
    <ErrorLayout
      icon={ServerCrash}
      code="500"
      title="Server Error"
      message="Something went wrong on our end. Please try again later."
    />
  );
}
