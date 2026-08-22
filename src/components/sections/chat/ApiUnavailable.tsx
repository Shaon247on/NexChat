"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RefreshCw, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shown when the chat API can't be reached.
 *
 * Distinct from an expired session on purpose: the token is probably fine, the
 * server is just asleep or down. Signing someone out because Render took too
 * long would be the wrong call, so this offers a retry and explains the free-tier
 * behaviour instead of showing a dead end.
 */
export default function ApiUnavailable({ message }: { message: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [attempts, setAttempts] = useState(0);

  const retry = () => {
    setAttempts((count) => count + 1);
    startTransition(() => router.refresh());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-blue-50">
          <ServerCrash className="size-5 text-blue-600" />
        </span>

        <h1 className="text-xl font-bold tracking-tight text-neutral-950">
          Can&apos;t reach the server
        </h1>

        <p className="mt-2.5 text-sm leading-relaxed text-neutral-500">{message}</p>

        <p className="mt-4 text-xs leading-relaxed text-neutral-400">
          This demo runs on a free tier that sleeps when idle. The first request
          after a while can take up to 30 seconds — retrying usually wakes it.
        </p>

        <Button
          onClick={retry}
          disabled={isPending}
          size="lg"
          className="mt-6 h-11 gap-2 px-6 text-sm font-semibold"
        >
          <RefreshCw className={isPending ? "size-4 animate-spin" : "size-4"} />
          {isPending ? "Retrying" : "Try again"}
        </Button>

        {attempts >= 3 && !isPending && (
          <p className="mt-4 text-xs leading-relaxed text-neutral-400">
            Still nothing after {attempts} tries — the API may be down rather than
            asleep.
          </p>
        )}
      </div>
    </div>
  );
}
