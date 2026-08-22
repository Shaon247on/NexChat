"use client";

import { AlertCircle, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFullTimestamp } from "@/lib/format";
import type { Message } from "@/types/chat";

/**
 * One message.
 *
 * Sender and receiver are distinguished on three axes at once — side, colour, and
 * corner shape — rather than colour alone, so the thread stays readable for
 * colour-blind users and in greyscale. Own messages: right, `blue-600`, white
 * text. Others: left, white on a bordered surface.
 */
export default function MessageBubble({
  message,
  isOwn,
  senderName,
  showSender,
  onRetry,
  onDiscard,
}: {
  message: Message;
  isOwn: boolean;
  /** Resolved from the conversation's participants — messages carry only an id. */
  senderName?: string;
  /** Groups only, and only on the first of a run from the same person. */
  showSender: boolean;
  onRetry?: () => void;
  onDiscard?: () => void;
}) {
  const hasFailed = message.status === "failed";
  const isSending = message.status === "sending";

  return (
    <li className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[min(75%,32rem)]", isOwn && "items-end")}>
        {showSender && senderName && (
          <p className="mb-1 pl-3 text-[11px] font-semibold text-blue-700">
            {senderName}
          </p>
        )}

        <div
          className={cn(
            "rounded-2xl px-3.5 py-2",
            isOwn
              ? "rounded-br-sm bg-blue-600 text-white"
              : "rounded-bl-sm border border-neutral-200 bg-white text-neutral-900",
            // A failed message stays legible but visibly not-delivered.
            hasFailed && "bg-blue-500/60",
            isSending && "opacity-80",
          )}
        >
          {/*
            `whitespace-pre-wrap` preserves the line breaks the user typed, and
            `break-words` stops an unbroken 200-character string from widening the
            bubble past the viewport.
          */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>

          <span
            className={cn(
              "mt-1 flex items-center justify-end gap-1 text-[10px]",
              isOwn ? "text-blue-100" : "text-neutral-400",
            )}
          >
            <time
              // Locale/timezone differ between server and client — see lib/format.ts
              suppressHydrationWarning
              dateTime={message.createdAt}
              title={formatFullTimestamp(message.createdAt)}
            >
              {new Date(message.createdAt).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>

            {isOwn && !hasFailed && (
              isSending ? (
                <Loader2 className="size-3 animate-spin" aria-label="Sending" />
              ) : (
                <Check className="size-3" aria-label="Sent" />
              )
            )}
          </span>
        </div>

        {hasFailed && (
          <div className="mt-1 flex items-center justify-end gap-2 text-[11px]">
            <span className="flex items-center gap-1 text-red-600">
              <AlertCircle className="size-3" />
              Not delivered
            </span>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="font-medium text-blue-600 underline-offset-2 hover:underline"
              >
                Retry
              </button>
            )}
            {onDiscard && (
              <button
                type="button"
                onClick={onDiscard}
                className="text-neutral-400 underline-offset-2 hover:underline"
              >
                Discard
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
