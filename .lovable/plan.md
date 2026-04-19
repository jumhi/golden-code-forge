
## Plan: Restructure for Invoicing Focus + Add SHAHMCO Logo

The user wants to position `digital.shahmco.com/services` as the **technical implementation hub** for the Invoicing system (the flagship product), while `shahmco.com/products` (external main site) holds the strategic narrative. They also want the uploaded gold phoenix/falcon logo integrated.

### 1. Add the Logo
- Save uploaded image to `src/assets/shahmco-logo.png`
- Replace the generic gold polygon SVG icon in **Navbar.tsx** and **Footer.tsx** with the actual logo image (28px in navbar, 32px in footer).

### 2. Rework `/services` (Implementation Hub for Invoicing)
Restructure `src/pages/Services.tsx` to lead with the **Document Management Module** (invoicing) as the flagship, then list other services:

- **New Hero**: Title "Technical Implementation" + subtitle "Document Management & Digital Services for SHAHMCO Global FZC clients."
- **Featured Module Section** (above the 6 services grid) — "Invoicing & Document Management Module":
  - Three sub-modules in a glass-card grid:
    1. **Secure Document Portal** — data isolation, client-scoped access
    2. **Invoicing Engine** — PDF generation, real-time tracking, security stamps
    3. **Bulk Processing** — filter, manage, download high-volume documents
  - Note: "Functional Gateway / Client Portal — Login coming soon"
  - Back-link: "← Read the strategic overview at shahmco.com/products" (external link)
- Keep existing 6-service grid below as "Other Implementation Services"
- Keep existing process timeline + CTA

### 3. Trim Home page (remove redundant long-form)
- Keep hero, stats, testimonials.
- Replace generic 4-card services teaser with a single **flagship callout**: "Flagship Module: Invoicing & Document Management" → CTA "Explore Technical Implementation" linking to `/services`.
- This removes the duplication that the user flagged as SEO cannibalization.

### 4. Update CTAs across site
- Any "Learn More" on services cards already point to `/contact` — change the flagship invoicing card's CTA to anchor `#invoicing-module` on the services page. Other "Learn More" links remain pointing to `/contact`.
- Add an external CTA in the footer: "Strategic Overview → shahmco.com/products"

### Technical notes
- Logo: `import logo from "@/assets/shahmco-logo.png"` — use `<img>` with appropriate alt + sizing classes; keep the existing wordmark text next to it.
- External links use `<a href="https://shahmco.com/products" target="_blank" rel="noopener noreferrer">`.
- All new sections use the existing `glass-card`, `btn-gold-filled`, `fadeUp` patterns — no new dependencies.

### Files to change
- `src/assets/shahmco-logo.png` (new — copied from upload)
- `src/components/Navbar.tsx` (logo swap)
- `src/components/Footer.tsx` (logo swap + external products link)
- `src/pages/Services.tsx` (add featured invoicing module section)
- `src/pages/Home.tsx` (trim teaser, add flagship callout)
