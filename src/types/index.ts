/** 함께하는 사람 (식사 상황, 활동 동행 공통) */
export type Companion = "solo" | "friends" | "date" | "family";

/** 스폰서(협찬) 콘텐츠 표시용. 값이 있으면 결과 카드에 '광고' 표시가 붙습니다. */
export interface Sponsored {
  label: string;
  url: string;
}

/* ───────── 오늘 뭐 먹지 ───────── */

export type FoodCategory = "korean" | "western" | "japanese" | "chinese" | "snack" | "asian";
export type PriceRange = "low" | "mid" | "high";

export interface Food {
  id: string;
  name: string;
  emoji: string;
  category: FoodCategory;
  price: PriceRange;
  situations: Companion[];
  reason: string;
  sponsored?: Sponsored;
}

/* ───────── 오늘 뭐 하지 ───────── */

export type Mood = "bored" | "rest" | "active" | "refresh";
/** 30분 이내 / 1~2시간 / 3~4시간 / 하루 종일 */
export type TimeSlot = "30m" | "2h" | "4h" | "day";
/** 무료 / 1만 원 이하 / 3만 원 이하 / 3만 원 이상 */
export type Budget = "free" | "10k" | "30k" | "30k+";

export interface Activity {
  id: string;
  name: string;
  emoji: string;
  description: string;
  reason: string;
  companions: Companion[];
  moods: Mood[];
  /** 활동에 필요한 대략적인 시간 구간 */
  time: TimeSlot;
  /** 활동에 드는 대략적인 비용 구간 */
  cost: Budget;
  timeLabel: string;
  costLabel: string;
  sponsored?: Sponsored;
}

/* ───────── 오늘의 선택 ───────── */

export type BalanceCategory = "food" | "love" | "daily" | "taste" | "travel" | "fun";

export interface BalanceQuestion {
  id: string;
  category: BalanceCategory;
  a: string;
  b: string;
}

export type Choice = "a" | "b";

/* ───────── 저장 ───────── */

export type SavedType = "food" | "activity";

export interface SavedItem {
  type: SavedType;
  id: string;
  savedAt: number;
}
