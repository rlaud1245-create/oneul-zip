"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

interface Props {
  /** 값이 바뀔 때마다 등장 애니메이션이 다시 재생됩니다 */
  animationKey: string;
  eyebrow: string;
  emoji: string;
  title: string;
  tags: string[];
  quote: string;
  sponsored?: boolean;
  /** menu: 분식집 "사장님 추천" 쪽지 / ticket: 놀이동산 자유이용권 */
  variant?: "menu" | "ticket";
  /** 머리띠 오른쪽 작은 글씨 (예: 티켓 번호) */
  stamp?: string;
  children?: ReactNode;
  actions: ReactNode;
}

export function ResultCard({
  animationKey,
  eyebrow,
  emoji,
  title,
  tags,
  quote,
  sponsored,
  variant = "menu",
  stamp,
  children,
  actions,
}: Props) {
  const ticket = variant === "ticket";
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={animationKey}
        initial={{ opacity: 0, y: 10, rotate: ticket ? 0 : -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={cn("card overflow-hidden", ticket && "ticket")}
      >
        <div className="sign-band flex items-center justify-between gap-3 border-b-[3px] px-5 py-2.5">
          <p className="font-sign text-lg">
            {eyebrow}
            {sponsored && (
              <span className="ml-2 rounded-full bg-ink px-2 py-0.5 align-middle font-sans text-[11px] font-semibold text-white">
                광고
              </span>
            )}
          </p>
          {stamp && <span className="font-label text-[15px]">{stamp}</span>}
        </div>

        <div className="px-6 pb-5 pt-5">
          <div className="flex items-center gap-4">
            <span
              className="grid size-16 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-primary-light text-4xl leading-none"
              aria-hidden
            >
              {emoji}
            </span>
            <div className="min-w-0">
              <h2 className="font-sign text-[34px] font-normal leading-tight">{title}</h2>
              <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="정보">
                {tags.map((tag) => (
                  <li key={tag} className="rounded-full border-2 border-ink bg-surface px-2.5 py-0.5 font-label text-[15px]">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-[17px] font-medium leading-relaxed">{quote}</p>
          {children}
        </div>

        <div className={cn("px-6 pb-6", ticket && "border-t-[3px] border-dashed border-ink pt-5")}>
          <div className="grid grid-cols-3 gap-2">{actions}</div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

export function ResultPlaceholder({ text }: { text: string }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-card border-[3px] border-dashed border-ink/50 p-8 text-center">
      <p className="font-label text-[19px] leading-relaxed text-muted">{text}</p>
    </div>
  );
}

interface EmptyProps {
  relaxLabel: string | null;
  onRelax: () => void;
  onReset: () => void;
  /** 조사를 포함해서 넘겨주세요. 예: "메뉴가", "활동이" */
  noun: string;
}

/** 조건에 맞는 결과가 없을 때 */
export function ResultEmpty({ relaxLabel, onRelax, onReset, noun }: EmptyProps) {
  return (
    <div className="card p-6 text-center">
      <p className="font-sign text-2xl">품절이에요</p>
      <p className="mt-2 font-semibold">조건에 딱 맞는 {noun} 없어요.</p>
      {relaxLabel ? (
        <>
          <p className="mt-1 text-sm text-muted">
            <strong className="font-semibold text-ink">{relaxLabel}</strong> 조건을 빼면 추천해 드릴 수 있어요.
          </p>
          <button type="button" className="btn-primary mt-5 w-full" onClick={onRelax}>
            이 조건 빼고 추천받기
          </button>
        </>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">조건을 조금 바꿔서 다시 시도해 보세요.</p>
          <button type="button" className="btn-secondary mt-5 w-full" onClick={onReset}>
            조건 초기화
          </button>
        </>
      )}
    </div>
  );
}
