import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { SITE_NAME } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Sign in",
};

/**
 * Auth shell. Deliberately does NOT include the marketing chrome or Lenis smooth
 * scroll — a login form has nothing to parallax, and Lenis binds to document
 * scroll, which we keep out of the app routes entirely.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="px-6 py-6 md:px-10">
        <Link
          href={ROUTES.home}
          className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-70"
        >
          <span className="flex size-5 items-center justify-center rounded-[4px] bg-blue-600">
            <span className="size-2.5 rounded-[2px] bg-white" />
          </span>
          <span className="text-sm font-medium tracking-wide text-neutral-950">
            {SITE_NAME}
          </span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        {children}
      </main>

      <Toaster position="top-center" />
    </div>
  );
}
