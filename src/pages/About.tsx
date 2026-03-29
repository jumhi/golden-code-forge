import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const techStack = [
  "React", "Next.js", "Node.js", "Supabase", "Vercel",
  "Tailwind CSS", "Framer Motion", "Three.js", "Resend", "Lovable",
];

const values = [
  "⚡ Speed — 24-hour delivery standard",
  "💎 Quality — Pixel-perfect, no compromises",
  "🔍 Transparency — No hidden fees, ever",
  "🏛 Local Expertise — UAE market native",
  "🤝 No Hidden Fees — What you see is what you pay",
];

const About = () => (
  <div>
    {/* Hero Split */}
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h1 {...fadeUp()} className="font-display text-3xl md:text-5xl font-black text-foreground leading-tight">
            Built in the <span className="text-brand-gold">UAE</span>.
            <br />
            Built for the <span className="text-brand-gold">World</span>.
          </motion.h1>
        </div>
        <motion.div {...fadeUp(0.3)} className="flex items-center justify-center">
          <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.polygon
              points="120,20 220,60 220,180 120,220 20,180 20,60"
              stroke="#D4AF37"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
            />
            <motion.polygon
              points="120,50 190,75 190,165 120,190 50,165 50,75"
              stroke="#D4AF37"
              strokeWidth="1"
              fill="none"
              opacity={0.5}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.polygon
              points="120,80 160,95 160,145 120,160 80,145 80,95"
              stroke="#D4AF37"
              strokeWidth="0.8"
              fill="none"
              opacity={0.3}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 1 }}
            />
            <motion.circle
              cx="120"
              cy="120"
              r="20"
              stroke="#D4AF37"
              strokeWidth="0.5"
              fill="none"
              opacity={0.4}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 1.5 }}
            />
          </svg>
        </motion.div>
      </div>
    </section>

    {/* Who We Are */}
    <section className="py-20 px-6 border-y border-brand-surface">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <motion.div {...fadeUp()}>
          <h2 className="font-display text-2xl text-foreground mb-6">Who We Are</h2>
          <p className="font-body text-brand-body leading-relaxed">
            SHAHMCO Digital is the technology arm of SHAHMCO Global FZC, specializing in premium digital products
            for businesses in the UAE and beyond. We combine Silicon Valley engineering standards with a deep
            understanding of the Gulf market to deliver websites, software, and automation that drive real results.
          </p>
        </motion.div>
        <motion.div {...fadeUp(0.2)}>
          <h2 className="font-display text-2xl text-foreground mb-6">Core Values</h2>
          <ul className="space-y-3">
            {values.map((v) => (
              <li key={v} className="font-body text-sm text-brand-body">{v}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>

    {/* Tech Stack */}
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 {...fadeUp()} className="font-display text-3xl text-foreground mb-12 text-center">
          Technologies We <span className="text-brand-gold">Use</span>
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-4">
          {techStack.map((t, i) => (
            <motion.div
              key={t}
              className="glass-card px-6 py-3 gold-border-glow transition-all duration-300"
              {...fadeUp(i * 0.05)}
            >
              <span className="font-mono text-xs tracking-wider text-brand-gold">{t}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2 {...fadeUp()} className="font-display text-3xl text-foreground mb-4">
          A Small Team. A Big <span className="text-brand-gold">Output</span>.
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="font-body text-brand-muted leading-relaxed">
          We are a lean, senior-level team operating out of the UAE.
          No bloated agency overhead — just precise execution.
        </motion.p>
      </div>
    </section>

    {/* Registration */}
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp()} className="glass-card p-8 text-center border border-brand-gold/20">
          <p className="font-display text-lg text-foreground mb-3">SHAHMCO Global FZC</p>
          <p className="font-body text-sm text-brand-muted mb-4">
            Registered in Sharjah Airport International Free Zone (SAIF Zone), United Arab Emirates.
          </p>
          <span className="inline-block font-mono text-xs tracking-wider text-brand-dark bg-brand-gold px-4 py-1.5 rounded-full">
            UAE Licensed Entity
          </span>
        </motion.div>
      </div>
    </section>
  </div>
);

export default About;
