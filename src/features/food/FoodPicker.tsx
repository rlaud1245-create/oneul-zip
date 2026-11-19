"use client";

import { useRef } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { ChipGroup } from "@/components/ChipGroup";
import { ResultCard, ResultEmpty, ResultPlaceholder } from "@/components/ResultCard";
import { SaveButton } from "@/components/SaveButton";
import { ShareButton } from "@/components/ShareButton";
import { foods, findFood } from "@/data/foods";
import { useRecommender } from "@/hooks/useRecommender";
import { FOOD_CATEGORY_LABEL, MEAL_SITUATION_LABEL, PRICE_LABEL, toOptions } from "@/lib/labels";
import type { Condition } from "@/lib/recommend";
import { scrollToResult } from "@/lib/scroll";
import { STORAGE_KEYS } from "@/lib/storage";
import type { Companion, Food, FoodCategory, PriceRange } from "@/types";

type FoodFilters = {
  category: FoodCategory | null;
  situation: Companion | null;
  price: PriceRange | null;
};

const EMPTY_FILTERS: FoodFilters = { category: null, situation: null, price: null };

const CATEGORY_OPTIONS = toOptions(FOOD_CATEGORY_LABEL);
const SITUATION_OPTIONS = toOptions(MEAL_SITUATION_LABEL);
const PRICE_OPTIONS = toOptions(PRICE_LABEL);

/** 완화 우선순위: 가격대 → 상황 → 음식 종류 */
function buildConditions(f: FoodFilters): Condition<Food>[] {
  const conditions: Condition<Food>[] = [];
  if (f.price) {
    const price = f.price;
    conditions.push({ key: "price", label: `가격대(${PRICE_LABEL[price]})`, test: (food) => food.price === price });
  }
  if (f.situation) {
    const situation = f.situation;
    conditions.push({
      key: "situation",
      label: `상황(${MEAL_SITUATION_LABEL[situation]})`,
      test: (food) => food.situations.includes(situation),
    });
  }
  if (f.category) {
    const category = f.category;
    conditions.push({
      key: "category",
      label: `식사 유형(${FOOD_CATEGORY_LABEL[category]})`,
      test: (food) => food.category === category,
    });
  }
  return conditions;
}

export function FoodPicker({ initialId }: { initialId?: string }) {
  const resultRef = useRef<HTMLDivElement>(null);
  const r = useRecommender({
    items: foods,
    emptyFilters: EMPTY_FILTERS,
    buildConditions,
    recentKey: STORAGE_KEYS.recentFood,
    path: "/food",
    initialItem: initialId ? (findFood(initialId) ?? null) : null,
  });

  const run = () => {
    r.recommend();
    scrollToResult(resultRef.current);
  };

  const food = r.result;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.05fr] lg:items-start">
      <section aria-label="추천 조건" className="card space-y-6 p-5 sm:p-6">
        <ChipGroup
          label="어떤 음식이 끌려요?"
          anyLabel="전체"
          options={CATEGORY_OPTIONS}
          value={r.filters.category}
          onChange={(v) => r.setFilter("category", v)}
        />
        <ChipGroup
          label="누구와 먹나요?"
          options={SITUATION_OPTIONS}
          value={r.filters.situation}
          onChange={(v) => r.setFilter("situation", v)}
        />
        <ChipGroup
          label="가격대 (1인 기준)"
          options={PRICE_OPTIONS}
          value={r.filters.price}
          onChange={(v) => r.setFilter("price", v)}
        />
        <div className="flex gap-2 pt-1">
          <button type="button" className="btn-primary flex-1" onClick={run}>
            <Sparkles className="size-4" aria-hidden />
            {r.status === "result" ? "다른 메뉴 추천" : "메뉴 추천받기"}
          </button>
          {r.hasFilters && (
            <button type="button" className="btn-ghost px-4" onClick={r.resetFilters}>
              초기화
            </button>
          )}
        </div>
      </section>

      <div ref={resultRef} aria-live="polite" className="scroll-mt-20">
        {r.status === "result" && food ? (
          <ResultCard
            animationKey={`${food.id}-${r.round}`}
            eyebrow={r.fromShare ? "공유받은 추천 메뉴" : "오늘의 추천은?"}
            emoji={food.emoji}
            title={food.name}
            tags={[FOOD_CATEGORY_LABEL[food.category], PRICE_LABEL[food.price]]}
            quote={food.reason}
            sponsored={Boolean(food.sponsored)}
            actions={
              <>
                <button type="button" className="btn-secondary px-2 text-sm" onClick={run}>
                  <RotateCcw className="size-4" aria-hidden />
                  다시 추천
                </button>
                <SaveButton type="food" id={food.id} className="px-2 text-sm" />
                <ShareButton
                  className="px-2 text-sm"
                  title="오늘.zip - 오늘 뭐 먹지?"
                  text={`오늘 메뉴는 ${food.name} ${food.emoji} 어때?`}
                  path={`/food?id=${food.id}`}
                />
              </>
            }
          />
        ) : r.status === "empty" ? (
          <ResultEmpty
            noun="메뉴가"
            relaxLabel={r.relax?.label ?? null}
            onRelax={r.relaxAndRetry}
            onReset={r.resetFilters}
          />
        ) : (
          <ResultPlaceholder text="조건을 고르고 추천 버튼을 눌러보세요. 아무것도 고르지 않아도 바로 추천해 드려요." />
        )}
      </div>
    </div>
  );
}
