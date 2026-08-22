import { MessageSquare } from "lucide-react";

/**
 * Empty right-hand pane: nothing selected yet.
 *
 * Only reachable on desktop — on mobile the shell shows the conversation list
 * instead of an empty pane, since a full screen of "pick something" is wasted
 * space when the picker itself could be there.
 */
export default function ChatIndexPage() {
  return (
    <div className="flex h-full items-center justify-center border-l border-neutral-200 bg-neutral-50/40 px-6">
      <div className="max-w-sm text-center">
        <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-blue-50">
          <MessageSquare className="size-5 text-blue-600" />
        </span>

        <h1 className="text-base font-semibold text-neutral-900">
          Pick a conversation
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
          Choose a chat from the list, or search for someone by name to start a
          new one.
        </p>
      </div>
    </div>
  );
}
