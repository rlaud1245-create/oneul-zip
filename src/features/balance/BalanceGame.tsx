"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, ChevronRight, RotateCcw } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { useHydrated, useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/cn";
import { BALANCE_CATEGORY_LABEL } from "@/lib/labels";
import { STORAGE_KEYS } from "@/lib/storage";
import type { BalanceQuestion, Choice } from "@/types";
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

export function BalanceGame({ question, dateKey, dateLabel, isToday, past }: Props) {
  const [votes, setVotes] = useLocalStorage<Record<string, Choice>>(STORAGE_KEYS.votes, NO_VOTES);
  const hydrated = useHydrated();
  const mine = hydrated ? votes[question.id] : undefined;
  const [stats, setStats] = useState<VoteStats | null>(null);

  useEffect(() => {
    let alive = true;
    voteStore.getStats(question.id).then((s) => {
      if (alive) setStats(s);
    });
    return () => {
      alive = false;
    };
  }, [question.id, mine]);

  const choose = (choice: Choice) => {
    setVotes((prev) => ({ ...prev, [question.id]: choice }));
    void voteStore.submit(question.id, choice);
  };

  const undo = () =>
    setVotes((prev) => {
      const next = { ...prev };
      delete next[question.id];
      return next;
    });

  const myText = mine === "a" ? question.a : mine === "b" ? question.b : null;

  return (
    <div className="space-y-8">
      <section aria-labelledby="balance-question" className="card p-5 sm:p-8">
        <p className="text-center text-sm font-semibold text-primary-deep">
          {isToday ? "오늘의 선택" : `${dateLabel}의 선택`} · {BALANCE_CATEGORY_LABEL[question.category]}
        </p>
        <h2 id="balance-question" className="sr-only">
          {question.a} 대 {question.b}
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
          <OptionButton text={question.a} label="A" selected={mine === "a"} dimmed={mine === "b"} onClick={() => choose("a")} />
          <div className="flex items-center justify-center text-sm font-black tracking-widest text-muted" aria-hidden>
            VS
          </div>
          <OptionButton text={question.b} label="B" selected={mine === "b"} dimmed={mine === "a"} onClick={() => choose("b")} />
        </div>

        <div aria-live="polite">
          {myText && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-6 rounded-2xl bg-canvas p-5 text-center"
            >
              <p className="text-sm text-muted">나의 선택</p>
              <p className="mt-1 text-lg font-bold">{myText}</p>

              {stats ? (
                <StatsBars question={question} stats={stats} />
              ) : (
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  아직은 내 선택만 이 기기에 기록돼요.
                  <br />
                  전체 투표 결과는 집계 기능이 준비되면 보여드릴게요.
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button type="button" className="btn-ghost px-2 text-sm" onClick={undo}>
                  <RotateCcw className="size-4" aria-hidden />
                  다시 고르기
                </button>
                <ShareButton
                  className="px-2 text-sm"
                  title="오늘.zip - 오늘의 선택"
                  text={`[오늘의 선택] ${question.a} vs ${question.b}\n나는 "${myText}"! 너는?`}
                  path={`/balance?date=${dateKey}`}
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {!isToday && (
        <Link href="/balance" className="btn-secondary w-full">
          오늘의 질문 보러 가기
        </Link>
      )}

      <section aria-labelledby="past-title">
        <h2 id="past-title" className="text-lg font-bold">
          지난 질문
        </h2>
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
          {past.map((item) => {
            const voted = hydrated && Boolean(votes[item.question.id]);
            return (
              <li key={item.dateKey}>
                <Link
                  href={`/balance?date=${item.dateKey}`}
                  aria-current={item.dateKey === dateKey ? "page" : undefined}
                  className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-canvas aria-[current=page]:bg-primary-light/60"
                >
                  <span className="w-16 shrink-0 text-sm text-muted">{item.label}</span>
                  <span className="min-w-0 flex-1 truncate text-[15px]">
                    {item.question.a} <span className="text-muted">vs</span> {item.question.b}
                  </span>
                  {voted ? (
                    <Check className="size-4 shrink-0 text-primary" aria-label="참여함" />
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

interface OptionProps {
  text: string;
  label: string;
  selected: boolean;
  dimmed: boolean;
  onClick: () => void;
}

function OptionButton({ text, label, selected, dimmed, onClick }: OptionProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "relative flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 text-center transition-colors",
        selected
          ? "border-primary-strong bg-primary-strong text-white"
          : "border-line bg-surface hover:border-primary/50",
        dimmed && "opacity-55",
      )}
    >
      <span
        className={cn(
          "grid size-7 place-items-center rounded-full text-xs font-bold",
          selected ? "bg-white/20 text-white" : "bg-primary-light text-primary-deep",
        )}
        aria-hidden
      >
        {selected ? <Check className="size-4" /> : label}
      </span>
      <span className="text-lg font-bold leading-snug">{text}</span>
    </motion.button>
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
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-primary" style={{ width: `${row.percent}%` }} />
          </div>
        </div>
      ))}
      <p className="text-right text-xs text-muted">총 {stats.total.toLocaleString()}명 참여</p>
    </div>
  );
}
