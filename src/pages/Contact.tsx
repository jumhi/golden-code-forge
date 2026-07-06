import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const faqs = [
  {
    q: "How fast can you build a website?",
    a: "Most business websites are live within 24–48 hours of receiving your content and payment.",
  },
  {
    q: "Do you work with businesses outside the UAE?",
    a: "Yes. We work remotely with clients across the GCC and internationally.",
  },
  {
    q: "What is included in the monthly hosting fee?",
    a: "Domain management, SSL, uptime monitoring, and up to 2 content updates per month.",
  },
];

const Contact = () => {
  const [form, setForm] = useState({
    name: "", business: "", email: "", whatsapp: "",
    service: "", budget: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend (e.g., Supabase Edge Function or email API)
    setSubmitted(true);
  };

  const inputClass =
    "w-full bg-brand-card border border-brand-surface rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-brand-muted focus:border-brand-gold focus:outline-none transition-colors";

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h1 {...fadeUp()} className="font-display text-4xl md:text-6xl font-black text-foreground">
            Start a <span className="text-brand-gold">Project</span>
          </motion.h1>
          <motion.p {...fadeUp(0.1)} className="font-body text-lg text-brand-muted mt-4">
            Tell us what you need. We respond within 24 hours.
          </motion.p>
          <motion.div
            className="h-0.5 bg-brand-gold mt-4"
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div {...fadeUp()}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </motion.div>
                  <h3 className="font-display text-xl text-foreground mb-2">Message Received</h3>
                  <p className="font-body text-sm text-brand-muted">
                    We will contact you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="glass-card p-8 space-y-5"
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className={inputClass}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Business Name"
                      className={inputClass}
                      value={form.business}
                      onChange={(e) => setForm({ ...form, business: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={inputClass}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp Number"
                      className={inputClass}
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    />
                  </div>
                  <select
                    className={inputClass}
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    required
                  >
                    <option value="">Service Needed</option>
                    <option>Website</option>
                    <option>Software</option>
                    <option>SaaS</option>
                    <option>Automation</option>
                    <option>Branding</option>
                    <option>Other</option>
                  </select>
                  <select
                    className={inputClass}
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  >
                    <option value="">Project Budget</option>
                    <option>Under AED 2,000</option>
                    <option>AED 2,000–5,000</option>
                    <option>AED 5,000–15,000</option>
                    <option>AED 15,000+</option>
                  </select>
                  <textarea
                    placeholder="Tell us about your project"
                    className={`${inputClass} resize-none`}
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  <button type="submit" className="btn-gold-filled w-full">
                    Send Message →
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Info */}
          <motion.div {...fadeUp(0.2)} className="space-y-8">
            <div>
              <h3 className="font-display text-lg text-foreground mb-4">Contact Details</h3>
              <div className="space-y-3">
                <a
                  href="https://wa.me/971561520086?text=Hello%20Shahmco%20Team%2C%20I%20am%20interested%20in%20your%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-body text-sm text-brand-gold hover:underline"
                >
                  💬 WhatsApp — +971 56 152 0086
                </a>
                <a href="mailto:marketing@shahmco.com" className="block font-body text-sm text-brand-body hover:text-brand-gold transition-colors">📧 marketing@shahmco.com</a>
                <p className="font-body text-sm text-brand-body">📍 Sharjah Airport International Free Zone, UAE</p>
                <p className="font-body text-sm text-brand-muted">🕐 Sunday–Thursday, 9:00 AM – 6:00 PM GST</p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="rounded-lg border border-brand-surface bg-brand-card h-48 flex items-center justify-center">
              <p className="font-mono text-xs text-brand-muted tracking-wider">Map — Sharjah Free Zone</p>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="font-display text-lg text-foreground mb-4">FAQ</h3>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <button
                      className="w-full px-5 py-4 flex items-center justify-between text-left"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-body text-sm text-foreground">{faq.q}</span>
                      <motion.span
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        className="text-brand-gold ml-2 flex-shrink-0"
                      >
                        ▾
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="px-5 pb-4 font-body text-sm text-brand-muted">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
