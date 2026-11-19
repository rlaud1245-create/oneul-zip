/**
 * 규칙 기반 추천 엔진 (데이터와 분리된 공용 로직)
 *
 * 1. 사용자가 고른 조건을 모두 만족하는 후보를 찾습니다.
 * 2. 최근에 추천한 항목은 가능한 한 제외합니다.
 * 3. 후보가 없으면 "어떤 조건 하나를 빼면 결과가 나오는지" 알려줍니다.
 */

export interface Condition<T> {
  key: string;
  /** 조건 완화 안내에 쓰이는 이름. 예: "가격대(1만 원 이하)" */
  label: string;
  test: (item: T) => boolean;
}

export interface RelaxHint {
  key: string;
  label: string;
}

export interface PickResult<T> {
  item: T | null;
  poolSize: number;
  relax: RelaxHint | null;
}

/**
 * @param conditions 완화 우선순위 순서로 넘겨주세요. 결과가 없을 때 앞쪽 조건부터 빼볼 것을 제안합니다.
 * @param recentIds 최근 추천 id (최신순)
 */
export function pick<T extends { id: string }>(
  items: readonly T[],
  conditions: readonly Condition<T>[],
  recentIds: readonly string[] = [],
  rand: () => number = Math.random,
): PickResult<T> {
  const pool = items.filter((item) => conditions.every((c) => c.test(item)));

  if (pool.length === 0) {
    for (const target of conditions) {
      const others = conditions.filter((c) => c !== target);
      if (items.some((item) => others.every((c) => c.test(item)))) {
        return { item: null, poolSize: 0, relax: { key: target.key, label: target.label } };
      }
    }
    return { item: null, poolSize: 0, relax: null };
  }

  // 최근 추천 전부 제외 → 안 되면 직전 추천만 제외 → 그래도 안 되면 전체
  let candidates = pool.filter((item) => !recentIds.includes(item.id));
  if (candidates.length === 0) candidates = pool.filter((item) => item.id !== recentIds[0]);
  if (candidates.length === 0) candidates = pool;

  return {
    item: candidates[Math.floor(rand() * candidates.length)],
    poolSize: pool.length,
    relax: null,
  };
}
