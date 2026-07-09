# ALBASTRO — one-page demo site

A self-contained, one-page website demo for a luxury ceramics / sanitary-ware
showroom (ceramic sinks, stone, brassware, tiles) in Dubai.

Open `index.html` in any browser — no build step, no external requests.
Fonts (Bodoni Moda, Jost) and three.js are vendored locally.

## Highlights

- Real-time 3D hero: an oval porcelain vessel sink on a stone plinth, lit like
  a museum piece (three.js) — reacts to mouse and scroll, pauses off-screen,
  respects `prefers-reduced-motion`.
- Procedural material swatches (Carrara, Verde Alpi, travertine, brass) drawn
  with SVG turbulence filters — no stock photos.
- Editorial type system: Bodoni Moda display + Jost body.
- Scroll-triggered reveals, animated counters, marquee, staged hero entrance.
- Fully responsive (separate hero composition for portrait screens).

## Placeholders to replace with the client's real details

| Where | What |
|---|---|
| Brand name "ALBASTRO" | client's actual business name (nav, hero, footer, `<title>`) |
| `+971 50 000 0000` / `wa.me/971500000000` | real phone & WhatsApp numbers |
| "Showroom address, Dubai" | real address (showroom section) |
| Opening hours, stats (years / brands / projects / m²) | real figures |

The copy, palette and 3D piece are intentionally generic-luxury so the demo
can be re-skinned to the client's identity in one pass.
