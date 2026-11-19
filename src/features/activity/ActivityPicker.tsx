"use client";

import { useRef } from "react";
import { Clock, RotateCcw, Sparkles, Wallet } from "lucide-react";
import { ChipGroup } from "@/components/ChipGroup";
import { ResultCard, ResultEmpty, ResultPlaceholder } from "@/components/ResultCard";
import { SaveButton } from "@/components/SaveButton";
import { ShareButton } from "@/components/ShareButton";
import { activities, findActivity } from "@/data/activities";
import { useRecommender } from "@/hooks/useRecommender";
import {
  BUDGET_LABEL,
  BUDGET_ORDER,
  COMPANION_LABEL,
  MOOD_LABEL,
  TIME_LABEL,
  TIME_ORDER,
  toOptions,
} from "@/lib/labels";
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

const COMPANION_OPTIONS = toOptions(COMPANION_LABEL);
const MOOD_OPTIONS = toOptions(MOOD_LABEL);
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

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.05fr] lg:items-start">
      <section aria-label="추천 조건" className="card space-y-6 p-5 sm:p-6">
        <ChipGroup
          label="누구와 함께하나요?"
          options={COMPANION_OPTIONS}
          value={r.filters.companion}
          onChange={(v) => r.setFilter("companion", v)}
        />
        <ChipGroup
          label="지금 기분은?"
          options={MOOD_OPTIONS}
          value={r.filters.mood}
          onChange={(v) => r.setFilter("mood", v)}
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
        <div className="flex gap-2 pt-1">
          <button type="button" className="btn-primary flex-1" onClick={run}>
            <Sparkles className="size-4" aria-hidden />
            {r.status === "result" ? "다른 활동 추천" : "할 일 추천받기"}
          </button>
          {r.hasFilters && (
            <button type="button" className="btn-ghost px-4" onClick={r.resetFilters}>
              초기화
            </button>
          )}
        </div>
      </section>

      <div ref={resultRef} aria-live="polite" className="scroll-mt-20">
        {r.status === "result" && activity ? (
          <ResultCard
            animationKey={`${activity.id}-${r.round}`}
            eyebrow={r.fromShare ? "공유받은 추천 활동" : "오늘은 이거 어때요?"}
            emoji={activity.emoji}
            title={activity.name}
            tags={[activity.description]}
            quote={activity.reason}
            sponsored={Boolean(activity.sponsored)}
            actions={
              <>
                <button type="button" className="btn-secondary px-2 text-sm" onClick={run}>
                  <RotateCcw className="size-4" aria-hidden />
                  다시 추천
                </button>
                <SaveButton type="activity" id={activity.id} className="px-2 text-sm" />
                <ShareButton
                  className="px-2 text-sm"
                  title="오늘.zip - 오늘 뭐 하지?"
                  text={`오늘은 ${activity.name} ${activity.emoji} 어때?`}
                  path={`/activity?id=${activity.id}`}
                />
              </>
            }
          >
            <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-2xl bg-canvas p-3">
                <dt className="flex items-center gap-1.5 text-muted">
                  <Clock className="size-4" aria-hidden />
                  예상 소요 시간
                </dt>
                <dd className="mt-1 font-semibold">{activity.timeLabel}</dd>
              </div>
              <div className="rounded-2xl bg-canvas p-3">
                <dt className="flex items-center gap-1.5 text-muted">
                  <Wallet className="size-4" aria-hidden />
                  예상 비용
                </dt>
                <dd className="mt-1 font-semibold">{activity.costLabel}</dd>
              </div>
            </dl>
            <p className="mt-2 text-center text-xs text-muted">* 시간과 비용은 대략적인 예시 추정치예요.</p>
          </ResultCard>
        ) : r.status === "empty" ? (
          <ResultEmpty
            noun="활동이"
            relaxLabel={r.relax?.label ?? null}
            onRelax={r.relaxAndRetry}
            onReset={r.resetFilters}
          />
        ) : (
          <ResultPlaceholder text="지금 상황을 골라주면 딱 맞는 할 일을 추천해 드려요. 바로 눌러도 괜찮아요." />
        )}
      </div>
    </div>
  );
}
