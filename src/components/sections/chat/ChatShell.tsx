"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { startDirectConversation } from "@/app/actions/conversations";
import { findDirectConversationWith, type User } from "@/types/chat";
import type { ConversationListResult } from "@/lib/validation/conversation";
import Sidebar from "./Sidebar";
import AutoRefresh from "./AutoRefresh";

/**
 * Desktop: sidebar and thread side by side, WhatsApp Web style.
 * Mobile: one pane at a time — the list, or the open thread.
 *
 * The active conversation is derived from the pathname rather than held in state, so
 * the URL stays the single source of truth. That's what makes a thread shareable,
 * reloadable, and navigable with browser back/forward.
 */
export default function ChatShell({
  currentUser,
  conversations,
  loadError,
  children,
}: {
  currentUser: User;
  conversations: ConversationListResult | null;
  loadError: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isStarting, startTransition] = useTransition();
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  // "/chat" → no active thread. "/chat/<id>" → that thread.
  const activeConversationId = pathname.match(/^\/chat\/([^/]+)/)?.[1];
  const hasActiveThread = Boolean(activeConversationId);

  const handleSelectUser = (user: User) => {
    // Check locally before asking the server. `POST /conversations` returns success
    // whether it created a conversation or matched an existing one, so its response
    // can't tell them apart — but we already hold the list, and can. This also saves
    // a round trip in the common case of messaging someone you already talk to.
    const existing = findDirectConversationWith(
      conversations?.conversations ?? [],
      user.id,
    );

    if (existing) {
      router.push(`/chat/${existing.id}`);
      return;
    }

    setPendingUserId(user.id);

    startTransition(async () => {
      const result = await startDirectConversation(user.id);
      setPendingUserId(null);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      router.push(`/chat/${result.data.id}`);
    });
  };

  return (
    <div className="flex h-full">
      {/* Polls the server for new messages — see the component for why. */}
      <AutoRefresh />

      <div
        className={cn(
          "w-full shrink-0 md:w-80 lg:w-96",
          // On mobile the list yields the screen to an open thread.
          hasActiveThread ? "hidden md:block" : "block",
        )}
      >
        <Sidebar
          currentUser={currentUser}
          conversations={conversations}
          loadError={loadError}
          activeConversationId={activeConversationId}
          onSelectUser={handleSelectUser}
          startingUserId={isStarting ? pendingUserId : null}
        />
      </div>

      <main
        className={cn(
          "min-w-0 flex-1",
          hasActiveThread ? "block" : "hidden md:block",
        )}
      >
        {children}
      </main>
    </div>
  );
}
