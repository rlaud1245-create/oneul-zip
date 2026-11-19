/** 문자열 → 32비트 해시 (FNV-1a) */
export function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** 시드 고정 난수 생성기 (mulberry32). 같은 시드면 서버/클라이언트 어디서든 같은 결과. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 날짜별로 고정된 항목 하나를 고릅니다. salt를 바꾸면 같은 날이라도 다른 목록끼리 독립적으로 뽑힙니다. */
export function pickDaily<T>(items: readonly T[], dateKey: string, salt: string): T {
  const rand = mulberry32(hashString(`${salt}:${dateKey}`));
  return items[Math.floor(rand() * items.length)];
}
