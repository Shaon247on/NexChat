import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  DEFAULT_MESSAGE_LIMIT,
  getConversations,
  getMessages,
} from "@/lib/server/chat-data";
import { isApiError } from "@/lib/api/errors";
import { LOGIN_REASON_PARAM, ROUTES } from "@/lib/routes";
import type { MessageHistory } from "@/lib/validation/message";
import ConversationPane from "@/components/sections/chat/ConversationPane";

/**
 * One conversation.
 *
 * History is fetched here and passed down. Pagination is grow-the-limit via a
 * `?limit=` search param, which is what the API offers (`limit` + `hasMore`, no
 * cursor) — and it has the nice property that "load older messages" is just a link
 * to a bigger number, with no client state to manage.
 */
export default async function ConversationPage({
  params,
  searchParams,
}: {
  params: Promise<{ conversationId: string }>;
  searchParams: Promise<{ limit?: string }>;
}) {
  const [{ conversationId }, { limit }, session] = await Promise.all([
    params,
    searchParams,
    getCurrentUser(),
  ]);

  if (session.status !== "authenticated") {
    redirect(`${ROUTES.login}?${LOGIN_REASON_PARAM}=signed-out`);
  }

  const requestedLimit = Number.parseInt(limit ?? "", 10);
  const messageLimit = Number.isFinite(requestedLimit)
    ? requestedLimit
    : DEFAULT_MESSAGE_LIMIT;

  // Both reads are cached per request, so the layout's conversation fetch is shared
  // rather than repeated.
  const [conversations, history] = await Promise.all([
    getConversations().catch(() => null),
    getMessages(conversationId, messageLimit).catch(
      (error: unknown): MessageHistory | { error: string } => {
        if (isApiError(error)) return { error: error.userMessage };
        throw error;
      },
    ),
  ]);

  const conversation =
    conversations?.conversations.find(
      (candidate) => candidate.id === conversationId,
    ) ?? null;

  const historyFailed = "error" in history;

  return (
    <ConversationPane
      conversationId={conversationId}
      conversation={conversation}
      currentUser={session.user}
      messages={historyFailed ? [] : history.messages}
      hasMore={historyFailed ? false : history.hasMore}
      loadError={historyFailed ? history.error : null}
      limit={messageLimit}
    />
  );
}
