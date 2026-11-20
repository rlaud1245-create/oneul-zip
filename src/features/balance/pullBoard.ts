import { hashString, seededShuffle } from "@/lib/random";
import type { Choice } from "@/types";

/** 뽑기판 칸 수와 미리 뜯겨 있는 꽝 칸 수 */
export const BOARD_SIZE = 30;
export const DUD_COUNT = 18;

export interface PullBoard {
  /** 칸마다 나오는 쪽. null이면 이미 뜯긴 꽝 칸 */
  sides: (Choice | null)[];
  dudCount: number;
  liveCount: number;
}

/**
 * 날짜별 뽑기판
 * 같은 날짜면 누구에게나 같은 판(꽝 위치, A/B 배치)이 나오고, 날짜가 바뀌면 판 모양도 바뀝니다.
 * 남은 칸에는 A와 B가 반반씩 들어갑니다.
 */
export function buildPullBoard(dateKey: string): PullBoard {
  const seed = hashString(`pull:${dateKey}`);
  const order = seededShuffle(
    Array.from({ length: BOARD_SIZE }, (_, i) => i),
    seed,
  );
  const duds = new Set(order.slice(0, DUD_COUNT));
  const live = order.slice(DUD_COUNT);
  const liveSides = seededShuffle(
    live.map((_, i): Choice => (i % 2 === 0 ? "a" : "b")),
    seed ^ 0x9e3779b9,
  );

  const sides: (Choice | null)[] = Array.from({ length: BOARD_SIZE }, () => null);
  live.forEach((cell, i) => {
    sides[cell] = liveSides[i];
  });
  for (const cell of duds) sides[cell] = null;

  return { sides, dudCount: DUD_COUNT, liveCount: BOARD_SIZE - DUD_COUNT };
}
