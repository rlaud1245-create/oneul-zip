import { kstDateKey } from "@/lib/kst";
import { STORAGE_KEYS, parseJSON, readRaw, writeJSON } from "@/lib/storage";
import type { ShopTheme } from "@/lib/shops";

/**
 * 단골 도장판
 * - 하루에 한 번, 아무 가게나 실제로 이용하면(메뉴 뽑기, 뽑기판 뜯기, 부적 받기, 축제 고르기) 도장이 하나 찍힙니다.
 * - 도장 색은 그날 처음 들른 가게 색입니다.
 * - 모든 기록은 이 기기의 브라우저(localStorage)에만 저장합니다.
 */

export type StampShop = Exclude<ShopTheme, "town">;

export interface Stamp {
  /** YYYY-MM-DD (한국 시간) */
  d: string;
  s: StampShop;
}

export interface StampData {
  list: Stamp[];
  /** 오늘 들른 가게들 (도장은 하루 하나지만, 들른 곳은 따로 기억해서 안 가본 가게를 추천합니다) */
  today: { d: string; shops: StampShop[] };
}

export const EMPTY_STAMPS: StampData = { list: [], today: { d: "", shops: [] } };
export const BOARD_SIZE = 30;
export const STAMPED_EVENT = "oneul-stamped";

export const STAMP_STYLE: Record<StampShop, { color: string; char: string; name: string; path: string }> = {
  bunsik: { color: "#C8412E", char: "먹", name: "분식", path: "/food" },
  land: { color: "#2C5459", char: "놀", name: "랜드", path: "/activity" },
  stationery: { color: "#9A5A12", char: "뽑", name: "문방구", path: "/balance" },
  fortune: { color: "#2F3B5E", char: "운", name: "철학관", path: "/fortune" },
  festival: { color: "#2F5A2A", char: "축", name: "게시판", path: "/festival" },
};

export interface Reward {
  at: number;
  title: string;
  description: string;
}

/** 한 판(30칸) 안에서 받는 보상 */
export const REWARDS: Reward[] = [
  { at: 7, title: "단골 손님 명찰", description: "일주일 들르면 상가에서 알아봐요" },
  { at: 15, title: "우수 단골 명찰", description: "반 판 채우면 명찰이 바뀌어요" },
  { at: 30, title: "황금 부적", description: "철학관 부적이 금색으로 바뀌어요" },
];

export interface StampedDetail {
  total: number;
  inBoard: number;
  shop: StampShop;
  reward: Reward | null;
}

function load(): StampData {
  const data = parseJSON<StampData>(readRaw(STORAGE_KEYS.stamps), EMPTY_STAMPS);
  return Array.isArray(data?.list) && data.today ? data : EMPTY_STAMPS;
}

/** 현재 판에 찍힌 도장 수 (30개를 다 채운 날은 30, 다음 도장부터 새 판) */
export function boardCount(total: number): number {
  return total === 0 ? 0 : ((total - 1) % BOARD_SIZE) + 1;
}

/** 지금 판의 도장들 */
export function currentBoard(list: Stamp[]): Stamp[] {
  return list.length === 0 ? [] : list.slice(Math.floor((list.length - 1) / BOARD_SIZE) * BOARD_SIZE);
}

/** 오늘 또는 어제까지 이어진 연속 출석 일수 */
export function streakOf(list: Stamp[], today: string): number {
  if (!list.length) return 0;
  const days = new Set(list.map((s) => s.d));
  const step = (dateKey: string, delta: number) => {
    const t = Date.parse(`${dateKey}T00:00:00Z`) + delta * 86_400_000;
    return new Date(t).toISOString().slice(0, 10);
  };
  let cursor = days.has(today) ? today : step(today, -1);
  let count = 0;
  while (days.has(cursor)) {
    count++;
    cursor = step(cursor, -1);
  }
  return count;
}

/** 30칸을 한 번이라도 다 채웠는지 (황금 부적) */
export function hasGoldTalisman(list: Stamp[]): boolean {
  return list.length >= BOARD_SIZE;
}

/** 가게를 이용했을 때 부릅니다. 오늘 첫 도장이면 도장을 찍고 알림 이벤트를 보냅니다. */
export function recordStamp(shop: StampShop): void {
  if (typeof window === "undefined") return;
  const today = kstDateKey();
  const data = load();
  const visited = data.today.d === today ? data.today.shops : [];
  const stampedToday = data.list.some((s) => s.d === today);

  if (stampedToday && visited.includes(shop)) return;

  const list = stampedToday ? data.list : [...data.list, { d: today, s: shop }];
  writeJSON(STORAGE_KEYS.stamps, {
    list,
    today: { d: today, shops: visited.includes(shop) ? visited : [...visited, shop] },
  } satisfies StampData);

  if (!stampedToday) {
    const inBoard = boardCount(list.length);
    const detail: StampedDetail = {
      total: list.length,
      inBoard,
      shop,
      reward: REWARDS.find((r) => r.at === inBoard) ?? null,
    };
    window.dispatchEvent(new CustomEvent(STAMPED_EVENT, { detail }));
  }
}
