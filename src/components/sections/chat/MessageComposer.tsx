"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { messageTextSchema } from "@/lib/validation/message";

const MAX_ROWS_HEIGHT = 160;
const SOFT_LIMIT = 4_000;

/**
 * Message composer.
 *
 * Enter sends, Shift+Enter adds a newline — the convention people already have
 * muscle memory for in every chat client.
 *
 * Empty messages can't be sent, enforced through the same
 * `messageTextSchema` the send path uses, so the button's disabled state and the
 * actual validation can't drift apart. Whitespace-only counts as empty: a bubble
 * containing three spaces is indistinguishable from a bug.
 */
export default function MessageComposer({
  onSend,
  disabled = false,
  placeholder = "Type a message",
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parsed = messageTextSchema.safeParse(value);
  const canSend = parsed.success && !disabled;

  // Grow with content up to a cap, then scroll internally. Runs in a layout
  // effect so the height is right before paint and the caret never jumps.
  useLayoutEffect(() => {
    const element = textareaRef.current;
    if (!element) return;

    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, MAX_ROWS_HEIGHT)}px`;
  }, [value]);

  const submit = useCallback(() => {
    const result = messageTextSchema.safeParse(value);
    if (!result.success) return;

    onSend(result.data);
    setValue("");

    // Keep focus so a burst of messages doesn't need a re-click.
    textareaRef.current?.focus();
  }, [value, onSend]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // `isComposing` guards IME input — pressing Enter to accept a candidate
    // character would otherwise send a half-finished message.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const remaining = SOFT_LIMIT - value.length;
  const showCount = remaining <= 200;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="border-t border-neutral-200 bg-white px-4 py-3"
    >
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <div className="min-w-0 flex-1">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={placeholder}
            aria-label="Message"
            disabled={disabled}
            className={cn(
              "max-h-40 min-h-11 resize-none py-2.5 text-sm leading-relaxed",
              "focus-visible:border-blue-600 focus-visible:ring-blue-600/20",
            )}
          />
          {showCount && (
            <p
              className={cn(
                "mt-1 text-right text-[11px]",
                remaining < 0 ? "text-red-600" : "text-neutral-400",
              )}
            >
              {remaining < 0
                ? `${Math.abs(remaining)} characters over the limit`
                : `${remaining} characters left`}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full transition-all",
            canSend
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              : "cursor-not-allowed bg-neutral-100 text-neutral-400",
          )}
        >
          <SendHorizontal className="size-4" />
        </button>
      </div>
    </form>
  );
}
