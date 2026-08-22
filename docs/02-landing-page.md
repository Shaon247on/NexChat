# Part 2 — Landing page: design log

The page that introduces the chat app to real users. Started as a record of decisions
rather than a write-up after the fact, so entries here run ahead of the implementation
in places — that's deliberate, and anything still open is marked as such.

---

## 22 Aug — Starting point, and what I'm reusing

This repo began as a B2B agency marketing site. Rather than delete it and start from a
blank page, I'm reusing its **visual system and animation primitives** and replacing its
**content and semantics**. The scroll choreography in it is genuinely good and rebuilding
equivalent work from scratch under a deadline would produce something worse.

What carries over:

| Primitive | File | What it does |
|---|---|---|
| `ScrollAnimatedText` | `src/components/shared/ScrollAnimatedText.tsx` | Per-character colour lerp from grey to solid, driven by scroll position |
| `TitleSection` | `src/components/element/TitleSection.tsx` | Oversized watermark heading behind content, fading in to ~7% opacity |
| `Parallax` | `src/components/shared/parallax.tsx` | Translate-on-scroll wrapper for imagery |

Standard easing across the codebase is `[0.22, 1, 0.36, 1]` with 0.6–0.8s durations and
0.08–0.13s stagger. New sections match that rather than inventing a second motion
language — inconsistent easing is one of those things nobody can name but everybody feels.

---

## 22 Aug — Colour

**Black, white, and `blue-600` (`#2563eb`). One accent, no second hue.**

This was already the intended system and it suits a messaging product, so I kept it and
tightened it. Blue is the interactive colour: buttons, links, focus rings, active states,
sent-message bubbles. Neutrals do everything else. When a single hue means "you can act
on this", the interface explains itself without a legend.

The ramp in use:

```
neutral-950   headings, primary text
neutral-600   body copy
neutral-400   muted / meta
neutral-200   borders, dividers
blue-600      the one accent
```

Dark surfaces (`neutral-950`, `#0f0f0f`) are used as full-bleed section blocks for
rhythm, not as a dark theme.

### Correction: leftover orange

The inherited site had **orange** accents in several places that contradicted this —
`#ea580c` active states and `bg-orange-600` indicators in the services section, an
orange badge dot and hover colour in the about section, an orange CTA hover in selected
work. Left alone, a reviewer reads that as an unexamined template rather than a decision.

These get folded into `blue-600` during the rework. Recorded here because "why are there
two accent colours" is exactly the question a design reviewer asks first.

---

## 22 Aug — Typography

Two families, both already wired up as CSS variables:

- **Syne** (`--font-syne`, `.font-display`) — display and headings. Geometric, slightly
  eccentric, holds up at very large sizes.
- **DM Sans** (`--font-dm-sans`, `.font-body`) — body, UI, and everything in the chat
  app. Set on `<body>` as the default.

DM Sans does the app-side work because it stays legible at 13–14px, which is the size
range a message list actually lives in. Syne is for the landing page's big statements and
appears nowhere in the product UI.

---

## 22 Aug — Structural decision: the chat app is not inside the marketing shell

The original root layout wrapped every route in Lenis smooth scroll plus navbar and
footer. I split that into route groups so the marketing chrome lives in `(marketing)` and
the app routes opt out.

Motivated by the chat app — Lenis hijacks document scroll and would fight the message
list — but it pays off for this page too: TanStack Query and the app's client code no
longer ship to the landing page at all. Bundle size on a marketing page is a number
people actually measure.

URLs are unchanged; route groups don't affect paths.

---

## Open: what the page has to communicate

The assignment is explicit that a **stock testimonial section and a standard FAQ
accordion earn no credit**, even executed well. The inherited page has both. They're
staying for now as neutral filler, but they are not where the effort goes.

What the page actually needs to convey is what the feature *does*:

- Sign in with a phone number — no password, no separate registration
- Find someone by name or number and start talking
- Group conversations with admin controls
- Messages arriving in real time, not on refresh

### Direction I'm leaning

Rather than screenshotting the app, **let the landing page use the real message-bubble
components** to tell its own story — the copy arriving as a conversation, in the same
components, with the same timestamps and the same easing. It reuses code instead of
duplicating it as decoration, and it demonstrates the product by being the product.

Unresolved: whether it reads as clever or as gimmicky at full scale. To be decided
against something real rather than in the abstract.

---

## Deferred

- **Partial Prerendering.** Enabled app-wide via `cacheComponents: true` in Next 16 —
  `experimental.ppr` now throws, and per-route opt-in is gone. Because it's all-or-nothing
  it would require auditing all ten animated sections for Suspense boundaries, so it's
  built-for but not switched on. Reasoning in `01-chat-app.md`.
- **Responsive pass** on the reworked sections.
- **Reduced-motion support.** Heavily scroll-animated pages need a
  `prefers-reduced-motion` path, and the inherited sections don't have one. Worth fixing;
  currently a gap.
