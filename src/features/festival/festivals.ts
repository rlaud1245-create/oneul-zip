import { addDays } from "@/lib/kst";

/**
 * 오늘의 축제: 한국관광공사 국문 관광정보 서비스(KorService2) 행사정보조회
 * - 인증키는 Cloudflare Secret(TOUR_API_KEY)에만 두고, 서버에서만 호출합니다.
 * - 결과는 6시간 동안 캐시해서 하루 호출 한도(개발계정 1,000건)를 넉넉하게 지킵니다.
 * - 방문자의 위치는 서버로 받지 않습니다. 거리 계산은 브라우저에서만 합니다.
 */

const ENDPOINT = "https://apis.data.go.kr/B551011/KorService2/searchFestival2";
const CACHE_SECONDS = 60 * 60 * 6;
const PAGE_SIZE = 500;
const MAX_PAGES = 4;

export interface Festival {
  id: string;
  title: string;
  /** 짧은 지역 이름. 예: "서울", "강원" */
  region: string;
  address: string;
  /** YYYY-MM-DD */
  start: string;
  end: string;
  tel: string;
  /** 위도, 경도 (없으면 null) */
  lat: number | null;
  lng: number | null;
  /** 대표 포스터 이미지 주소 (https, 없으면 null). 원본 그대로만 보여줍니다. */
  image: string | null;
}

export interface FestivalResult {
  ok: boolean;
  festivals: Festival[];
}

/** 주소 첫 단어 → 짧은 지역 이름 */
const REGION_OF: Record<string, string> = {
  서울특별시: "서울",
  서울: "서울",
  인천광역시: "인천",
  인천: "인천",
  경기도: "경기",
  경기: "경기",
  강원특별자치도: "강원",
  강원도: "강원",
  강원: "강원",
  대전광역시: "대전",
  대전: "대전",
  세종특별자치시: "세종",
  세종: "세종",
  충청북도: "충북",
  충북: "충북",
  충청남도: "충남",
  충남: "충남",
  광주광역시: "광주",
  광주: "광주",
  전북특별자치도: "전북",
  전라북도: "전북",
  전북: "전북",
  전라남도: "전남",
  전남: "전남",
  부산광역시: "부산",
  부산: "부산",
  대구광역시: "대구",
  대구: "대구",
  울산광역시: "울산",
  울산: "울산",
  경상북도: "경북",
  경북: "경북",
  경상남도: "경남",
  경남: "경남",
  제주특별자치도: "제주",
  제주도: "제주",
  제주: "제주",
};

/** "전남광주통합특별시"처럼 새로 합쳐진 시·도는 "통합특별시"를 떼고 그대로 씁니다. */
function regionOf(first: string, second = ""): string {
  if (REGION_OF[first]) return REGION_OF[first];
  // 전남광주통합특별시: 자치구(○○구)는 광주, 시·군은 전남으로 나눠서 예전 지역 이름으로 찾을 수 있게 합니다.
  if (first === "전남광주통합특별시") return second.endsWith("구") ? "광주" : "전남";
  const merged = first.match(/^(.+)통합특별시$/);
  return merged ? merged[1] : "기타";
}

function toDateKey(yyyymmdd: unknown): string | null {
  const s = String(yyyymmdd ?? "");
  return /^\d{8}$/.test(s) ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}` : null;
}

function toNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n !== 0 ? n : null;
}

interface RawItem {
  contentid?: string | number;
  title?: string;
  addr1?: string;
  addr2?: string;
  tel?: string;
  eventstartdate?: string | number;
  eventenddate?: string | number;
  mapx?: string | number;
  mapy?: string | number;
  progresstype?: string;
  firstimage?: string;
}

function toImage(value: unknown): string | null {
  const url = String(value ?? "").trim();
  if (!/^https?:\/\//.test(url)) return null;
  // https 사이트에서 막히지 않도록 http 주소는 https로 바꿔 불러옵니다.
  return url.replace(/^http:\/\//, "https://");
}

function normalize(item: RawItem): Festival | null {
  const start = toDateKey(item.eventstartdate);
  const end = toDateKey(item.eventenddate);
  const title = String(item.title ?? "").trim();
  if (!start || !end || !title) return null;
  if (String(item.progresstype ?? "").includes("취소")) return null;
  const address = [item.addr1, item.addr2].filter(Boolean).join(" ").trim();
  const [first = "", second = ""] = address.split(/\s+/);
  return {
    id: String(item.contentid ?? title),
    title,
    region: regionOf(first, second),
    address,
    start,
    end,
    tel: String(item.tel ?? "").replace(/<[^>]*>/g, "").trim(),
    lat: toNumber(item.mapy),
    lng: toNumber(item.mapx),
    image: toImage(item.firstimage),
  };
}

function serviceKey(): string | null {
  const key = process.env.TOUR_API_KEY?.trim();
  if (!key) return null;
  // 일반 인증키(Decoding)는 인코딩해서 보내고, 이미 인코딩된 키(Encoding)는 그대로 씁니다.
  return key.includes("%") ? key : encodeURIComponent(key);
}

async function fetchPage(key: string, fromDate: string, page: number) {
  const url =
    `${ENDPOINT}?serviceKey=${key}&MobileOS=WEB&MobileApp=oneulzip&_type=json&arrange=A` +
    `&numOfRows=${PAGE_SIZE}&pageNo=${page}&eventStartDate=${fromDate.replaceAll("-", "")}`;
  const res = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`TourAPI HTTP ${res.status}`);
  const json = (await res.json()) as {
    response?: { header?: { resultCode?: string }; body?: { totalCount?: number; items?: { item?: RawItem | RawItem[] } | "" } };
  };
  const code = json.response?.header?.resultCode;
  if (code && code !== "0000") throw new Error(`TourAPI ${code}`);
  const body = json.response?.body;
  const raw = body && typeof body.items === "object" ? body.items.item : undefined;
  const items = raw ? (Array.isArray(raw) ? raw : [raw]) : [];
  return { items, total: Number(body?.totalCount ?? 0) };
}

/** 관광공사에서 진행 중이거나 곧 열릴 축제를 가져와 오늘 열리는 것만 남깁니다. */
async function loadFromApi(today: string): Promise<FestivalResult> {
  const key = serviceKey();
  if (!key) return { ok: false, festivals: [] };

  // 오래 이어지는 축제도 잡히도록 시작일 기준을 넉넉하게 잡고, 아래에서 오늘 날짜로 다시 거릅니다.
  const fromDate = addDays(today, -120);
  const all: Festival[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const { items, total } = await fetchPage(key, fromDate, page);
    for (const item of items) {
      const f = normalize(item);
      if (f) all.push(f);
    }
    if (page * PAGE_SIZE >= total || items.length === 0) break;
  }

  const seen = new Set<string>();
  const festivals = all
    .filter((f) => f.start <= today && today <= f.end)
    .filter((f) => (seen.has(f.id) ? false : (seen.add(f.id), true)))
    .sort((a, b) => a.end.localeCompare(b.end) || a.title.localeCompare(b.title));
  return { ok: true, festivals };
}

/** 같은 날짜 결과는 서버 캐시에서 꺼내 씁니다. */
const memory = new Map<string, { at: number; value: FestivalResult }>();

export async function festivalsFor(today: string): Promise<FestivalResult> {
  const cacheKey = `https://cache.oneulzip.com/festivals/v4/${today}`;
  const hit = memory.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_SECONDS * 1000) return hit.value;

  const cfCache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  if (cfCache) {
    try {
      const cached = await cfCache.match(cacheKey);
      if (cached) {
        const value = (await cached.json()) as FestivalResult;
        memory.set(cacheKey, { at: Date.now(), value });
        return value;
      }
    } catch {
      // 캐시를 못 읽으면 그냥 새로 가져옵니다.
    }
  }

  let value: FestivalResult;
  try {
    value = await loadFromApi(today);
  } catch (error) {
    console.error("[festival]", error);
    return { ok: false, festivals: [] };
  }

  if (value.ok) {
    memory.set(cacheKey, { at: Date.now(), value });
    if (cfCache) {
      try {
        await cfCache.put(
          cacheKey,
          new Response(JSON.stringify(value), {
            headers: { "content-type": "application/json", "cache-control": `public, max-age=${CACHE_SECONDS}` },
          }),
        );
      } catch {
        // 캐시 저장 실패는 무시합니다.
      }
    }
  }
  return value;
}
