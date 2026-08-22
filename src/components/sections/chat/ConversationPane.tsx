"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Info } from "lucide-react";
import { sendMessage } from "@/app/actions/messages";
import {
  getConversationMembers,
  getConversationTitle,
  isGroupAdmin,
  type Conversation,
  type Message,
  type User,
} from "@/types/chat";
import Avatar from "./Avatar";
import MessageList from "./MessageList";
import MessageComposer from "./MessageComposer";
import GroupDetailsDialog from "./GroupDetailsDialog";

/**
 * The right-hand pane: header, transcript, composer.
 *
 * History arrives as props from the Server Component. The only client-side data this
 * owns is the **outbox** — messages currently sending, or that failed. Those can't
 * live in the server data, and keeping them separate means a background
 * `router.refresh()` can never wipe a bubble the user is still watching.
 */
export default function ConversationPane({
  conversationId,
  conversation,
  currentUser,
  messages,
  hasMore,
  loadError,
  limit,
}: {
  conversationId: string;
  /** May be null if the conversation list hasn't caught up — the thread still loads. */
  conversation: Conversation | null;
  currentUser: User;
  messages: Message[];
  hasMore: boolean;
  loadError: string | null;
  limit: number;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [outbox, setOutbox] = useState<Message[]>([]);

  /**
   * Server history plus the outbox.
   *
   * Anything in the outbox whose text already appears in server history is dropped:
   * after a successful send the action revalidates, so the real message can arrive in
   * the same commit as the success callback, and without this the bubble would
   * briefly double.
   */
  const combined = useMemo(() => {
    const serverTexts = new Set(
      messages.map((message) => `${message.senderId}:${message.text}`),
    );

    const pending = outbox.filter(
      (message) =>
        message.status === "failed" ||
        !serverTexts.has(`${message.senderId}:${message.text}`),
    );

    return [...messages, ...pending];
  }, [messages, outbox]);

  const handleSend = async (text: string) => {
    const clientId = `local-${crypto.randomUUID()}`;

    setOutbox((previous) => [
      ...previous,
      {
        id: clientId,
        clientId,
        conversationId,
        senderId: currentUser.id,
        text,
        createdAt: new Date().toISOString(),
        status: "sending",
      },
    ]);

    const result = await sendMessage(conversationId, text);

    if (result.ok) {
      // The action revalidated, so the real message is arriving via props.
      setOutbox((previous) =>
        previous.filter((message) => message.clientId !== clientId),
      );
      return;
    }

    /*
      Mark it failed and keep the text on screen.

      This path matters more than it looks: `POST /messages` answers a rejected send
      with a `null` body and a success status, so without explicit handling the bubble
      would show as delivered when nothing was stored — the worst failure a chat
      client can have, because it's silent.
    */
    setOutbox((previous) =>
      previous.map((message) =>
        message.clientId === clientId
          ? { ...message, status: "failed" as const }
          : message,
      ),
    );
    toast.error(result.message);
  };

  const handleRetry = (clientId: string, text: string) => {
    setOutbox((previous) =>
      previous.filter((message) => message.clientId !== clientId),
    );
    void handleSend(text);
  };

  const handleDiscard = (clientId: string) => {
    setOutbox((previous) =>
      previous.filter((message) => message.clientId !== clientId),
    );
  };

  return (
    <div className="flex h-full flex-col border-l border-neutral-200">
      <ConversationHeader
        conversation={conversation}
        conversationId={conversationId}
        currentUserId={currentUser.id}
        onOpenDetails={
          conversation?.type === "group" ? () => setIsDetailsOpen(true) : undefined
        }
      />

      <MessageList
        conversationId={conversationId}
        conversation={conversation}
        currentUserId={currentUser.id}
        messages={combined}
        hasMore={hasMore}
        limit={limit}
        loadError={loadError}
        onRetry={handleRetry}
        onDiscard={handleDiscard}
      />

      <MessageComposer
        onSend={(text) => void handleSend(text)}
        placeholder={
          conversation
            ? conversation.type === "group"
              ? `Message ${conversation.name}`
              : `Message ${getConversationTitle(conversation)}`
            : "Type a message"
        }
      />

      {conversation?.type === "group" && (
        <GroupDetailsDialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          conversation={conversation}
          currentUserId={currentUser.id}
        />
      )}
    </div>
  );
}

function ConversationHeader({
  conversation,
  conversationId,
  currentUserId,
  onOpenDetails,
}: {
  conversation: Conversation | null;
  conversationId: string;
  currentUserId: string;
  /** Provided for groups only — direct chats have nothing to manage. */
  onOpenDetails?: () => void;
}) {
  const title = conversation ? getConversationTitle(conversation) : "Conversation";
  const members = conversation ? getConversationMembers(conversation) : [];
  const isGroup = conversation?.type === "group";
  const youAreAdmin = conversation
    ? isGroupAdmin(conversation, currentUserId)
    : false;

  return (
    <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
      <MobileBackLink />

      <Avatar
        name={title}
        seed={conversation?.id ?? conversationId}
        isGroup={isGroup}
        size="sm"
      />

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold text-neutral-900">
          {title}
        </h1>
        <p className="truncate text-[11px] text-neutral-500">
          {!conversation ? (
            "Loading details…"
          ) : isGroup ? (
            <>
              {members.length} member{members.length === 1 ? "" : "s"}
              {youAreAdmin && " · You're an admin"}
            </>
          ) : (
            // Verbatim: the API stores this unvalidated, so it is not guaranteed to
            // look like a phone number.
            (conversation.participant?.phone ?? "Contact unavailable")
          )}
        </p>
      </div>

      {onOpenDetails && (
        <button
          type="button"
          onClick={onOpenDetails}
          title="Group info"
          aria-label="Group info and settings"
          className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
        >
          <Info className="size-4" />
        </button>
      )}
    </header>
  );
}

/** Returns to the list on mobile, where only one pane is visible at a time. */
function MobileBackLink() {
  return (
    <Link
      href="/chat"
      aria-label="Back to conversations"
      className="-ml-1 rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 md:hidden"
    >
      <ArrowLeft className="size-4" />
    </Link>
  );
}
