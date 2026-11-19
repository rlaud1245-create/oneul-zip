import type { BalanceCategory, Budget, Companion, FoodCategory, Mood, PriceRange, TimeSlot } from "@/types";

export const FOOD_CATEGORY_LABEL: Record<FoodCategory, string> = {
  korean: "한식",
  western: "양식",
  japanese: "일식",
  chinese: "중식",
  snack: "분식",
  asian: "아시아 음식",
};

export const PRICE_LABEL: Record<PriceRange, string> = {
  low: "1만 원 이하",
  mid: "1만~2만 원",
  high: "2만 원 이상",
};

export const MEAL_SITUATION_LABEL: Record<Companion, string> = {
  solo: "혼밥",
  friends: "친구와 식사",
  date: "연인과 식사",
  family: "가족 식사",
};

export const COMPANION_LABEL: Record<Companion, string> = {
  solo: "혼자",
  friends: "친구",
  date: "연인",
  family: "가족",
};

export const MOOD_LABEL: Record<Mood, string> = {
  bored: "심심해",
  rest: "쉬고 싶어",
  active: "활동하고 싶어",
  refresh: "기분 전환하고 싶어",
};

export const TIME_LABEL: Record<TimeSlot, string> = {
  "30m": "30분 이내",
  "2h": "1~2시간",
  "4h": "3~4시간",
  day: "하루 종일",
};

export const BUDGET_LABEL: Record<Budget, string> = {
  free: "무료",
  "10k": "1만 원 이하",
  "30k": "3만 원 이하",
  "30k+": "3만 원 이상",
};

export const TIME_ORDER: readonly TimeSlot[] = ["30m", "2h", "4h", "day"];
export const BUDGET_ORDER: readonly Budget[] = ["free", "10k", "30k", "30k+"];

export const BALANCE_CATEGORY_LABEL: Record<BalanceCategory, string> = {
  food: "음식",
  love: "연애",
  daily: "일상",
  taste: "취향",
  travel: "여행",
  fun: "재미",
};

/** Record → ChipGroup 옵션 배열 */
export function toOptions<V extends string>(labels: Record<V, string>): { value: V; label: string }[] {
  return (Object.keys(labels) as V[]).map((value) => ({ value, label: labels[value] }));
}
