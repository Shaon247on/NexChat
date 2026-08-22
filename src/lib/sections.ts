/**
 * The landing page is a single scrolling page — every nav item is a section on it, not
 * a route. This is the one source of truth: the page renders these sections in this
 * order with these ids, and both the desktop nav and the mobile menu build themselves
 * from the same list.
 *
 * ## Why these sections and not others
 *
 * The page was inherited from an agency site with ten sections. Three were dropped
 * because they actively work against a product page:
 *
 * - **Selected work / projects** — a product has features, not a portfolio. There are
 *   no client projects to show, and filling it with invented ones would be padding.
 * - **Testimonials** — the brief explicitly says a stock testimonial section earns no
 *   credit, and inventing quotes from users who don't exist is worse than omitting them.
 * - **Client logo wall** — same problem: there are no clients.
 *
 * What's left answers the questions a real visitor actually has: what is it, how does
 * it work, what can it do, is it built properly, and how do I start.
 */
export interface LandingSection {
  /** DOM id used as the scroll target. */
  id: string;
  /** Label shown in the nav. */
  label: string;
  /** Whether it appears in the top nav — every section has an id, not all are destinations. */
  inNav: boolean;
}

export const LANDING_SECTIONS: LandingSection[] = [
  { id: "hero", label: "Home", inNav: false },
  { id: "product", label: "Product", inNav: true },
  { id: "how-it-works", label: "How it works", inNav: true },
  { id: "features", label: "Features", inNav: true },
  { id: "why-us", label: "Why NexChat", inNav: true },
  { id: "faq", label: "FAQ", inNav: true },
];

/** Only the sections that appear in the nav bar. */
export const NAV_SECTIONS = LANDING_SECTIONS.filter((section) => section.inNav);

/** Every section id, in page order — used by the active-section observer. */
export const SECTION_IDS = LANDING_SECTIONS.map((section) => section.id);

/**
 * Vertical offset applied when scrolling to a section, so a heading doesn't end up
 * underneath the fixed header.
 */
export const NAV_SCROLL_OFFSET = -88;
