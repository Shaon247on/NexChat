import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import HeroSection from "@/components/sections/landing/HeroSection";
import AboutSection from "@/components/sections/landing/AboutSection";
import FeaturesSection from "@/components/sections/landing/ServicesSection";
import LogoLooper from "@/components/shared/LogoLooper";
import WhyChooseUs from "@/components/sections/landing/WhyChooseUs";
import LetsCreate from "@/components/sections/landing/LetsCreate";
import FAQ from "@/components/sections/landing/FAQ";
import ProcessSection from "@/components/sections/landing/HowWeWork";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Real-time messaging that just works`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

/**
 * Single-page landing for the chat app. Every nav item is a section here, not a route —
 * the whole product is this page, `/login`, and `/chat`.
 *
 * Section ids come from `src/lib/sections.ts`, which the nav reads too, so a nav item
 * can never point at a section that doesn't exist. Each section is wrapped rather than
 * having an id pushed into the component, which keeps the section components untouched
 * and makes the page's scroll structure readable in one place.
 */
export default function HomePage() {
  return (
    <main id="main-content">
      <div id="hero" className="scroll-mt-24">
        <HeroSection />
      </div>

      <div id="product" className="scroll-mt-24">
        <AboutSection />
      </div>

      <div id="how-it-works" className="scroll-mt-24">
        <ProcessSection />
      </div>

      <div id="features" className="scroll-mt-24">
        <FeaturesSection />
      </div>

      <div id="built-with" className="scroll-mt-24">
        <LogoLooper />
      </div>

      <div id="why-us" className="scroll-mt-24">
        <WhyChooseUs />
      </div>

      {/* <div id="get-started" className="scroll-mt-24">
        <LetsCreate />
      </div> */}

      <div id="faq" className="scroll-mt-24">
        <FAQ />
      </div>
    </main>
  );
}
