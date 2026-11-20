"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { STAMPED_EVENT, STAMP_STYLE, type StampedDetail } from "@/lib/stamps";

/** 오늘 첫 도장이 찍히면 화면 위에 잠깐 뜨는 알림 */
export function StampToast() {
  const [detail, setDetail] = useState<StampedDetail | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onStamp = (e: Event) => {
      setDetail((e as CustomEvent<StampedDetail>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setDetail(null), 4500);
    };
    window.addEventListener(STAMPED_EVENT, onStamp);
    return () => {
      window.removeEventListener(STAMPED_EVENT, onStamp);
      clearTimeout(timer);
    };
  }, []);

  const style = detail ? STAMP_STYLE[detail.shop] : null;

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center px-4">
      <AnimatePresence>
        {detail && style && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-card border-[3px] border-ink bg-surface px-3 py-2.5 shadow-[3px_4px_0_rgb(43_29_20/0.35)]"
          >
            <motion.span
              initial={{ scale: 1.8, rotate: -25, opacity: 0 }}
              animate={{ scale: 1, rotate: -10, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.05 }}
              className="grid size-12 shrink-0 place-items-center rounded-full font-sign text-[22px] text-white shadow-[inset_0_0_0_3px_rgb(255_255_255/0.55)]"
              style={{ backgroundColor: style.color }}
              aria-hidden
            >
              {style.char}
            </motion.span>
            <span className="min-w-0 flex-1">
              <span className="block font-label text-[17px] leading-tight">
                {detail.reward ? `${detail.reward.title}을 받았어요!` : `쾅! 오늘 도장 찍었어요`}
              </span>
              <span className="block text-[13px] text-muted">
                이번 판 {detail.inBoard}/30 · {style.name}에서 찍음
              </span>
            </span>
            <Link href="/stamp" className="shrink-0 rounded-full border-2 border-ink px-3 py-1.5 font-label text-[14px] hover:bg-primary-light">
              도장판
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
