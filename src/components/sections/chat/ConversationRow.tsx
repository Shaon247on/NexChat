"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Avatar from "./Avatar";
import {
  formatConversationTimestamp,
  formatFullTimestamp,
} from "@/lib/format";
import {
  getConversationTitle,
  type Conversation,
} from "@/types/chat";

/**
 * One row in the conversation sidebar.
 *
 * Rendered as a `Link` rather than a button so conversations are addressable —
 * `/chat/<id>` can be opened in a new tab, deep-linked, and restored on reload,
 * and browser back/forward works between threads without extra state.
 */
export default function ConversationRow({
  conversation,
  currentUserId,
  isActive,
}: {
  conversation: Conversation;
  currentUserId: string;
  isActive: boolean;
}) {
  const title = getConversationTitle(conversation);
  const { lastMessage } = conversation;

  return (
    <Link
      href={`/chat/${conversation.id}`}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 transition-colors",
        isActive ? "bg-blue-50" : "hover:bg-neutral-50",
      )}
    >
      <Avatar
        name={title}
        seed={conversation.id}
        isGroup={conversation.type === "group"}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={cn(
              "truncate text-sm",
              isActive ? "font-semibold text-blue-700" : "font-medium text-neutral-900",
            )}
          >
            {title}
          </span>

          {lastMessage && (
            <time
              // Server and client can format this differently — see lib/format.ts
              suppressHydrationWarning
              dateTime={lastMessage.createdAt}
              title={formatFullTimestamp(lastMessage.createdAt)}
              className="shrink-0 text-[11px] text-neutral-400"
            >
              {formatConversationTimestamp(lastMessage.createdAt)}
            </time>
          )}
        </div>

        <p className="mt-0.5 truncate text-xs text-neutral-500">
          <MessagePreview
            conversation={conversation}
            currentUserId={currentUserId}
          />
        </p>
      </div>
    </Link>
  );
}

/**
 * Preview line under the title.
 *
 * Attributes the message the way people expect: "You:" for your own, and the
 * sender's name in groups, where "who said it" carries as much information as the
 * text. Direct conversations skip the name — there's only one other person.
 */
function MessagePreview({
  conversation,
  currentUserId,
}: {
  conversation: Conversation;
  currentUserId: string;
}) {
  const { lastMessage } = conversation;

  if (!lastMessage) {
    return (
      <span className="text-neutral-400 italic">
        {conversation.type === "group"
          ? "No messages yet — say hello"
          : "No messages yet"}
      </span>
    );
  }

  const isMine = lastMessage.senderId === currentUserId;

  let prefix: string | null = null;
  if (isMine) {
    prefix = "You";
  } else if (conversation.type === "group") {
    // Sender arrives as an id only, so resolve it against the embedded members.
    const sender = conversation.participants.find(
      (participant) => participant.id === lastMessage.senderId,
    );
    prefix = sender?.name ?? null;
  }

  return (
    <>
      {prefix && <span className="text-neutral-400">{prefix}: </span>}
      {lastMessage.text}
    </>
  );
}
