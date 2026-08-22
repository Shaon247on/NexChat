import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getConversations } from "@/lib/server/chat-data";
import { isApiError } from "@/lib/api/errors";
import { LOGIN_REASON_PARAM, ROUTES } from "@/lib/routes";
import type { ConversationListResult } from "@/lib/validation/conversation";
import ChatShell from "@/components/sections/chat/ChatShell";

/**
 * Two-pane shell.
 *
 * The conversation list is fetched here, on the server, and passed down as props —
 * there is no client-side data cache. Mutations call Server Actions which
 * `revalidatePath('/chat', 'layout')`, which re-runs this function and streams fresh
 * props to the sidebar.
 *
 * The sidebar lives in a layout rather than each page so it survives navigation
 * between conversations: no remount, no refetch, no scroll reset when switching
 * threads.
 */
export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUser();

  // The route-group layout above handled every other case; this narrows the type.
  if (session.status !== "authenticated") {
    redirect(`${ROUTES.login}?${LOGIN_REASON_PARAM}=signed-out`);
  }

  // A failure here must not take down the shell — the sidebar renders its own error
  // state and the user can retry.
  let conversations: ConversationListResult | null = null;
  let loadError: string | null = null;

  try {
    conversations = await getConversations();
  } catch (error) {
    if (!isApiError(error)) throw error;
    loadError = error.userMessage;
  }

  return (
    <ChatShell
      currentUser={session.user}
      conversations={conversations}
      loadError={loadError}
    >
      {children}
    </ChatShell>
  );
}
