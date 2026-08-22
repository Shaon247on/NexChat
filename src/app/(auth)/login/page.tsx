import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/sections/auth/LoginForm";
import LoginNotice from "@/components/sections/auth/LoginNotice";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in with your phone number to start messaging. New numbers are registered automatically.",
};

/**
 * The page itself is a static Server Component — no data fetching, no cookies.
 * Both interactive pieces read `searchParams`, so each sits behind its own
 * Suspense boundary rather than opting the whole route into dynamic rendering.
 */
export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <Suspense fallback={null}>
        <LoginNotice />
      </Suspense>

      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div aria-hidden className="w-full max-w-sm animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-28 rounded bg-neutral-200" />
        <div className="h-4 w-full rounded bg-neutral-100" />
        <div className="h-4 w-3/4 rounded bg-neutral-100" />
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-neutral-200" />
          <div className="h-11 w-full rounded-lg bg-neutral-100" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-neutral-200" />
          <div className="h-11 w-full rounded-lg bg-neutral-100" />
        </div>
      </div>
      <div className="mt-7 h-12 w-full rounded-lg bg-neutral-200" />
    </div>
  );
}
