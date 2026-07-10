# BECO — GSAP scroll-scrub concept (`beco-luxury-scroll`)

A second, distinct concept for BECO Building Materials: an Apple-product-page-style
one-pager with a scroll-scrubbed 3D hero, a working bilingual EN/AR toggle, and a
dark cinematic palette. This sits alongside `beco_w3bsitee/` (the editorial/light
concept) rather than replacing it — pick whichever direction the client responds to.

Open `index.html` in any browser — no build step, no external requests. GSAP 3.12.5
(+ ScrollTrigger) and three.js are vendored locally, same as the other concept.

## How the scroll-scrub actually works

There's no video file. `scene.js` renders a book-matched marble feature wall with
an embedded glass niche, a floating console, a vessel sink and a wall-mounted
faucet in three.js — and exposes a single pure function, `window.BECO_HERO.update(progress)`,
that sets camera position, rotation and spotlight intensity from a 0–1 number and
renders one frame. It does **not** run a render loop. `main.js` pins the hero with
GSAP ScrollTrigger (`scrub: true`) and calls `update(self.progress)` on every
scroll tick — so the scene redraws exactly in step with the scrollbar and freezes
the instant the user stops scrolling, which is what was asked for instead of an
actual `.mp4`.

One real perf note from building this: `THREE.PMREMGenerator` (for environment-map
reflections) was cut deliberately — its prefilter pass stalled the main thread for
several seconds under software/weak-GPU rendering, which is exactly the kind of
freeze you don't want on a "wow them" hero. The scene relies on direct spot/ambient
lighting instead, which reads fine with clearcoat materials and loads in well under
a second.

## Bilingual EN/AR

`i18n.js` holds the full English and Arabic copy as one object per language (not
mixed inline), swapped wholesale by `main.js` on toggle. Layout mirroring is done
with CSS logical properties (`inset-inline-*`, `margin-inline-*`, `border-inline-*`)
plus `dir="rtl"` on `<html>`, so flexbox/grid order flips natively — no JS-side
style patching. Letter-spacing/uppercase (which break Arabic glyph joining) are
reset under `[dir="rtl"]`. Choice persists in `localStorage`.

## Real business details wired in

Same as the other concept: BECO Building Materials Trading, Al Rashidiya 3 Ajman,
+971 55 741 2142, 4.3★ Google rating. The enquiry form is static (no backend) —
submitting hands off to a pre-filled WhatsApp message in whichever language is active.

## Accessibility / perf notes

- `prefers-reduced-motion`: skips the pin/scrub entirely and shows a settled,
  fully-lit mid-scene frame instead — no motion, no jank.
- `ScrollTrigger.matchMedia` gives mobile a shorter pinned scroll distance
  (120% vs 220% of viewport height) so the scrub doesn't feel like a slog on touch.
