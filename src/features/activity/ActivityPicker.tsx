"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { ChipGroup } from "@/components/ChipGroup";
import { ResultEmpty } from "@/components/ResultCard";
import { SaveButton } from "@/components/SaveButton";
import { ShareButton } from "@/components/ShareButton";
import { OptionsDrawer, StickyAction } from "@/components/ShopParts";
import { activities, findActivity } from "@/data/activities";
import { useRecommender } from "@/hooks/useRecommender";
import { cn } from "@/lib/cn";
import { BUDGET_LABEL, BUDGET_ORDER, COMPANION_LABEL, MOOD_LABEL, TIME_LABEL, TIME_ORDER, toOptions } from "@/lib/labels";
import type { Condition } from "@/lib/recommend";
import { scrollToResult } from "@/lib/scroll";
import { STORAGE_KEYS } from "@/lib/storage";
import type { Activity, Budget, Companion, Mood, TimeSlot } from "@/types";

type ActivityFilters = {
  companion: Companion | null;
  mood: Mood | null;
  time: TimeSlot | null;
  budget: Budget | null;
};

const EMPTY_FILTERS: ActivityFilters = { companion: null, mood: null, time: null, budget: null };

/** 놀이동산 테마: 기분 = 놀이기구 강도 (약한 것부터) */
const RIDES: { mood: Mood; ride: string; feel: string }[] = [
  { mood: "rest", ride: "회전목마", feel: "쉬고 싶어" },
  { mood: "bored", ride: "범퍼카", feel: "심심해" },
  { mood: "refresh", ride: "바이킹", feel: "기분 전환" },
  { mood: "active", ride: "롤러코스터", feel: "몸 쓰고 싶어" },
];
const RIDE_OF: Record<Mood, string> = { rest: "회전목마", bored: "범퍼카", refresh: "바이킹", active: "롤러코스터" };

const COMPANION_OPTIONS = toOptions(COMPANION_LABEL);
const TIME_OPTIONS = toOptions(TIME_LABEL);
const BUDGET_OPTIONS = toOptions(BUDGET_LABEL);

/** 완화 우선순위: 예산 → 시간 → 기분 → 동행 */
function buildConditions(f: ActivityFilters): Condition<Activity>[] {
  const conditions: Condition<Activity>[] = [];
  if (f.budget) {
    const limit = BUDGET_ORDER.indexOf(f.budget);
    conditions.push({
      key: "budget",
      label: `예산(${BUDGET_LABEL[f.budget]})`,
      // 선택한 예산 이하로 할 수 있는 활동 ("3만 원 이상"은 전체)
      test: (a) => BUDGET_ORDER.indexOf(a.cost) <= limit,
    });
  }
  if (f.time) {
    const slot = TIME_ORDER.indexOf(f.time);
    conditions.push({
      key: "time",
      label: `시간(${TIME_LABEL[f.time]})`,
      // 주어진 시간 안에 끝나되, 너무 짧지 않은 활동 (같은 구간 또는 한 단계 짧은 구간)
      test: (a) => {
        const need = TIME_ORDER.indexOf(a.time);
        return need <= slot && need >= slot - 1;
      },
    });
  }
  if (f.mood) {
    const mood = f.mood;
    conditions.push({ key: "mood", label: `기분(${MOOD_LABEL[mood]})`, test: (a) => a.moods.includes(mood) });
  }
  if (f.companion) {
    const companion = f.companion;
    conditions.push({
      key: "companion",
      label: `함께하는 사람(${COMPANION_LABEL[companion]})`,
      test: (a) => a.companions.includes(companion),
    });
  }
  return conditions;
}

/**
 * 오늘 뭐 하지: 놀이동산 매표소
 * 놀이기구(기분) 고르기 → 1일 자유이용권 → 같은 강도의 다른 놀거리 → 아무거나 타기 버튼
 */
export function ActivityPicker({ initialId }: { initialId?: string }) {
  const resultRef = useRef<HTMLDivElement>(null);
  const r = useRecommender({
    items: activities,
    emptyFilters: EMPTY_FILTERS,
    buildConditions,
    recentKey: STORAGE_KEYS.recentActivity,
    path: "/activity",
    initialItem: initialId ? (findActivity(initialId) ?? null) : null,
  });

  const run = () => {
    r.recommend();
    scrollToResult(resultRef.current);
  };

  const activity = r.result;
  const rideMood: Mood | null = r.filters.mood ?? activity?.moods[0] ?? null;
  const others = activity
    ? activities.filter((a) => a.id !== activity.id && rideMood !== null && a.moods.includes(rideMood)).slice(0, 3)
    : [];

  const optionSummary =
    [
      r.filters.companion && COMPANION_LABEL[r.filters.companion],
      r.filters.time && TIME_LABEL[r.filters.time],
      r.filters.budget && BUDGET_LABEL[r.filters.budget],
    ]
      .filter(Boolean)
      .join(", ") || "누구랑, 얼마나, 얼마든";

  return (
    <div className="space-y-4">
      <section aria-labelledby="ride-title">
        <h2 id="ride-title" className="font-label text-[19px]">
          오늘은 어떤 놀이기구?
        </h2>
        <div className="mt-2 grid grid-cols-4 gap-1.5 sm:gap-2">
          {RIDES.map((ride) => {
            const active = r.filters.mood === ride.mood;
            return (
              <button
                key={ride.mood}
                type="button"
                aria-pressed={active}
                onClick={() => r.setFilter("mood", active ? null : ride.mood)}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-[10px] border-2 border-ink px-1 py-2 transition",
                  active ? "bg-primary-strong shadow-[0_3px_0_var(--color-ink)]" : "bg-primary-light hover:bg-surface",
                )}
              >
                <span className="font-label text-[15px] leading-tight tracking-tight sm:text-[18px]">{ride.ride}</span>
                <span className={cn("text-[11px] sm:text-xs", active && "font-bold")}>{ride.feel}</span>
              </button>
            );
          })}
        </div>
      </section>

      <OptionsDrawer title="탑승 옵션" summary={optionSummary}>
        <ChipGroup
          label="누구와 함께하나요?"
          options={COMPANION_OPTIONS}
          value={r.filters.companion}
          onChange={(v) => r.setFilter("companion", v)}
        />
        <ChipGroup
          label="쓸 수 있는 시간"
          options={TIME_OPTIONS}
          value={r.filters.time}
          onChange={(v) => r.setFilter("time", v)}
        />
        <ChipGroup
          label="예산 (1인 기준)"
          options={BUDGET_OPTIONS}
          value={r.filters.budget}
          onChange={(v) => r.setFilter("budget", v)}
        />
        {r.hasFilters && (
          <button type="button" className="btn-ghost min-h-11 px-4 text-sm" onClick={r.resetFilters}>
            옵션 초기화
          </button>
        )}
      </OptionsDrawer>

      <div ref={resultRef} aria-live="polite" className="scroll-mt-20">
        {r.status === "result" && activity ? (
          <motion.article
            key={`${activity.id}-${r.round}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            aria-label="오늘의 자유이용권"
            className="ticket rounded-card border-[3px] border-ink bg-surface [--notch-y:calc(100%_-_172px)]"
          >
            <div className="sign-band flex items-center justify-between border-b-[3px] bg-primary-strong! px-5 py-2.5">
              <span className="font-sign text-[19px]">{r.fromShare ? "친구가 보낸 자유이용권" : "1일 자유이용권"}</span>
              <span className="font-label text-[15px]">{activity.moods[0] ? RIDE_OF[activity.moods[0]] : "오늘 하루"}급</span>
            </div>
            <div className="px-5 pb-4 pt-4">
              <p className="font-label text-[16px] text-primary-deep">오늘 탈 놀이기구</p>
              <h2 className="font-sign text-[34px] font-normal leading-tight">
                {activity.name}
                {activity.sponsored && (
                  <span className="ml-2 rounded-full bg-ink px-2 py-0.5 align-middle font-sans text-[11px] font-semibold text-white">
                    광고
                  </span>
                )}
              </h2>
              <p className="mt-1 text-[15px] leading-relaxed">
                {activity.description}. {activity.reason}
              </p>
            </div>
            <div className="mx-5 border-t-[3px] border-dashed border-ink" />
            <dl className="grid grid-cols-3 gap-2 px-5 py-4">
              <div>
                <dt className="text-xs text-muted">탑승 시간</dt>
                <dd className="font-label text-[18px] leading-tight">{activity.timeLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">요금</dt>
                <dd className="font-label text-[18px] leading-tight">{activity.costLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">동행</dt>
                <dd className="font-label text-[18px] leading-tight">
                  {activity.companions.map((c) => COMPANION_LABEL[c]).join(", ")}
                </dd>
              </div>
            </dl>
            <div className="grid grid-cols-3 gap-2 px-5 pb-5">
              <button type="button" className="btn-secondary min-h-11 px-2 text-sm" onClick={run}>
                <RotateCcw className="size-4" aria-hidden />
                다른 거
              </button>
              <SaveButton type="activity" id={activity.id} className="min-h-11 px-2 text-sm" />
              <ShareButton
                className="min-h-11 px-2 text-sm"
                title="오늘.zip - 오늘 뭐 하지?"
                text={`오늘은 ${activity.name} ${activity.emoji} 어때?`}
                path={`/activity?id=${activity.id}`}
              />
            </div>
            <p className="px-5 pb-4 text-center text-xs text-muted">시간과 요금은 대략적인 예시 추정치예요.</p>
          </motion.article>
        ) : r.status === "empty" ? (
          <ResultEmpty
            noun="활동이"
            relaxLabel={r.relax?.label ?? null}
            onRelax={r.relaxAndRetry}
            onReset={r.resetFilters}
          />
        ) : (
          <p className="rounded-card border-[3px] border-dashed border-ink/50 px-4 py-6 text-center font-label text-[18px]">
            아직 발권 전이에요. 놀이기구를 고르거나 바로 아무거나 타기를 눌러보세요.
          </p>
        )}
      </div>

      {others.length > 0 && rideMood && (
        <section aria-labelledby="others-title">
          <h2 id="others-title" className="font-label text-[19px]">
            {RIDE_OF[rideMood]}급 다른 놀거리
          </h2>
          <ul className="mt-2 grid grid-cols-3 gap-2">
            {others.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => {
                    r.show(a);
                    scrollToResult(resultRef.current);
                  }}
                  className="flex h-full w-full flex-col items-start rounded-[10px] border-[3px] border-ink bg-primary-light px-3 py-2.5 text-left hover:bg-surface"
                >
                  <span className="text-[14px] font-black leading-snug">{a.name}</span>
                  <span className="mt-0.5 text-[11px] text-muted">{a.costLabel}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <StickyAction>
        <button type="button" className="btn-primary w-full text-[22px]" onClick={run}>
          {r.status === "result" ? "다른 놀이기구 타기" : "아무거나 타기"}
        </button>
      </StickyAction>
    </div>
  );
}
