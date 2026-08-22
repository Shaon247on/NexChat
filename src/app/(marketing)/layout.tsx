import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import SmoothScrollProvider from "@/providers/smooth-scroll-provider";
import ScrollBlur from "@/components/shared/ScrollBlur";
import LoadingReveal from "@/components/element/loading-reveal";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Premium B2B Design & Strategy`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "B2B marketing",
    "brand strategy",
    "digital design",
    "web development",
    "UI/UX",
    "motion graphics",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: `${SITE_NAME} — Premium B2B Design & Strategy`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Premium B2B Design & Strategy`,
    description: SITE_DESCRIPTION,
  },
};

/**
 * Marketing chrome, moved verbatim out of the old root layout. Route groups
 * don't affect URLs, so every path under here is unchanged.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <LoadingReveal />
      <Navbar />
      <div className="overflow-x-hidden">{children}</div>
      <ScrollBlur />
      <Footer />
    </SmoothScrollProvider>
  );
}
