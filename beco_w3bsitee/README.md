# BECO — one-page website demo (`beco_w3bsitee`)

A self-contained one-page website for **BECO Building Materials Trading L.L.C**
(بيكو لتجارة مواد البناء) — Al Rashidiya 3, Ajman, UAE. Sanitary ware · marble ·
ceramic · cabinets, exactly as the storefront sign reads.

Open `index.html` in any browser — no build step, no external requests.
Fonts (Bodoni Moda, Jost, Reem Kufi for Arabic) and three.js are vendored locally.

## Highlights

- **First-visit loader**: the BECO diamond mark spins in 3D until the page is
  ready, then the site reveals. Repeat visits (same tab session) skip the ceremony.
- **Skeleton loading**: department images and material swatches shimmer as
  placeholders and resolve in a stagger after the reveal.
- **Real-time 3D hero**: an oval porcelain vessel sink on a stone plinth,
  lit like a museum piece (three.js) — reacts to mouse and scroll.
- **Reconstructed logo**: the diamond tile mark rebuilt as crisp SVG from the
  cropped photos (`beco-mark.svg`), including the cut-off corner.
- Bilingual department index (English + Arabic in Reem Kufi), procedural
  marble swatches, animated counters (incl. the real 4.3★ Google rating),
  WhatsApp / call / directions buttons wired to the real number and Maps link.

## Real details already wired in

| Item | Value |
|---|---|
| Name | BECO Building Materials Trading L.L.C |
| Phone / WhatsApp | +971 55 741 2142 |
| Address | Al Rashidiya 3, Ajman (near Safeer Mall) |
| Google Maps | https://maps.app.goo.gl/xrxwceWHiJN9hH6P9 |
| Rating | 4.3★ (14 reviews) |
| Departments | Sanitary ware · Marble · Ceramic · Cabinets |

## Remaining placeholders (confirm with the client)

- Exact opening hours (Maps only shows "opens 5 PM" — currently phrased as
  "evenings from 5:00 PM, call for midday visits")
- Email address (none yet — contact is phone/WhatsApp only)
- Real product photography can replace the illustrated department tiles
  (`.index__thumb` SVGs) whenever the client provides photos
