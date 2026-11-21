"use client";

import { useEffect, useState } from "react";
import { kstDateKey } from "@/lib/kst";
import { STORAGE_KEYS, readRaw, writeRaw } from "@/lib/storage";

/** 이 숫자보다 적으면 계수기를 숨깁니다 (초반에 "오늘 손님 3명"처럼 썰렁해 보이지 않게) */
const SHOW_FROM = 50;

/**
 * 상단 로고 옆 "오늘 손님" 계수기
 * 같은 브라우저는 하루에 한 번만 세고(POST), 그 뒤로는 숫자만 받아옵니다(GET).
 */
export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const today = kstDateKey();
    const counted = readRaw(STORAGE_KEYS.visitDay) === today;
    let alive = true;
    fetch("/api/visit", { method: counted ? "GET" : "POST", cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { ok?: boolean; today?: number } | null) => {
        if (!alive || !data?.ok) return;
        if (!counted) writeRaw(STORAGE_KEYS.visitDay, today);
        setCount(data.today ?? 0);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (count === null || count < SHOW_FROM) return null;
  const digits = String(count).padStart(3, "0").split("");

  return (
    <p className="flex items-center gap-1.5 font-label text-[12px] leading-none sm:text-[13px]" aria-label={`오늘 손님 ${count}명`}>
      <span aria-hidden>오늘 손님</span>
      <span className="flex gap-[2px] rounded-[4px] border-2 border-ink bg-ink p-[2px]" aria-hidden>
        {digits.map((d, i) => (
          <span
            key={i}
            className="grid h-[18px] w-[13px] place-items-center rounded-[2px] bg-[#3a2a1f] font-sign text-[13px] text-[#F2D35B] sm:h-5 sm:w-[14px] sm:text-[14px]"
          >
            {d}
          </span>
        ))}
      </span>
      <span aria-hidden>명</span>
    </p>
  );
}
