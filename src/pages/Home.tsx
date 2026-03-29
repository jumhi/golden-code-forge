import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroCanvas from "@/components/HeroCanvas";
import { useCountUp } from "@/hooks/useCountUp";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const wordUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const services = [
  { icon: "🌐", name: "Web Design & Development", desc: "Premium, mobile-first websites built for conversion." },
  { icon: "⚙️", name: "Custom Software", desc: "Full-stack applications tailored to your workflows." },
  { icon: "🤖", name: "Automation & AI Tools", desc: "Intelligent workflows that save time and money." },
  { icon: "✦", name: "Brand & Identity", desc: "Logo, typography, and complete brand systems." },
];

const testimonials = [
  { quote: "SHAHMCO Digital delivered our platform in under 48 hours. Exceptional quality.", author: "Ahmed K., CEO" },
  { quote: "The most premium agency experience we've had in the UAE market.", author: "Sarah M., Founder" },
  { quote: "They turned our vision into a product that generates revenue daily.", author: "Khalid R., Director" },
  { quote: "Fast, transparent, and the design quality is unmatched.", author: "Layla H., COO" },
];

const StatItem = ({ end, label, sublabel, suffix = "" }: { end: number; label: string; sublabel: string; suffix?: string }) => {
  const { count, ref } = useCountUp(end);
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl text-brand-gold font-bold">{count}{suffix}</div>
      <div className="font-display text-sm tracking-wider text-foreground mt-2">{label}</div>
      <div className="font-body text-xs text-brand-muted mt-1">{sublabel}</div>
    </div>
  );
};

const Home = () => (
  <div>
    {/* Hero */}
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <HeroCanvas />
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-[10px] tracking-[4px] text-brand-gold uppercase mb-6"
        >
          SHAHMCO Global FZC — Digital Division
        </motion.p>
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.h1 variants={wordUp} className="font-display text-4xl md:text-7xl font-black text-foreground leading-tight">
            We Build Digital
          </motion.h1>
          <motion.h1 variants={wordUp} className="font-display text-4xl md:text-7xl font-black text-brand-gold leading-tight">
            Empires.
          </motion.h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="font-body text-lg md:text-xl italic text-brand-muted mt-6 mb-10"
        >
          Websites. Software. Automation. Deployed in the UAE and beyond.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/portfolio" className="btn-gold-filled">See Our Work</Link>
          <Link to="/contact" className="btn-gold-outline">Talk to Us</Link>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </section>

    {/* Services Teaser */}
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.name}
            className="glass-card p-8 gold-border-glow transition-all duration-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { delay: i * 0.1, duration: 0.6 } } }}
          >
            <div className="text-3xl mb-4">{s.icon}</div>
            <h3 className="font-display text-sm tracking-wider text-foreground mb-2">{s.name}</h3>
            <p className="font-body text-sm text-brand-muted">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Stats */}
    <section className="py-20 px-6 border-y border-brand-surface">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatItem end={24} suffix=" Hrs" label="Average Delivery" sublabel="From brief to launch" />
        <StatItem end={100} suffix="%" label="Mobile-First" sublabel="Build standard" />
        <StatItem end={1} suffix="" label="UAE" sublabel="Registered & operating" />
        <StatItem end={0} suffix=" AED" label="Hidden Fees" sublabel="Transparent pricing" />
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-20 overflow-hidden">
      <div className="animate-marquee flex gap-12 whitespace-nowrap">
        {[...testimonials, ...testimonials].map((t, i) => (
          <div key={i} className="inline-flex items-center gap-4 min-w-[400px]">
            <span className="text-brand-gold text-4xl font-display">"</span>
            <div>
              <p className="font-body italic text-foreground text-sm whitespace-normal max-w-xs">{t.quote}</p>
              <p className="font-mono text-xs text-brand-muted mt-2">— {t.author}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Home;
