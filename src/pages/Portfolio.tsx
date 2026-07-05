import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const categories = ["All", "Websites", "Software", "Branding", "Coming Soon"];

type Project = {
  name: string;
  cat: string;
  gradient: string;
  url?: string;
  description?: string;
  comingSoon?: boolean;
};

const projects: Project[] = [
  {
    name: "SHAHMCO Global",
    cat: "Websites",
    gradient: "from-brand-purple/40 to-indigo-900/20",
    url: "https://www.shahmco.com/",
    description: "Corporate site for SHAHMCO Global FZC.",
  },
  {
    name: "SHAHMCO Client Portal",
    cat: "Software",
    gradient: "from-brand-purple/50 to-slate-900/30",
    url: "https://portal.shahmco.com/",
    description: "Secure multi-tenant client portal & document gateway.",
  },
  {
    name: "Hazara Menu Builder",
    cat: "Software",
    gradient: "from-purple-900/40 to-indigo-800/20",
    url: "https://hazara-menu-builder.vercel.app/",
    description: "Digital menu builder for restaurants and cafés.",
  },
  {
    name: "Sultan Remix Studio",
    cat: "Websites",
    gradient: "from-slate-800/40 to-zinc-900/20",
    url: "https://sultan-remix-studio.vercel.app/",
    description: "Creative studio site with a modern remix aesthetic.",
  },
  {
    name: "HelpHive",
    cat: "Software",
    gradient: "from-teal-900/40 to-cyan-800/20",
    url: "https://help-hive22.lovable.app",
    description: "Support & ticketing collaboration platform.",
  },
  {
    name: "AI Receptionist",
    cat: "Coming Soon",
    gradient: "from-amber-900/30 to-brand-purple/30",
    description: "AI-powered voice receptionist for UAE businesses. Launching soon.",
    comingSoon: true,
  },
];

const Portfolio = () => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? projects : projects.filter((p) => p.cat === filter);

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-brand-muted tracking-wider mb-4">
            <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link> &gt; Portfolio
          </p>
          <motion.h1 {...fadeUp()} className="font-display text-4xl md:text-6xl font-black text-foreground">
            Our <span className="text-brand-gold">Work</span>
          </motion.h1>
          <motion.p {...fadeUp(0.15)} className="font-body text-lg text-brand-muted italic mt-4 max-w-2xl">
            A selection of live projects. Click any card to explore.
          </motion.p>
          <motion.div
            className="h-0.5 bg-brand-gold mt-4"
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
      </section>

      {/* Filter */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`font-mono text-xs tracking-wider px-5 py-2 rounded-full transition-all duration-300 ${
                filter === c
                  ? "bg-brand-gold text-brand-dark"
                  : "border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => {
              const CardInner = (
                <div className={`h-56 bg-gradient-to-br ${p.gradient} relative flex items-center justify-center`}>
                  <span className="font-display text-xl text-foreground/20 select-none text-center px-6">{p.name}</span>
                  {p.comingSoon && (
                    <span className="absolute top-3 right-3 font-mono text-[10px] tracking-widest px-2 py-1 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40">
                      COMING SOON
                    </span>
                  )}
                  <motion.div
                    className="absolute inset-0 bg-brand-dark/85 flex flex-col items-center justify-center px-6 text-center"
                    initial={{ y: "100%" }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-display text-lg text-foreground mb-1">{p.name}</h3>
                    <p className="font-mono text-xs text-brand-gold tracking-wider mb-3">{p.cat}</p>
                    {p.description && (
                      <p className="font-body text-xs text-brand-muted leading-relaxed mb-3 max-w-xs">{p.description}</p>
                    )}
                    <span className="font-mono text-xs text-brand-gold hover:underline">
                      {p.comingSoon ? "In Development" : "Visit Project →"}
                    </span>
                  </motion.div>
                </div>
              );

              return (
                <motion.div
                  key={p.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card overflow-hidden group gold-border-glow transition-all duration-300"
                >
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="block">
                      {CardInner}
                    </a>
                  ) : (
                    CardInner
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 px-6 border-t border-brand-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="glass-card p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="font-mono text-xs text-brand-gold tracking-wider mb-3">Featured Project</p>
              <h3 className="font-display text-2xl text-foreground mb-4">SHAHMCO Client Portal</h3>
              <p className="font-body text-sm text-brand-muted leading-relaxed mb-6">
                A multi-tenant client portal built for SHAHMCO Global FZC. Features strict data isolation,
                invoice & document management, PDF generation, and secure role-based access.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["React", "Supabase", "Vercel", "Resend API"].map((t) => (
                  <span key={t} className="font-mono text-[10px] tracking-wider px-3 py-1 rounded-full border border-brand-gold/30 text-brand-gold">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href="https://portal.shahmco.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-brand-gold tracking-wider hover:underline"
              >
                Visit portal.shahmco.com →
              </a>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm aspect-video rounded-lg border border-brand-surface bg-brand-dark/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-1 bg-brand-gold/30 rounded mx-auto mb-3" />
                  <div className="w-32 h-1 bg-brand-surface rounded mx-auto mb-2" />
                  <div className="w-24 h-1 bg-brand-surface rounded mx-auto mb-2" />
                  <div className="w-28 h-1 bg-brand-surface rounded mx-auto" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
