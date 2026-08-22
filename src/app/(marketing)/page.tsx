import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import HeroSection from "@/components/sections/landing/HeroSection";
import AboutSection from "@/components/sections/landing/AboutSection";
import FeaturesSection from "@/components/sections/landing/ServicesSection";
import LogoLooper from "@/components/shared/LogoLooper";
import WhyChooseUs from "@/components/sections/landing/WhyChooseUs";
import FAQ from "@/components/sections/landing/FAQ";
import ProcessSection from "@/components/sections/landing/HowWeWork";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Real-time messaging that just works`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};
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

      <div id="faq" className="scroll-mt-24">
        <FAQ />
      </div>
    </main>
  );
}
