"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSaved } from "@/hooks/useSaved";
import { cn } from "@/lib/cn";
import type { SavedType } from "@/types";

export function SaveButton({ type, id, className }: { type: SavedType; id: string; className?: string }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(type, id);

  return (
    <button type="button" aria-pressed={saved} onClick={() => toggle(type, id)} className={cn("btn-ghost", className)}>
      {saved ? (
        <BookmarkCheck className="size-4 text-primary" aria-hidden />
      ) : (
        <Bookmark className="size-4" aria-hidden />
      )}
      {saved ? "저장됨" : "저장"}
    </button>
  );
}
