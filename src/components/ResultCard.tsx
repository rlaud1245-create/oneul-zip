"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  /** 값이 바뀔 때마다 등장 애니메이션이 다시 재생됩니다 */
  animationKey: string;
  eyebrow: string;
  emoji: string;
  title: string;
  tags: string[];
  quote: string;
  sponsored?: boolean;
  children?: ReactNode;
  actions: ReactNode;
}

export function ResultCard({ animationKey, eyebrow, emoji, title, tags, quote, sponsored, children, actions }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={animationKey}
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="card overflow-hidden"
      >
        <div className="bg-linear-to-b from-primary-light/80 to-surface px-6 pb-2 pt-6 text-center">
          <p className="text-sm font-semibold text-primary-deep">
            {eyebrow}
            {sponsored && (
              <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold text-white">광고</span>
            )}
          </p>
          <motion.div
            initial={{ scale: 0.6, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.05 }}
            className="mt-4 text-6xl leading-none"
            aria-hidden
          >
            {emoji}
          </motion.div>
          <h2 className="mt-4 text-[26px] font-bold tracking-tight">{title}</h2>
          <ul className="mt-3 flex flex-wrap justify-center gap-1.5" aria-label="정보">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted ring-1 ring-line">
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <div className="px-6 pb-6 pt-4">
          <p className="text-center text-[17px] font-medium leading-relaxed">“{quote}”</p>
          {children}
          <div className="mt-6 grid grid-cols-3 gap-2">{actions}</div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

export function ResultPlaceholder({ text }: { text: string }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-card border-2 border-dashed border-line p-8 text-center">
      <p className="leading-relaxed text-muted">{text}</p>
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
      <p className="text-4xl" aria-hidden>
        🤔
      </p>
      <p className="mt-3 font-semibold">조건에 딱 맞는 {noun} 없어요.</p>
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
