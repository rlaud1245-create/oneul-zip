"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ShareButton } from "@/components/ShareButton";
import { StickyAction } from "@/components/ShopParts";
import { ZODIAC, fortuneFor, isZodiac, zodiacOfYear, type Zodiac } from "@/data/fortunes";
import { useHydrated, useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/cn";
import { STORAGE_KEYS } from "@/lib/storage";

interface Props {
  dateKey: string;
  /** 공유 링크(?z=말)로 들어왔을 때 처음 보여줄 띠 */
  initialZodiac?: Zodiac;
}

/**
 * 오늘의 운세: 철학관 부적
 * 띠를 고르면 오늘의 부적(등급, 문구, 행운의 색과 숫자, 조심할 것)이 나옵니다.
 * 고른 띠는 이 기기에 기억해 두었다가 다음에 바로 보여줍니다.
 */
export function FortunePicker({ dateKey, initialZodiac }: Props) {
  const [saved, setSaved] = useLocalStorage<string | null>(STORAGE_KEYS.zodiac, null);
  const hydrated = useHydrated();
  const [shared, setShared] = useState<Zodiac | null>(initialZodiac ?? null);
  const [year, setYear] = useState("");

  const zodiac: Zodiac | null = shared ?? (hydrated && isZodiac(saved) ? saved : null);
  const fortune = zodiac ? fortuneFor(dateKey, zodiac) : null;

  const choose = (z: Zodiac) => {
    setShared(null);
    setSaved(z);
    window.history.replaceState(null, "", "/fortune");
  };

  const yearNum = Number(year);
  const yearOk = year.length === 4 && yearNum >= 1920 && yearNum <= 2030;

  return (
    <div className="space-y-4">
      <section aria-labelledby="zodiac-title">
        <h2 id="zodiac-title" className="font-label text-[19px]">
          무슨 띠세요?
        </h2>
        <div className="mt-2 grid grid-cols-6 gap-1.5">
          {ZODIAC.map((z) => {
            const active = zodiac === z;
            return (
              <button
                key={z}
                type="button"
                aria-pressed={active}
                onClick={() => choose(z)}
                className={cn(
                  "min-h-11 rounded-lg border-2 border-ink px-0 font-label text-[16px] transition",
                  active ? "bg-sign text-sign-title" : "bg-surface hover:bg-primary-light",
                )}
              >
                {z}
              </button>
            );
          })}
        </div>

        <details className="mt-2">
          <summary className="inline-flex min-h-10 cursor-pointer items-center font-label text-[16px] text-primary-deep">
            띠를 모르겠어요
          </summary>
          <div className="mt-2 flex items-center gap-2">
            <label htmlFor="birth-year" className="sr-only">
              태어난 해
            </label>
            <input
              id="birth-year"
              inputMode="numeric"
              maxLength={4}
              placeholder="태어난 해 (예: 1995)"
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}
              className="min-h-11 w-44 rounded-lg border-2 border-ink bg-surface px-3 text-[16px]"
            />
            <button
              type="button"
              disabled={!yearOk}
              onClick={() => choose(zodiacOfYear(yearNum))}
              className="btn-secondary min-h-11 px-4 text-sm disabled:opacity-50"
            >
              {yearOk ? `${zodiacOfYear(yearNum)}띠 보기` : "찾기"}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-muted">1월~2월 초(설 전)에 태어났다면 전 해의 띠일 수 있어요.</p>
        </details>
      </section>

      <div aria-live="polite">
        {fortune ? (
          <motion.article
            key={`${dateKey}-${fortune.zodiac}`}
            initial={{ opacity: 0, y: 8, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -0.6 }}
            transition={{ duration: 0.25 }}
            className="talisman relative rounded-md border-4 border-ink px-5 py-5 shadow-[5px_5px_0_var(--shop-sign)]"
          >
            <div className="pointer-events-none absolute inset-1.5 rounded-sm border-2 border-primary" aria-hidden />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="font-label text-[16px] text-primary-deep">
                  {shared ? `친구가 보낸 ${fortune.zodiac}띠 부적` : `${fortune.zodiac}띠 오늘의 부적`}
                </p>
                <p className="font-brush text-[52px] leading-none text-primary-deep">{fortune.grade}</p>
              </div>
              <span
                className="grid size-16 shrink-0 rotate-[8deg] place-items-center rounded-md border-[3px] border-primary text-center font-sign text-[17px] leading-tight text-primary-deep"
                aria-hidden
              >
                오늘
                <br />
                .zip
              </span>
            </div>
            <p className="relative mt-3 text-[17px] font-bold leading-relaxed">{fortune.text}</p>
            <dl className="relative mt-4 grid grid-cols-3 gap-2">
              <div>
                <dt className="text-xs text-[#5E4636]">행운의 색</dt>
                <dd className="font-label text-[19px]">{fortune.color}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#5E4636]">행운의 숫자</dt>
                <dd className="font-label text-[19px]">{fortune.number}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#5E4636]">조심할 것</dt>
                <dd className="font-label text-[19px]">{fortune.caution}</dd>
              </div>
            </dl>
          </motion.article>
        ) : (
          <p className="rounded-md border-[3px] border-dashed border-ink/50 px-4 py-8 text-center font-label text-[19px]">
            띠를 고르면 오늘의 부적을 써드려요
          </p>
        )}
      </div>
      <p className="text-xs text-muted">재미로 보는 운세예요. 매일 자정(한국 시간)에 새 부적이 나와요.</p>

      {fortune && (
        <StickyAction>
          <ShareButton
            variant="primary"
            label="친구한테 부적 보내기"
            className="w-full text-[20px]"
            title="오늘.zip - 오늘의 운세"
            text={`[오늘의 부적] ${fortune.zodiac}띠 ${fortune.grade}! ${fortune.text}\n너는 무슨 띠야? 네 부적도 받아봐`}
            path={`/fortune?z=${encodeURIComponent(fortune.zodiac)}`}
          />
        </StickyAction>
      )}
    </div>
  );
}
