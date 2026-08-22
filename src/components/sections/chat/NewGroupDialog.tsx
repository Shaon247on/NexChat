"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGroup } from "@/app/actions/conversations";
import {
  MIN_GROUP_PARTICIPANTS,
  createGroupInputSchema,
} from "@/lib/validation/group";
import type { User } from "@/types/chat";
import ChatDialog from "./ChatDialog";
import MemberPicker from "./MemberPicker";

/**
 * New-group flow: a name plus at least two other people.
 *
 * The three-member minimum is enforced here as well as in the action, so the button
 * explains what's missing rather than the form failing after submission.
 * `currentUserId` is excluded from the picker — you're added implicitly, and offering
 * yourself would both confuse and miscount toward the minimum.
 */
export default function NewGroupDialog({
  open,
  onOpenChange,
  currentUserId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [selected, setSelected] = useState<User[]>([]);

  const parsed = createGroupInputSchema.safeParse({
    name,
    participantIds: selected.map((user) => user.id),
  });

  const reset = () => {
    setName("");
    setSelected([]);
  };

  const handleToggle = (user: User) => {
    setSelected((previous) =>
      previous.some((candidate) => candidate.id === user.id)
        ? previous.filter((candidate) => candidate.id !== user.id)
        : [...previous, user],
    );
  };

  const handleCreate = () => {
    if (!parsed.success) return;

    startTransition(async () => {
      const result = await createGroup(parsed.data);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      onOpenChange(false);
      reset();
      toast.success(`Created “${parsed.data.name}”`);
      // The action revalidated the list, so the new group is already there.
      router.push(`/chat/${result.data.id}`);
    });
  };

  const shortBy = MIN_GROUP_PARTICIPANTS - selected.length;

  return (
    <ChatDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
      title="New group"
      description={`A group needs three members, so pick at least ${MIN_GROUP_PARTICIPANTS} people besides yourself.`}
      className="max-w-lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            {selected.length === 0
              ? "No one selected yet"
              : shortBy > 0
                ? `${selected.length} selected — pick ${shortBy} more`
                : `${selected.length} selected · ${selected.length + 1} members total`}
          </p>

          <Button
            onClick={handleCreate}
            disabled={!parsed.success || isPending}
            size="lg"
            className="h-10 gap-2 px-5 text-sm font-semibold"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Create group
          </Button>
        </div>
      }
    >
      <div className="border-b border-neutral-100 px-5 py-4">
        <Label htmlFor="group-name" className="text-neutral-800">
          Group name
        </Label>
        <Input
          id="group-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Project Team"
          maxLength={60}
          className="mt-2 h-11 px-3.5 text-base"
        />
      </div>

      <MemberPicker
        selected={selected}
        onToggle={handleToggle}
        excludeIds={[currentUserId]}
        emptyHint="Search for people to add to the group."
      />
    </ChatDialog>
  );
}
