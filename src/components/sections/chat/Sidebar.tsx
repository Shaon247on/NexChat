"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Search, UsersRound, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchUsers } from "@/app/actions/users";
import {
  looksLikePhoneNumber,
  MIN_SEARCH_LENGTH,
} from "@/lib/validation/user";
import type { ConversationListResult } from "@/lib/validation/conversation";
import type { User } from "@/types/chat";
import ConversationRow from "./ConversationRow";
import Avatar from "./Avatar";
import SignOutButton from "./SignOutButton";
import NewGroupDialog from "./NewGroupDialog";

export default function Sidebar({
  currentUser,
  conversations,
  loadError,
  activeConversationId,
  onSelectUser,
  startingUserId,
}: {
  currentUser: User;
  /** Fetched in the layout's Server Component and passed down. */
  conversations: ConversationListResult | null;
  loadError: string | null;
  activeConversationId?: string;
  onSelectUser: (user: User) => void;
  /** Id of the person whose conversation is currently being created. */
  startingUserId?: string | null;
}) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);

  const [results, setResults] = useState<User[] | null>(null);
  /** The term `results` actually corresponds to, for accurate empty-state copy. */
  const [searchedTerm, setSearchedTerm] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * Monotonic id for the latest search. Type "sh" then "sha" quickly and the slower
   * first request can resolve last, overwriting newer results — so a response only
   * applies if it's still the current one. Without a query library doing
   * cancellation, this has to be explicit; it's the classic hand-rolled-search bug.
   */
  const requestIdRef = useRef(0);

  // Clear any pending debounce on unmount so a timer can't fire into a dead component.
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  /**
   * Debounce lives in the change handler rather than an effect, because searching is
   * a *response to an event*, not synchronisation with external state — and it keeps
   * every setState inside a callback.
   */
  const handleTermChange = (value: string) => {
    setTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      // Invalidate anything in flight so a late response can't repopulate the list.
      requestIdRef.current += 1;
      setResults(null);
      setSearchedTerm("");
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    debounceRef.current = setTimeout(() => {
      const requestId = (requestIdRef.current += 1);

      void searchUsers(trimmed).then((result) => {
        if (requestId !== requestIdRef.current) return;

        setIsSearching(false);
        setSearchedTerm(trimmed);

        if (result.ok) {
          setResults(result.data);
          setSearchError(null);
        } else {
          setResults([]);
          setSearchError(result.message);
        }
      });
    }, 300);
  };

  const isSearchMode = term.trim().length >= MIN_SEARCH_LENGTH;

  return (
    <aside className="flex h-full w-full flex-col border-r border-neutral-200 bg-white">
      <header className="flex items-center gap-3 border-b border-neutral-200 px-3 py-3">
        <Avatar name={currentUser.name} seed={currentUser.id} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {currentUser.name}
          </p>
          <p className="truncate text-[11px] text-neutral-400">
            {currentUser.phone}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewGroupOpen(true)}
          title="New group"
          aria-label="Create a new group"
          className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
        >
          <UsersRound className="size-4" />
        </button>

        <SignOutButton />
      </header>

      <NewGroupDialog
        open={isNewGroupOpen}
        onOpenChange={setIsNewGroupOpen}
        currentUserId={currentUser.id}
      />

      <div className="border-b border-neutral-200 p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            value={term}
            onChange={(event) => handleTermChange(event.target.value)}
            // The endpoint matches on name only, so the placeholder says so rather
            // than letting people discover it by getting no results.
            placeholder="Search people by name"
            aria-label="Search people by name"
            className="h-10 pr-9 pl-9 text-sm"
          />
          {term && (
            <button
              type="button"
              onClick={() => handleTermChange("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isSearchMode ? (
          <SearchResults
            term={searchedTerm || term}
            isSearching={isSearching}
            error={searchError}
            results={results}
            onSelectUser={onSelectUser}
            startingUserId={startingUserId}
          />
        ) : (
          <ConversationsPanel
            result={conversations}
            loadError={loadError}
            onRetry={() => router.refresh()}
            currentUserId={currentUser.id}
            activeConversationId={activeConversationId}
          />
        )}
      </div>
    </aside>
  );
}

/* ─────────────────────────── conversations ─────────────────────────── */

function ConversationsPanel({
  result,
  loadError,
  onRetry,
  currentUserId,
  activeConversationId,
}: {
  result: ConversationListResult | null;
  loadError: string | null;
  onRetry: () => void;
  currentUserId: string;
  activeConversationId?: string;
}) {
  const [isRetrying, startRetry] = useTransition();

  if (loadError && !result) {
    return (
      <StatusPanel
        icon={<AlertCircle className="size-5 text-blue-600" />}
        title="Couldn't load conversations"
        body={`${loadError} The server may be waking up — this usually works on a second try.`}
        action={
          <Button
            size="sm"
            className="mt-3 gap-1.5"
            disabled={isRetrying}
            onClick={() => startRetry(() => onRetry())}
          >
            {isRetrying && <Loader2 className="size-3.5 animate-spin" />}
            Try again
          </Button>
        }
      />
    );
  }

  const conversations = result?.conversations ?? [];

  if (conversations.length === 0) {
    return (
      <StatusPanel
        icon={<Search className="size-5 text-blue-600" />}
        title="No conversations yet"
        body="Search for someone by name to start your first chat."
      />
    );
  }

  return (
    <>
      <ul className="divide-y divide-neutral-100">
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <ConversationRow
              conversation={conversation}
              currentUserId={currentUserId}
              isActive={conversation.id === activeConversationId}
            />
          </li>
        ))}
      </ul>

      {/*
        Surfaced rather than swallowed: records that failed validation would
        otherwise just shorten the list silently, which is exactly how an upstream
        shape change goes unnoticed for a week.
      */}
      {result && result.skipped > 0 && (
        <p className="px-3 py-2.5 text-[11px] leading-relaxed text-neutral-400">
          {result.skipped} conversation{result.skipped === 1 ? "" : "s"} couldn&apos;t
          be displayed — the server returned an unexpected shape.
        </p>
      )}
    </>
  );
}

/* ─────────────────────────── search ─────────────────────────── */

function SearchResults({
  term,
  isSearching,
  error,
  results,
  onSelectUser,
  startingUserId,
}: {
  term: string;
  isSearching: boolean;
  error: string | null;
  results: User[] | null;
  onSelectUser: (user: User) => void;
  startingUserId?: string | null;
}) {
  if (error) {
    return (
      <StatusPanel
        icon={<AlertCircle className="size-5 text-blue-600" />}
        title="Search failed"
        body={error}
      />
    );
  }

  if (!results && isSearching) return <RowSkeletons count={3} />;

  const users = results ?? [];

  if (users.length === 0 && !isSearching) {
    /*
      An empty result and an impossible query look identical from the API — it
      returns [] for a phone number rather than an error. Saying so beats a bare
      "no results" for a search that could never have matched.
    */
    if (looksLikePhoneNumber(term)) {
      return (
        <StatusPanel
          icon={<Search className="size-5 text-blue-600" />}
          title="Search works by name"
          body="This directory only matches names, not phone numbers. Try the person's name instead."
        />
      );
    }

    return (
      <StatusPanel
        icon={<Search className="size-5 text-neutral-400" />}
        title={`No one matches "${term.trim()}"`}
        body="Check the spelling, or try a shorter name."
      />
    );
  }

  return (
    <>
      <p className="flex items-center gap-2 px-3 pt-3 pb-1 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
        People
        {isSearching && <Loader2 className="size-3 animate-spin" />}
      </p>

      <ul className="divide-y divide-neutral-100">
        {users.map((user) => {
          const isStarting = startingUserId === user.id;

          return (
            <li key={user.id}>
              <button
                type="button"
                onClick={() => onSelectUser(user)}
                disabled={Boolean(startingUserId)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-neutral-50 disabled:opacity-60"
              >
                <Avatar name={user.name} seed={user.id} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-neutral-900">
                    {user.name}
                  </span>
                  <span className="block truncate text-xs text-neutral-500">
                    {user.phone}
                  </span>
                </span>
                {isStarting && (
                  <Loader2 className="size-4 shrink-0 animate-spin text-blue-600" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ─────────────────────────── shared states ─────────────────────────── */

function RowSkeletons({ count = 7 }: { count?: number }) {
  return (
    <ul aria-hidden className="animate-pulse divide-y divide-neutral-100">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="flex items-center gap-3 px-3 py-2.5">
          <span className="size-11 shrink-0 rounded-full bg-neutral-100" />
          <span className="min-w-0 flex-1 space-y-2">
            <span className="block h-3.5 w-2/5 rounded bg-neutral-100" />
            <span className="block h-3 w-4/5 rounded bg-neutral-50" />
          </span>
        </li>
      ))}
    </ul>
  );
}

function StatusPanel({
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
    <div className="px-6 py-12 text-center">
      <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-blue-50">
        {icon}
      </span>
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{body}</p>
      {action}
    </div>
  );
}
