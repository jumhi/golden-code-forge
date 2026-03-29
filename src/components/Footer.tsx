import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative bg-brand-dark border-t border-brand-gold/20 pt-16 pb-8">
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="footer-geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <g stroke="#D4AF37" strokeWidth="0.5" fill="none">
              <polygon points="40,5 75,22 75,58 40,75 5,58 5,22" />
              <circle cx="40" cy="40" r="12" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footer-geo)" />
      </svg>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
            </svg>
            <span className="font-display text-lg text-foreground">
              SHAHMCO <span className="text-brand-gold">Digital</span>
            </span>
          </div>
          <p className="text-brand-muted text-sm font-body leading-relaxed mb-2">Where Vision Meets Code</p>
          <p className="text-brand-muted text-xs font-body">A division of SHAHMCO Global FZC</p>
        </div>

        <div>
          <h4 className="font-display text-sm tracking-wider text-brand-gold mb-4">Quick Links</h4>
          {["Home", "Services", "Portfolio", "About", "Contact"].map((l) => (
            <Link
              key={l}
              to={l === "Home" ? "/" : `/${l.toLowerCase()}`}
              className="block text-brand-body text-sm font-body mb-2 hover:text-brand-gold transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>

        <div>
          <h4 className="font-display text-sm tracking-wider text-brand-gold mb-4">Services</h4>
          {["Web Design", "Software", "SaaS", "Automation", "Branding", "Hosting"].map((s) => (
            <Link
              key={s}
              to="/services"
              className="block text-brand-body text-sm font-body mb-2 hover:text-brand-gold transition-colors"
            >
              {s}
            </Link>
          ))}
        </div>

        <div>
          <h4 className="font-display text-sm tracking-wider text-brand-gold mb-4">Contact</h4>
          <a
            href="https://wa.me/971000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-brand-body text-sm font-body mb-2 hover:text-brand-gold transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="mailto:hello@shahmco.com"
            className="block text-brand-body text-sm font-body mb-2 hover:text-brand-gold transition-colors"
          >
            hello@shahmco.com
          </a>
          <p className="text-brand-muted text-sm font-body mb-2">Sharjah Free Zone, UAE</p>
          <p className="text-brand-muted text-sm font-body">Sun–Thu, 9 AM – 6 PM GST</p>
        </div>
      </div>

      <div className="border-t border-brand-surface pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-brand-muted text-xs font-mono">© 2026 SHAHMCO Global FZC. All rights reserved.</p>
        <p className="text-brand-muted text-xs font-mono">Sharjah Airport International Free Zone, UAE</p>
      </div>
    </div>
  </footer>
);

export default Footer;
