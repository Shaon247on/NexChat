"use client";

import { useCallback, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowDown, Loader2, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useJumpOnKeyChange,
  useOnCountIncrease,
  useStickToBottom,
} from "@/hooks/use-stick-to-bottom";
import {
  getConversationMembers,
  type Conversation,
  type Message,
} from "@/types/chat";
import MessageBubble from "./MessageBubble";

/** Gap after which a run of messages gets a fresh sender label. */
const GROUPING_WINDOW_MS = 5 * 60_000;

/**
 * The transcript.
 *
 * Purely presentational — messages arrive as props (server history merged with the
 * outbox by the pane). Its only real logic is scroll behaviour, which is where the
 * assignment's trickiest requirement lives.
 */
export default function MessageList({
  conversationId,
  conversation,
  currentUserId,
  messages,
  hasMore,
  limit,
  loadError,
  onRetry,
  onDiscard,
}: {
  conversationId: string;
  /** Metadata for sender names and group detection. Null if the list hasn't caught up. */
  conversation: Conversation | null;
  currentUserId: string;
  messages: Message[];
  hasMore: boolean;
  limit: number;
  loadError: string | null;
  onRetry: (clientId: string, text: string) => void;
  onDiscard: (clientId: string) => void;
}) {
  const router = useRouter();
  const [isLoadingOlder, startLoadingOlder] = useTransition();

  const {
    containerRef,
    handleScroll,
    missedCount,
    scrollToBottom,
    jumpToBottom,
    onContentChange,
  } = useStickToBottom();

  const isGroup = conversation?.type === "group";

  // Sender names come from the conversation, since messages carry only an id.
  const membersById = useMemo(() => {
    const map = new Map<string, string>();
    if (!conversation) return map;
    for (const member of getConversationMembers(conversation)) {
      map.set(member.id, member.name);
    }
    return map;
  }, [conversation]);

  const lastMessage = messages.at(-1);
  const lastIsOwn = lastMessage?.senderId === currentUserId;

  // Land at the newest message before paint when switching threads.
  useJumpOnKeyChange(conversationId, jumpToBottom);

  // Only *increases* count as arrivals — the count also drops when an outbox bubble
  // is replaced by the server's copy, which is not a new message.
  const handleIncrease = useCallback(() => {
    onContentChange({ isOwnMessage: lastIsOwn });
  }, [onContentChange, lastIsOwn]);

  useOnCountIncrease(messages.length, handleIncrease);

  if (loadError && messages.length === 0) {
    return (
      <EmptyState
        icon={<AlertCircle className="size-5 text-blue-600" />}
        title="Couldn't load messages"
        body={`${loadError} The server may be waking up — this often works on a second try.`}
        action={
          <Button
            size="sm"
            className="mt-3 gap-1.5"
            disabled={isLoadingOlder}
            onClick={() => startLoadingOlder(() => router.refresh())}
          >
            {isLoadingOlder && <Loader2 className="size-3.5 animate-spin" />}
            Try again
          </Button>
        }
      />
    );
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overscroll-contain bg-neutral-50/40 px-4 py-4"
      >
        {messages.length === 0 ? (
          <EmptyState
            icon={<MessagesSquare className="size-5 text-blue-600" />}
            title="No messages yet"
            body={
              isGroup
                ? "No one has sent anything to this group yet. Be the first."
                : "No messages have been sent yet. Say hello to start the conversation."
            }
          />
        ) : (
          <ul className="mx-auto flex max-w-3xl flex-col gap-1.5">
            {/*
              Pagination is grow-the-limit: the API exposes `limit` and reports
              `hasMore`, but no cursor. So "load older" is a link to a bigger number,
              which keeps it a plain navigation with no client state to manage.
            */}
            {hasMore && (
              <li className="mb-2 text-center">
                <Link
                  href={`/chat/${conversationId}?limit=${limit * 2}`}
                  scroll={false}
                  className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200"
                >
                  Load older messages
                </Link>
              </li>
            )}

            {messages.map((message, index) => {
              const isOwn = message.senderId === currentUserId;
              const previous = messages[index - 1];

              // Label the sender only at the start of a run: the same person inside
              // the grouping window reads as one turn, not five.
              const startsNewRun =
                !previous ||
                previous.senderId !== message.senderId ||
                new Date(message.createdAt).getTime() -
                  new Date(previous.createdAt).getTime() >
                  GROUPING_WINDOW_MS;

              return (
                <MessageBubble
                  key={message.clientId ?? message.id}
                  message={message}
                  isOwn={isOwn}
                  senderName={membersById.get(message.senderId)}
                  showSender={Boolean(isGroup) && !isOwn && startsNewRun}
                  onRetry={
                    message.status === "failed" && message.clientId
                      ? () => onRetry(message.clientId!, message.text)
                      : undefined
                  }
                  onDiscard={
                    message.status === "failed" && message.clientId
                      ? () => onDiscard(message.clientId!)
                      : undefined
                  }
                />
              );
            })}
          </ul>
        )}
      </div>

      {/*
        Shown only when messages arrived while the user was reading further up. This is
        the other half of "don't force-scroll": we don't move them, but we do tell them
        there's something new and make getting there one tap.
      */}
      {missedCount > 0 && (
        <button
          type="button"
          onClick={() => scrollToBottom("smooth")}
          className={cn(
            "absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2",
            "rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg",
            "transition-transform hover:scale-[1.03]",
          )}
        >
          <ArrowDown className="size-3.5" />
          {missedCount} new message{missedCount === 1 ? "" : "s"}
        </button>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-blue-50">
          {icon}
        </span>
        <p className="text-sm font-semibold text-neutral-900">{title}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{body}</p>
        {action}
      </div>
    </div>
  );
}
