import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/auth/current-user";
import { LOGIN_REASON_PARAM, ROUTES } from "@/lib/routes";
import ApiUnavailable from "@/components/sections/chat/ApiUnavailable";

export const metadata: Metadata = {
  title: "Messages",
};

/**
 * Chat route group.
 *
 * No Lenis smooth scroll here (it lives in the marketing group): it binds to
 * document scroll and would fight the message list's own scroll container, which is
 * exactly where the "don't force-scroll a user who has scrolled up" behaviour lives.
 *
 * The session is resolved on the server, so pages below render with the user already
 * known — no loading flash, no client-side auth waterfall.
 */
export default async function ChatGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getCurrentUser();

  if (result.status === "unauthenticated") {
    redirect(`${ROUTES.login}?${LOGIN_REASON_PARAM}=signed-out`);
  }

  if (result.status === "expired") {
    // Via the route handler, which can actually delete the cookie — a Server
    // Component cannot, and redirecting straight to /login would loop forever
    // against the proxy's "you have a cookie, go to /chat" rule.
    redirect(`/api/auth/logout?${LOGIN_REASON_PARAM}=expired`);
  }

  if (result.status === "unavailable") {
    // The API is asleep or down. The session is probably fine, so offer a retry
    // instead of destroying it — signing someone out because Render was slow is the
    // wrong response.
    return <ApiUnavailable message={result.message} />;
  }

  return (
    <div className="h-screen overflow-hidden bg-white text-neutral-950">
      {children}
      <Toaster position="top-center" />
    </div>
  );
}
