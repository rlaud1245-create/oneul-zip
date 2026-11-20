/** localStorage 키 모음. 모든 데이터는 사용자 기기에만 저장됩니다. */
export const STORAGE_KEYS = {
  recentFood: "oneul:recent:food",
  recentActivity: "oneul:recent:activity",
  saved: "oneul:saved",
  votes: "oneul:votes",
  zodiac: "oneul:zodiac",
  stamps: "oneul:stamps",
} as const;

export const STORAGE_EVENT = "oneul-storage";

export function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function parseJSON<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 공간 부족, 시크릿 모드 등: 조용히 무시하고 메모리 상태로만 동작
  }
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: key }));
}
