"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  LogOut,
  Pencil,
  Plus,
  ShieldCheck,
  ShieldPlus,
  UserMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addParticipants,
  promoteToAdmin,
  removeParticipant,
  renameGroup,
} from "@/app/actions/conversations";
import { groupNameSchema } from "@/lib/validation/group";
import type { GroupConversation, User } from "@/types/chat";
import ChatDialog from "./ChatDialog";
import MemberPicker from "./MemberPicker";
import Avatar from "./Avatar";

/**
 * Group management.
 *
 * Mirrors the API's permission model exactly: only admins may rename, add, remove, or
 * promote; any member may leave. Actions the current user can't perform aren't
 * rendered at all rather than shown disabled — a control you can never use is noise,
 * and the server would reject it anyway.
 *
 * Every mutation is a Server Action that revalidates `/chat`, so the member list and
 * sidebar update from fresh server data with no client cache to reconcile.
 */
export default function GroupDetailsDialog({
  open,
  onOpenChange,
  conversation,
  currentUserId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: GroupConversation;
  currentUserId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isRenaming, setIsRenaming] = useState(false);
  const [draftName, setDraftName] = useState(conversation.name);
  const [isAdding, setIsAdding] = useState(false);
  const [toAdd, setToAdd] = useState<User[]>([]);

  const isAdmin = conversation.adminIds.includes(currentUserId);
  const adminIds = new Set(conversation.adminIds);
  const nameIsValid = groupNameSchema.safeParse(draftName).success;

  const handleRename = () => {
    if (!nameIsValid) return;

    startTransition(async () => {
      const result = await renameGroup(conversation.id, draftName.trim());
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setIsRenaming(false);
      toast.success("Group renamed");
    });
  };

  const handleAdd = () => {
    startTransition(async () => {
      const result = await addParticipants(
        conversation.id,
        toAdd.map((user) => user.id),
        // The API can't detect an existing member, so the current roster is passed in
        // and filtered server-side as a backstop to the picker's exclusion.
        conversation.participants.map((member) => member.id),
      );

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setToAdd([]);
      setIsAdding(false);
      toast.success("Members added");
    });
  };

  const handleRemove = (member: User) => {
    startTransition(async () => {
      const result = await removeParticipant(conversation.id, member.id);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(`Removed ${member.name}`);
    });
  };

  const handlePromote = (member: User) => {
    startTransition(async () => {
      const result = await promoteToAdmin(conversation.id, member.id);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(`${member.name} is now an admin`);
    });
  };

  const handleLeave = () => {
    startTransition(async () => {
      // Same endpoint as removing someone — leaving is just passing your own id.
      const result = await removeParticipant(conversation.id, currentUserId);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      onOpenChange(false);
      toast.success(`You left “${conversation.name}”`);
      // The thread is no longer ours, so the current route won't resolve.
      router.push("/chat");
    });
  };

  return (
    <ChatDialog
      open={open}
      onOpenChange={onOpenChange}
      title={conversation.name}
      description={`${conversation.participants.length} members · ${conversation.adminIds.length} admin${conversation.adminIds.length === 1 ? "" : "s"}`}
      className="max-w-lg"
    >
      {isAdmin && (
        <section className="border-b border-neutral-100 px-5 py-4">
          {isRenaming ? (
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="rename-group"
                  className="text-xs font-medium text-neutral-500"
                >
                  Group name
                </label>
                <Input
                  id="rename-group"
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  maxLength={60}
                  autoFocus
                  className="mt-1.5 h-10 px-3 text-sm"
                />
              </div>
              <Button
                size="sm"
                onClick={handleRename}
                disabled={!nameIsValid || isPending}
                className="h-10 gap-1.5 px-4"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsRenaming(false);
                  setDraftName(conversation.name);
                }}
                className="h-10 px-3"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsRenaming(true)}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 transition-opacity hover:opacity-75"
            >
              <Pencil className="size-3.5" />
              Rename group
            </button>
          )}
        </section>
      )}

      <section className="px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
            Members
          </h3>

          {isAdmin && !isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 transition-opacity hover:opacity-75"
            >
              <Plus className="size-3.5" />
              Add people
            </button>
          )}
        </div>

        <ul className="space-y-1">
          {conversation.participants.map((member) => {
            const isMe = member.id === currentUserId;
            const memberIsAdmin = adminIds.has(member.id);

            return (
              <li
                key={member.id}
                className="flex items-center gap-3 rounded-lg px-1 py-1.5"
              >
                <Avatar name={member.name} seed={member.id} size="sm" />

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-medium text-neutral-900">
                      {isMe ? "You" : member.name}
                    </span>
                    {memberIsAdmin && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                        <ShieldCheck className="size-2.5" />
                        Admin
                      </span>
                    )}
                  </span>
                  <span className="block truncate text-xs text-neutral-500">
                    {member.phone}
                  </span>
                </span>

                {/* Admin-only, and never against yourself — leaving is separate. */}
                {isAdmin && !isMe && (
                  <span className="flex shrink-0 items-center gap-1">
                    {!memberIsAdmin && (
                      <button
                        type="button"
                        onClick={() => handlePromote(member)}
                        disabled={isPending}
                        title="Make admin"
                        aria-label={`Make ${member.name} an admin`}
                        className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
                      >
                        <ShieldPlus className="size-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(member)}
                      disabled={isPending}
                      title="Remove from group"
                      aria-label={`Remove ${member.name} from the group`}
                      className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <UserMinus className="size-3.5" />
                    </button>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {isAdding && (
        <section className="border-t border-neutral-100">
          <div className="flex items-center justify-between px-5 pt-4">
            <h3 className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
              Add people
            </h3>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={toAdd.length === 0 || isPending}
              className="h-8 gap-1.5 px-3 text-xs"
            >
              {isPending && <Loader2 className="size-3 animate-spin" />}
              Add {toAdd.length > 0 ? toAdd.length : ""}
            </Button>
          </div>

          {/*
            Existing members are excluded from the results. The API can't tell that
            someone is already in the group, so a duplicate add would silently
            succeed — the fix is to make it unofferable.
          */}
          <MemberPicker
            selected={toAdd}
            onToggle={(user) =>
              setToAdd((previous) =>
                previous.some((candidate) => candidate.id === user.id)
                  ? previous.filter((candidate) => candidate.id !== user.id)
                  : [...previous, user],
              )
            }
            excludeIds={conversation.participants.map((member) => member.id)}
            emptyHint="Search for people who aren't in this group yet."
          />
        </section>
      )}

      <section className="border-t border-neutral-100 px-5 py-4">
        <button
          type="button"
          onClick={handleLeave}
          disabled={isPending}
          className="flex items-center gap-2 text-sm font-medium text-red-600 transition-opacity hover:opacity-75 disabled:opacity-50"
        >
          <LogOut className="size-3.5" />
          Leave group
        </button>
      </section>
    </ChatDialog>
  );
}
