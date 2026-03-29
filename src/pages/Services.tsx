import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const services = [
  { num: "01", name: "Business Websites", desc: "One-page and multi-page mobile-first sites built for conversion. WhatsApp ordering and booking flows included. Delivered in 24 hours." },
  { num: "02", name: "Custom Web Applications", desc: "Full-stack web apps tailored to your business workflows. Built with React, Node.js, and cloud infrastructure." },
  { num: "03", name: "SaaS Platform Development", desc: "Multi-tenant software products built to scale. From MVP to enterprise. Supabase, Vercel, and modern stacks." },
  { num: "04", name: "Automation & AI Integration", desc: "Automate repetitive tasks with AI-powered workflows. Email automation, invoice systems, CRM triggers." },
  { num: "05", name: "Brand Identity & Design", desc: "Logo, color palette, typography system, and brand guidelines. Premium aesthetic built for the UAE market." },
  { num: "06", name: "Hosting, Maintenance & Support", desc: "Domain management, uptime monitoring, SSL, and 24/7 support. Your site stays live, always." },
];

const steps = [
  { num: "01", title: "Discovery", desc: "We learn your business, goals, and audience." },
  { num: "02", title: "Design", desc: "We build a premium design that fits your brand." },
  { num: "03", title: "Build", desc: "We develop and test across all devices." },
  { num: "04", title: "Launch", desc: "We deploy, monitor, and hand over in 24 hours." },
];

const Services = () => (
  <div>
    {/* Hero */}
    <section className="pt-32 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs text-brand-muted tracking-wider mb-4">
          <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link> &gt; Services
        </p>
        <motion.h1 {...fadeUp()} className="font-display text-4xl md:text-6xl font-black text-foreground">
          Our <span className="text-brand-gold">Services</span>
        </motion.h1>
        <motion.div
          className="h-0.5 bg-brand-gold mt-4"
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>
    </section>

    {/* Services Grid */}
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <motion.div
            key={s.num}
            className="glass-card p-8 relative overflow-hidden gold-border-glow transition-all duration-300 group"
            {...fadeUp(i * 0.1)}
          >
            <span className="absolute -top-4 -right-2 font-display text-8xl font-black text-brand-gold/5 select-none">
              {s.num}
            </span>
            <div className="relative z-10">
              <p className="font-mono text-xs text-brand-gold tracking-wider mb-3">{s.num}</p>
              <h3 className="font-display text-lg text-foreground mb-3">{s.name}</h3>
              <p className="font-body text-sm text-brand-muted leading-relaxed mb-4">{s.desc}</p>
              <Link to="/contact" className="font-mono text-xs text-brand-gold tracking-wider hover:underline">
                Learn More →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Process */}
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 {...fadeUp()} className="font-display text-3xl md:text-4xl text-foreground mb-16 text-center">
          How We <span className="text-brand-gold">Work</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px">
            <motion.div
              className="h-full bg-brand-gold/30"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
          </div>
          {steps.map((s, i) => (
            <motion.div key={s.num} className="text-center relative" {...fadeUp(i * 0.2)}>
              <div className="w-16 h-16 rounded-full border border-brand-gold/40 flex items-center justify-center mx-auto mb-4 bg-brand-dark">
                <span className="font-mono text-sm text-brand-gold font-semibold">{s.num}</span>
              </div>
              <h3 className="font-display text-sm tracking-wider text-foreground mb-2">{s.title}</h3>
              <p className="font-body text-sm text-brand-muted">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #3D1F6D, #1a0a3e)" }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2 {...fadeUp()} className="font-display text-3xl md:text-4xl text-foreground mb-6">
          Ready to Build Something <span className="text-brand-gold">Premium</span>?
        </motion.h2>
        <motion.div {...fadeUp(0.2)}>
          <Link to="/contact" className="btn-gold-filled">Start a Project</Link>
        </motion.div>
      </div>
    </section>
  </div>
);

export default Services;
