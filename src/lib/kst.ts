/**
 * 한국 시간(Asia/Seoul) 기준 날짜 유틸.
 * 날짜는 항상 "YYYY-MM-DD" 문자열(dateKey)로 다룹니다.
 * 서버에서 계산한 dateKey를 클라이언트에 props로 넘기므로 서버/클라이언트 날짜가 어긋나지 않습니다.
 */

const DAY_MS = 86_400_000;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const kstFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** 현재(또는 주어진 시각)의 한국 날짜 → "YYYY-MM-DD" */
export function kstDateKey(date: Date = new Date()): string {
  return kstFormatter.format(date);
}

/** dateKey → 1970-01-01부터 며칠째인지 */
export function dayIndex(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
}

export function addDays(dateKey: string, days: number): string {
  return new Date((dayIndex(dateKey) + days) * DAY_MS).toISOString().slice(0, 10);
}

export function isDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  return !Number.isNaN(time) && new Date(time).toISOString().slice(0, 10) === value;
}

/** "11월 12일 목요일" 또는 "11월 12일" */
export function formatKoreanDate(dateKey: string, withWeekday = true): string {
  const [, m, d] = dateKey.split("-").map(Number);
  if (!withWeekday) return `${m}월 ${d}일`;
  const weekday = WEEKDAYS[new Date(dayIndex(dateKey) * DAY_MS).getUTCDay()];
  return `${m}월 ${d}일 ${weekday}요일`;
}
