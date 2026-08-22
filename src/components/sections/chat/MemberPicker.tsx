"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { searchUsers } from "@/app/actions/users";
import {
  looksLikePhoneNumber,
  MIN_SEARCH_LENGTH,
} from "@/lib/validation/user";
import type { User } from "@/types/chat";
import Avatar from "./Avatar";

/**
 * Search-and-select control for choosing people.
 *
 * `excludeIds` is the primary fix for a real API gap: the backend does **not** detect
 * that someone is already in a group, so adding a duplicate succeeds silently. The
 * most reliable prevention is to never offer the option — an existing member simply
 * isn't in the results. (The action filters again as a backstop, but a control that
 * can't be misused beats a validation that catches misuse.)
 */
export default function MemberPicker({
  selected,
  onToggle,
  excludeIds = [],
  emptyHint,
}: {
  selected: User[];
  onToggle: (user: User) => void;
  excludeIds?: string[];
  emptyHint?: string;
}) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<User[] | null>(null);
  const [searchedTerm, setSearchedTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Guards against a slower earlier request resolving after a newer one. */
  const requestIdRef = useRef(0);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  // Debounced in the change handler rather than an effect: searching is a response to
  // an event, not synchronisation with external state.
  const handleTermChange = (value: string) => {
    setTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      requestIdRef.current += 1;
      setResults(null);
      setSearchedTerm("");
      setError(null);
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
          setError(null);
        } else {
          setResults([]);
          setError(result.message);
        }
      });
    }, 300);
  };

  const excluded = new Set(excludeIds);
  const selectedIds = new Set(selected.map((user) => user.id));
  const visible = (results ?? []).filter((user) => !excluded.has(user.id));
  const hasQuery = term.trim().length >= MIN_SEARCH_LENGTH;

  return (
    <div className="flex flex-col">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-b border-neutral-100 px-5 py-3">
          {selected.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => onToggle(user)}
              className="flex items-center gap-1.5 rounded-full bg-blue-50 py-1 pr-1.5 pl-2.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
            >
              {user.name}
              <X className="size-3" />
            </button>
          ))}
        </div>
      )}

      <div className="px-5 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            value={term}
            onChange={(event) => handleTermChange(event.target.value)}
            placeholder="Search people by name"
            aria-label="Search people by name"
            className="h-10 pl-9 text-sm"
          />
        </div>
      </div>

      <div className="min-h-32 px-2 pb-2">
        {!hasQuery ? (
          <p className="px-3 py-6 text-center text-xs leading-relaxed text-neutral-400">
            {emptyHint ?? "Type a name to find people."}
          </p>
        ) : error ? (
          <p className="px-3 py-6 text-center text-xs leading-relaxed text-red-600">
            {error}
          </p>
        ) : isSearching && !results ? (
          <p className="flex items-center justify-center gap-2 px-3 py-6 text-xs text-neutral-400">
            <Loader2 className="size-3.5 animate-spin" />
            Searching
          </p>
        ) : visible.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs leading-relaxed text-neutral-500">
            {looksLikePhoneNumber(searchedTerm || term)
              ? "This directory matches names only, not phone numbers."
              : `No one else matches "${(searchedTerm || term).trim()}".`}
          </p>
        ) : (
          <ul>
            {visible.map((user) => {
              const isSelected = selectedIds.has(user.id);

              return (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => onToggle(user)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                      isSelected ? "bg-blue-50" : "hover:bg-neutral-50",
                    )}
                  >
                    <Avatar name={user.name} seed={user.id} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-neutral-900">
                        {user.name}
                      </span>
                      <span className="block truncate text-xs text-neutral-500">
                        {user.phone}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border",
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-neutral-300",
                      )}
                    >
                      {isSelected && <Check className="size-3" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
