"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, ChevronRight, RotateCcw } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { useHydrated, useLocalStorage } from "@/hooks/useLocalStorage";
import { BALANCE_CATEGORY_LABEL } from "@/lib/labels";
import { recordStamp } from "@/lib/stamps";
import { STORAGE_KEYS } from "@/lib/storage";
import type { BalanceQuestion, Choice } from "@/types";
import { buildPullBoard } from "./pullBoard";
import { voteStore, type VoteStats } from "./voteStore";

interface PastItem {
  dateKey: string;
  label: string;
  question: BalanceQuestion;
}

interface Props {
  question: BalanceQuestion;
  dateKey: string;
  dateLabel: string;
  isToday: boolean;
  past: PastItem[];
}

const NO_VOTES: Record<string, Choice> = {};
const PASTELS = ["#FFF0B8", "#D6E9CF", "#F4C9CD"];

/**
 * 오늘의 선택: 문방구 뽑기판
 * - 30칸 중 일부는 이미 "꽝"으로 뜯겨 있고(날짜마다 위치가 바뀜), 남은 칸을 뜯으면 A 또는 B가 나옵니다.
 * - 뜯어서 나온 쪽이 그날의 내 선택으로 저장됩니다. 다른 칸을 또 뜯으면 선택이 바뀝니다.
 */
export function BalanceGame({ question, dateKey, dateLabel, isToday, past }: Props) {
  const [votes, setVotes] = useLocalStorage<Record<string, Choice>>(STORAGE_KEYS.votes, NO_VOTES);
  const hydrated = useHydrated();
  const mine = hydrated ? votes[question.id] : undefined;
  const [stats, setStats] = useState<VoteStats | null>(null);
  const [opened, setOpened] = useState<number[]>([]);
  const board = useMemo(() => buildPullBoard(dateKey), [dateKey]);

  useEffect(() => {
    setOpened([]);
  }, [dateKey]);

  useEffect(() => {
    let alive = true;
    voteStore.getStats(question.id).then((s) => {
      if (alive) setStats(s);
    });
    return () => {
      alive = false;
    };
  }, [question.id, mine]);

  const tear = (index: number) => {
    const side = board.sides[index];
    if (!side || opened.includes(index)) return;
    setOpened((prev) => [...prev, index]);
    setVotes((prev) => ({ ...prev, [question.id]: side }));
    void voteStore.submit(question.id, side);
    recordStamp("stationery");
  };

  const reset = () => {
    setOpened([]);
    setVotes((prev) => {
      const next = { ...prev };
      delete next[question.id];
      return next;
    });
  };

  const textOf = (c: Choice) => (c === "a" ? question.a : question.b);
  const myText = mine ? textOf(mine) : null;
  const left = board.liveCount - opened.length;

  return (
    <div className="space-y-8">
      <section aria-labelledby="balance-question" className="space-y-4">
        <div className="flex items-stretch gap-3">
          <div className="card flex-1 px-4 py-3">
            <p className="eyebrow">
              {isToday ? "오늘의 상품" : `${dateLabel}의 상품`} ({BALANCE_CATEGORY_LABEL[question.category]})
            </p>
            <h2 id="balance-question" className="mt-1 font-sign text-[22px] font-normal leading-snug sm:text-[26px]">
              {question.a} <span className="text-primary-deep">vs</span> {question.b}
            </h2>
          </div>
          <div
            className="flex w-20 shrink-0 rotate-3 flex-col items-center justify-center gap-1 rounded-card border-[3px] border-ink bg-primary-strong text-center text-on-strong"
            aria-hidden
          >
            <span className="font-label text-[15px] leading-none">1회</span>
            <span className="font-sign text-[22px] leading-none">100원</span>
          </div>
        </div>

        <div className="rounded-card border-4 border-ink bg-primary-strong p-2.5 sm:p-3.5">
          <div className="flex items-center justify-between px-0.5 pb-2 font-label text-[16px] text-on-strong">
            <span>벌써 꽝 {board.dudCount}장</span>
            <span>남은 칸 {left}장</span>
          </div>
          <ul className="grid grid-cols-6 gap-1.5 sm:gap-2" aria-label="뽑기판">
            {board.sides.map((side, i) => {
              const isOpen = opened.includes(i);
              const state = side === null ? "dud" : isOpen ? "open" : "closed";
              const text = side === null ? "꽝" : isOpen ? (side === "a" ? "A" : "B") : String(i + 1);
              const label =
                side === null
                  ? `${i + 1}번 칸: 이미 뜯긴 꽝`
                  : isOpen
                    ? `${i + 1}번 칸: ${textOf(side)}`
                    : `${i + 1}번 칸 뜯기`;
              return (
                <li key={i}>
                  <button
                    type="button"
                    data-state={state}
                    disabled={state !== "closed"}
                    aria-label={label}
                    onClick={() => tear(i)}
                    className="pull-cell h-12 w-full rounded-[4px] border-2 border-ink font-label text-[18px] text-ink transition active:translate-y-0.5 disabled:cursor-default data-[state=dud]:text-[#7A2A1E] data-[state=open]:font-sign sm:h-14"
                    style={{
                      backgroundColor:
                        state === "dud" ? "#D8C3A0" : state === "open" ? "#FFF8E6" : PASTELS[(i + Math.floor(i / 6)) % 3],
                    }}
                  >
                    {text}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div aria-live="polite">
          {myText ? (
            <motion.div
              initial={{ opacity: 0, y: 8, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: -1 }}
              transition={{ duration: 0.25 }}
              className="card p-5"
            >
              <p className="eyebrow">{opened.length > 1 ? `${opened.length}장째 뽑은 쪽지` : "뽑힌 쪽지"}</p>
              <p className="mt-1 font-sign text-[28px] font-normal leading-tight">{myText}</p>

              {stats ? (
                <StatsBars question={question} stats={stats} />
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  뽑힌 쪽이 내 선택으로 이 기기에 기록돼요. 마음에 안 들면 남은 칸을 하나 더 뜯어보세요.
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button type="button" className="btn-ghost px-2 text-sm" onClick={reset}>
                  <RotateCcw className="size-4" aria-hidden />
                  처음부터
                </button>
                <ShareButton
                  className="px-2 text-sm"
                  title="오늘.zip - 오늘의 선택"
                  text={`[오늘의 뽑기] ${question.a} vs ${question.b}\n나는 "${myText}" 뽑았어! 너도 뽑아봐`}
                  path={`/balance?date=${dateKey}`}
                />
              </div>
            </motion.div>
          ) : (
            <p className="py-2 text-center font-label text-[19px]">남은 칸 중 하나를 뜯어보세요</p>
          )}
        </div>
      </section>

      {!isToday && (
        <Link href="/balance" className="btn-secondary w-full">
          오늘의 뽑기판 보러 가기
        </Link>
      )}

      <section aria-labelledby="past-title">
        <h2 id="past-title" className="font-sign text-xl font-normal">
          지난 뽑기판
        </h2>
        <ul className="mt-3 space-y-2">
          {past.map((item) => {
            const voted = hydrated && Boolean(votes[item.question.id]);
            return (
              <li key={item.dateKey}>
                <Link
                  href={`/balance?date=${item.dateKey}`}
                  aria-current={item.dateKey === dateKey ? "page" : undefined}
                  className="card flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-primary-light aria-[current=page]:bg-primary-light"
                >
                  <span className="w-14 shrink-0 font-label text-[16px] text-muted">{item.label}</span>
                  <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">
                    {item.question.a} <span className="text-muted">vs</span> {item.question.b}
                  </span>
                  {voted ? (
                    <Check className="size-4 shrink-0 text-primary-deep" aria-label="뽑음" />
                  ) : (
                    <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function StatsBars({ question, stats }: { question: BalanceQuestion; stats: VoteStats }) {
  const pa = stats.total ? Math.round((stats.a / stats.total) * 100) : 0;
  const rows = [
    { text: question.a, percent: pa },
    { text: question.b, percent: stats.total ? 100 - pa : 0 },
  ];
  return (
    <div className="mt-4 space-y-2 text-left">
      {rows.map((row) => (
        <div key={row.text}>
          <div className="flex justify-between text-sm">
            <span className="truncate">{row.text}</span>
            <span className="font-semibold">{row.percent}%</span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full border-2 border-ink bg-surface">
            <div className="h-full bg-primary" style={{ width: `${row.percent}%` }} />
          </div>
        </div>
      ))}
      <p className="text-right text-xs text-muted">총 {stats.total.toLocaleString()}명 참여</p>
    </div>
  );
}
