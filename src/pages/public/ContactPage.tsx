import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { Card } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";

export function ContactPage() {
  const { success } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    success("Your message has been sent. We will get back to you shortly.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "support@nesviora.io" },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+1 (352) 578-4494",
      href: "https://wa.me/13525784494",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "Holmevikvegen 476, 6815 Førde, Norway",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-vaulta-text">Contact Us</h1>
        <p className="mt-2 text-vaulta-muted max-w-2xl mx-auto">
          Have a question or need assistance? Our support team is here to help.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <Card key={info.label}>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vaulta-cerulean/10 text-vaulta-cerulean">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-vaulta-text">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block text-sm text-vaulta-muted hover:text-vaulta-cerulean"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-vaulta-muted">
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="input-field"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-vaulta-text mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="input-field resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <Button type="submit" loading={loading} className="w-full">
                <Send size={16} /> Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
