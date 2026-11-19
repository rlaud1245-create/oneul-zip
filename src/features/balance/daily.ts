import { balanceQuestions } from "@/data/balance";
import { addDays, dayIndex } from "@/lib/kst";
import { seededShuffle } from "@/lib/random";
import type { BalanceQuestion } from "@/types";

/**
 * 날짜별 질문 배정
 * 질문 목록을 고정 시드로 한 번 섞은 뒤, 기준일부터 하루에 하나씩 순서대로 보여줍니다.
 * → 질문 개수만큼의 기간 동안 같은 질문이 반복되지 않습니다.
 * (질문을 추가하면 섞인 순서가 바뀌니, 추가는 몰아서 하는 것을 권장합니다)
 */
const START_DATE = "2026-11-12";
const ORDER_SEED = 20261112;

const order = seededShuffle(balanceQuestions, ORDER_SEED);

export function questionForDate(dateKey: string): BalanceQuestion {
  const n = order.length;
  const offset = dayIndex(dateKey) - dayIndex(START_DATE);
  return order[((offset % n) + n) % n];
}

/** 오늘 이전 N일의 날짜 (최신순) */
export function previousDates(today: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => addDays(today, -(i + 1)));
}
