import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, HelpCircle } from "lucide-react";
import { contentService } from "@/services";
import { Skeleton } from "@/components/ui/States";
import type { FAQ } from "@/types";

export function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    contentService.getFAQs().then((data) => {
      setFaqs(data);
      setLoading(false);
    });
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(faqs.map((f) => f.category))),
  ];

  const filtered = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vaulta-cerulean/10">
          <HelpCircle size={28} className="text-vaulta-cerulean" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-vaulta-text">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-vaulta-muted">
          Find answers to common questions about Nesviora Capital Market Limited
        </p>
      </motion.div>

      <div className="mt-8 relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-vaulta-muted"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full rounded-lg border border-vaulta-border bg-vaulta-surface py-3 pl-10 pr-4 text-sm text-vaulta-text placeholder:text-vaulta-muted focus:border-vaulta-cerulean focus:outline-none focus:ring-2 focus:ring-vaulta-cerulean/20"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-vaulta-cerulean text-white"
                : "border border-vaulta-border bg-vaulta-surface text-vaulta-muted hover:border-vaulta-cerulean hover:text-vaulta-cerulean"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-nesviora" />
          ))
        ) : filtered.length === 0 ? (
          <div className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-8 text-center text-vaulta-muted">
            No questions found matching your search.
          </div>
        ) : (
          filtered.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-nesviora border border-vaulta-border bg-vaulta-surface p-5 shadow-vaulta-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-vaulta-text">
                  {faq.question}
                </h3>
                <span className="shrink-0 rounded-full bg-vaulta-cerulean/10 px-2.5 py-0.5 text-xs font-medium text-vaulta-cerulean">
                  {faq.category}
                </span>
              </div>
              <p className="mt-2 text-sm text-vaulta-muted">{faq.answer}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
