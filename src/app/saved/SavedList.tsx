"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { findActivity } from "@/data/activities";
import { findFood } from "@/data/foods";
import { useHydrated } from "@/hooks/useLocalStorage";
import { useSaved } from "@/hooks/useSaved";
import type { SavedItem } from "@/types";

interface Resolved {
  key: string;
  item: SavedItem;
  emoji: string;
  name: string;
  typeLabel: string;
  href: string;
}

function resolve(item: SavedItem): Resolved | null {
  if (item.type === "food") {
    const food = findFood(item.id);
    return food
      ? { key: `food-${food.id}`, item, emoji: food.emoji, name: food.name, typeLabel: "메뉴", href: `/food?id=${food.id}` }
      : null;
  }
  const activity = findActivity(item.id);
  return activity
    ? {
        key: `activity-${activity.id}`,
        item,
        emoji: activity.emoji,
        name: activity.name,
        typeLabel: "활동",
        href: `/activity?id=${activity.id}`,
      }
    : null;
}

export function SavedList() {
  const hydrated = useHydrated();
  const { items, remove } = useSaved();

  if (!hydrated) {
    return <div className="card h-40 animate-pulse" aria-label="불러오는 중" />;
  }

  const resolved = items.map(resolve).filter((r): r is Resolved => r !== null);

  if (resolved.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-4xl" aria-hidden>
          🗂️
        </p>
        <p className="mt-3 font-semibold">아직 저장한 결과가 없어요</p>
        <p className="mt-1 text-sm text-muted">추천 결과에서 &lsquo;저장&rsquo;을 누르면 여기에 모여요.</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Link href="/food" className="btn-primary">
            메뉴 추천받기
          </Link>
          <Link href="/activity" className="btn-secondary">
            할 일 추천받기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
      {resolved.map((r) => (
        <li key={r.key} className="flex items-center gap-2 pr-2">
          <Link href={r.href} className="flex min-h-16 min-w-0 flex-1 items-center gap-3 px-4 py-3 hover:bg-canvas">
            <span className="text-2xl" aria-hidden>
              {r.emoji}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold">{r.name}</span>
              <span className="block text-xs text-muted">
                {r.typeLabel} · {new Date(r.item.savedAt).toLocaleDateString("ko-KR")} 저장
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => remove(r.item.type, r.item.id)}
            className="grid size-11 shrink-0 place-items-center rounded-full text-muted hover:bg-canvas hover:text-ink"
            aria-label={`${r.name} 저장 삭제`}
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}
