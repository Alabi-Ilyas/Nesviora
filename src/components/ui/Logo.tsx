import { Link } from "react-router-dom";

// The Nesviora logo (mark + wordmark). Files live in public/assets/images.
export function Logo({ to = "/", className = "h-12" }: { to?: string; className?: string }) {
  return (
    <Link to={to} className="inline-flex items-center" aria-label="Nesviora Capital Market Limited - home">
      <img
        src="/assets/images/nesviora_logo_tight.png"
        alt="Nesviora Capital Market Limited"
        className={`${className} w-auto rounded-md object-contain`}
      />
    </Link>
  );
}
