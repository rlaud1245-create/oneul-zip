"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { ChipGroup } from "@/components/ChipGroup";
import { ResultEmpty } from "@/components/ResultCard";
import { SaveButton } from "@/components/SaveButton";
import { ShareButton } from "@/components/ShareButton";
import { HandCircle, OptionsDrawer, StickyAction } from "@/components/ShopParts";
import { foods, findFood } from "@/data/foods";
import { useRecommender } from "@/hooks/useRecommender";
import { cn } from "@/lib/cn";
import { FOOD_CATEGORY_LABEL, MEAL_SITUATION_LABEL, PRICE_LABEL, toOptions } from "@/lib/labels";
import type { Condition } from "@/lib/recommend";
import { scrollToResult } from "@/lib/scroll";
import { STORAGE_KEYS } from "@/lib/storage";
import type { Companion, Food, FoodCategory, PriceRange } from "@/types";
import { ServePlate, serveDuration } from "./ServePlate";

type FoodFilters = {
  category: FoodCategory | null;
  situation: Companion | null;
  price: PriceRange | null;
};

const EMPTY_FILTERS: FoodFilters = { category: null, situation: null, price: null };

const CATEGORY_TABS: { value: FoodCategory | null; label: string }[] = [
  { value: null, label: "전체" },
  ...toOptions(FOOD_CATEGORY_LABEL).map((o) => ({
    value: o.value as FoodCategory | null,
    label: o.label === "아시아 음식" ? "아시아" : o.label,
  })),
];
const SITUATION_OPTIONS = toOptions(MEAL_SITUATION_LABEL);
const PRICE_OPTIONS = toOptions(PRICE_LABEL);

/** 메뉴판 가격 자리에 쓰는 짧은 표기 */
const PRICE_TAG: Record<PriceRange, string> = { low: "~1만", mid: "1~2만", high: "2만~" };

/** 처음에 메뉴판에 보여줄 줄 수 */
const BOARD_ROWS = 8;

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

/**
 * 오늘 뭐 먹지: 분식집 메뉴판
 * 음식 종류 탭 → 메뉴판(추천 메뉴에 빨간 동그라미) → 사장님 추천 쪽지 → 주방장 맘대로 버튼
 */
export function FoodPicker({ initialId }: { initialId?: string }) {
  const resultRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  /** 주방장 손 연출: 처음 맘대로는 길게, 다음부터는 짧게, 메뉴판에서 직접 고르면 손 없이 */
  const [serve, setServe] = useState<"full" | "quick" | "none">("none");
  const r = useRecommender({
    items: foods,
    emptyFilters: EMPTY_FILTERS,
    buildConditions,
    recentKey: STORAGE_KEYS.recentFood,
    path: "/food",
    initialItem: initialId ? (findFood(initialId) ?? null) : null,
  });

  const run = () => {
    setServe(r.status === "result" ? "quick" : "full");
    r.recommend();
    scrollToResult(resultRef.current);
  };

  const food = r.result;
  const conditions = buildConditions(r.filters);
  const matches = foods.filter((f) => conditions.every((c) => c.test(f)));
  let rows = expanded ? matches : matches.slice(0, BOARD_ROWS);
  if (food && !rows.some((f) => f.id === food.id) && matches.some((f) => f.id === food.id)) {
    rows = [food, ...rows.slice(0, BOARD_ROWS - 1)];
  }
  const hidden = matches.length - rows.length;

  const optionSummary =
    [r.filters.situation && MEAL_SITUATION_LABEL[r.filters.situation], r.filters.price && PRICE_LABEL[r.filters.price]]
      .filter(Boolean)
      .join(", ") || "누구랑, 얼마든";

  const setCategory = (value: FoodCategory | null) => {
    r.setFilter("category", value);
    setExpanded(false);
  };

  return (
    <div className="space-y-4">
      <nav aria-label="음식 종류" className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max gap-1.5">
          {CATEGORY_TABS.map((tab) => {
            const active = r.filters.category === tab.value;
            return (
              <li key={tab.label}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(tab.value)}
                  className={cn(
                    "min-h-11 rounded-md border-2 border-ink px-4 font-label text-[17px] transition",
                    active ? "bg-ink text-sign" : "bg-surface hover:bg-primary-light",
                  )}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <section
        aria-label={`${r.filters.category ? FOOD_CATEGORY_LABEL[r.filters.category] : "전체"} 메뉴판`}
        className="rounded-card border-4 border-ink bg-primary-light px-4 py-3 shadow-[5px_5px_0_var(--shop-accent)] sm:px-5"
      >
        {matches.length === 0 ? (
          <p className="py-6 text-center font-label text-[18px]">이 조건엔 메뉴가 없어요. 주문 옵션을 바꿔보세요.</p>
        ) : (
          <ul>
            {rows.map((item) => {
              const picked = food?.id === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setServe("none");
                      r.show(item);
                      scrollToResult(resultRef.current);
                    }}
                    aria-current={picked ? "true" : undefined}
                    className="flex min-h-12 w-full items-baseline py-2 text-left text-[18px] font-bold hover:text-primary-deep"
                  >
                    {picked ? <HandCircle className="font-black">{item.name}</HandCircle> : <span>{item.name}</span>}
                    <span className="menu-leader" aria-hidden />
                    <span className="shrink-0 font-label text-[17px] font-normal">{PRICE_TAG[item.price]}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-1 min-h-11 w-full border-t-2 border-dashed border-ink/40 pt-2 font-label text-[16px] hover:text-primary-deep"
          >
            메뉴 {hidden}개 더 보기
          </button>
        )}
      </section>

      <OptionsDrawer title="주문 옵션" summary={optionSummary}>
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
        {r.hasFilters && (
          <button type="button" className="btn-ghost min-h-11 px-4 text-sm" onClick={r.resetFilters}>
            옵션 초기화
          </button>
        )}
      </OptionsDrawer>

      <div ref={resultRef} aria-live="polite" className="scroll-mt-20">
        {r.status === "result" && food ? (
          <div key={`${food.id}-${r.round}`}>
          <ServePlate emoji={food.emoji} name={food.name} serve={serve} />
          <motion.article
            initial={{ opacity: 0, y: 8, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ duration: 0.22, delay: serveDuration(serve) * 0.5 }}
            className="rounded-card border-[3px] border-ink bg-ink px-5 py-4 text-[#FFF8E6]"
          >
            <p className="font-label text-[16px] text-sign">{r.fromShare ? "친구가 보낸 메뉴" : "사장님 추천"}</p>
            <h2 className="mt-0.5 font-sign text-[26px] font-normal leading-tight">
              오늘은 {food.name} 드세요
              {food.sponsored && (
                <span className="ml-2 rounded-full bg-[#FFF8E6] px-2 py-0.5 align-middle font-sans text-[11px] font-semibold text-ink">
                  광고
                </span>
              )}
            </h2>
            <p className="mt-1 text-[15px] leading-relaxed">{food.reason}</p>
            <p className="mt-1 font-label text-[15px] text-[#E8D9B5]">
              {FOOD_CATEGORY_LABEL[food.category]}, {PRICE_LABEL[food.price]}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-ink">
              <button type="button" className="btn-secondary min-h-11 px-2 text-sm" onClick={run}>
                <RotateCcw className="size-4" aria-hidden />
                다른 거
              </button>
              <SaveButton type="food" id={food.id} className="min-h-11 px-2 text-sm" />
              <ShareButton
                className="min-h-11 px-2 text-sm"
                title="오늘.zip - 오늘 뭐 먹지?"
                text={`오늘 메뉴는 ${food.name} ${food.emoji} 어때?`}
                path={`/food?id=${food.id}`}
              />
            </div>
          </motion.article>
          </div>
        ) : r.status === "empty" ? (
          <ResultEmpty
            noun="메뉴가"
            relaxLabel={r.relax?.label ?? null}
            onRelax={r.relaxAndRetry}
            onReset={r.resetFilters}
          />
        ) : (
          <p className="rounded-card border-[3px] border-dashed border-ink/50 px-4 py-4 text-center font-label text-[18px]">
            고르기 어렵다면 주방장 맘대로를 눌러보세요. 메뉴판에서 직접 골라도 돼요.
          </p>
        )}
      </div>

      <StickyAction>
        <button type="button" className="btn-primary w-full text-[22px]" onClick={run}>
          {r.status === "result" ? "주방장 맘대로 한 번 더" : "주방장 맘대로"}
        </button>
      </StickyAction>
    </div>
  );
}
