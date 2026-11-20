"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useHydrated, useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import { BOARD_SIZE, EMPTY_STAMPS, STAMP_STYLE, boardCount, currentBoard, type StampData } from "@/lib/stamps";

/** 홈에 붙는 도장판 입구: 이번 판 진행도와 오늘 도장 여부 */
export function StampMini({ today }: { today: string }) {
  const [data] = useLocalStorage<StampData>(STORAGE_KEYS.stamps, EMPTY_STAMPS);
  const hydrated = useHydrated();
  const list = hydrated ? data.list : [];
  const board = currentBoard(list);
  const stampedToday = list.some((s) => s.d === today);
  const recent = board.slice(-7);

  return (
    <Link
      href="/stamp"
      className="card group mt-6 flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-primary-light"
    >
      <span className="flex shrink-0 -space-x-2" aria-hidden>
        {recent.length ? (
          recent.map((s, i) => (
            <span
              key={`${s.d}-${i}`}
              className="grid size-8 place-items-center rounded-full border-2 border-surface font-sign text-[14px] text-white"
              style={{ backgroundColor: STAMP_STYLE[s.s].color }}
            >
              {STAMP_STYLE[s.s].char}
            </span>
          ))
        ) : (
          <span className="grid size-8 place-items-center rounded-full border-2 border-dashed border-ink/50 font-label text-[13px]">?</span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-label text-[17px]">단골 도장판 {boardCount(list.length)}/{BOARD_SIZE}</span>
        <span className="block text-[13px] text-muted">
          {stampedToday ? "오늘 도장 받았어요. 내일 또 만나요!" : "오늘 아무 가게나 들르면 도장이 찍혀요"}
        </span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-muted group-hover:text-ink" aria-hidden />
    </Link>
  );
}
