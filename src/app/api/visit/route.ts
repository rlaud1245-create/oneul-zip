import { getCloudflareContext } from "@opennextjs/cloudflare";
import { addDays, kstDateKey } from "@/lib/kst";

/**
 * 오늘 손님 수 (하루 방문자 수)
 * - Cloudflare D1 데이터베이스(바인딩 이름 DB)에 "날짜 → 숫자"만 저장합니다. IP·기기 정보 등 개인정보는 저장하지 않아요.
 * - 같은 브라우저는 하루에 한 번만 POST 하도록 화면 쪽에서 막습니다.
 * - DB가 연결되지 않았으면 { ok: false }를 돌려주고, 화면에서는 계수기를 숨깁니다.
 */

export const dynamic = "force-dynamic";

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}
interface D1Like {
  prepare(query: string): D1Statement;
}

const NO_STORE = { "cache-control": "no-store" };
let tableReady = false;

/** 연결이 안 될 때 원인 (응답의 reason으로 확인용: "no-binding" 또는 오류 이름) */
let lastReason = "";

async function getDb(): Promise<D1Like | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as { DB?: D1Like }).DB;
    if (!db) {
      lastReason = "no-binding";
      return null;
    }
    if (!tableReady) {
      await db
        .prepare("CREATE TABLE IF NOT EXISTS daily_visits (day TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0)")
        .run();
      tableReady = true;
    }
    return db;
  } catch (error) {
    console.error("[visit]", error);
    lastReason = error instanceof Error ? `${error.name}: ${error.message}`.slice(0, 200) : "unknown";
    return null;
  }
}

async function countOf(db: D1Like, day: string): Promise<number> {
  const row = await db.prepare("SELECT count FROM daily_visits WHERE day = ?").bind(day).first<{ count: number }>();
  return row?.count ?? 0;
}

/** 오늘·어제 손님 수 조회 */
export async function GET() {
  const db = await getDb();
  if (!db) return Response.json({ ok: false, reason: lastReason }, { headers: NO_STORE });
  const today = kstDateKey();
  try {
    const [t, y] = await Promise.all([countOf(db, today), countOf(db, addDays(today, -1))]);
    return Response.json({ ok: true, today: t, yesterday: y }, { headers: NO_STORE });
  } catch (error) {
    console.error("[visit]", error);
    const reason = error instanceof Error ? `${error.name}: ${error.message}`.slice(0, 200) : "unknown";
    return Response.json({ ok: false, reason }, { headers: NO_STORE });
  }
}

/** 오늘 첫 방문이면 한 명 더하고 오늘·어제 손님 수를 돌려줍니다 */
export async function POST() {
  const db = await getDb();
  if (!db) return Response.json({ ok: false, reason: lastReason }, { headers: NO_STORE });
  const today = kstDateKey();
  try {
    const row = await db
      .prepare(
        "INSERT INTO daily_visits (day, count) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET count = count + 1 RETURNING count",
      )
      .bind(today)
      .first<{ count: number }>();
    const yesterday = await countOf(db, addDays(today, -1));
    return Response.json({ ok: true, today: row?.count ?? 1, yesterday }, { headers: NO_STORE });
  } catch (error) {
    console.error("[visit]", error);
    const reason = error instanceof Error ? `${error.name}: ${error.message}`.slice(0, 200) : "unknown";
    return Response.json({ ok: false, reason }, { headers: NO_STORE });
  }
}
