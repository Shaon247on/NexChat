"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

/**
 * Sign-out trigger. Calls the Server Action because clearing an httpOnly cookie is
 * something only the server can do — `document.cookie` cannot touch it.
 */
export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => void logout("signed-out"))}
      className="gap-1.5 text-neutral-500 hover:text-neutral-900"
    >
      <LogOut className="size-3.5" />
      {isPending ? "Signing out" : "Sign out"}
    </Button>
  );
}
