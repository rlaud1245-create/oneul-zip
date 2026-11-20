"use client";

import { useMemo, useRef, useState } from "react";
import { ImageIcon, MapPin, Phone, X } from "lucide-react";
import { StickyAction } from "@/components/ShopParts";
import { cn } from "@/lib/cn";
import { dayIndex } from "@/lib/kst";
import type { Festival } from "./festivals";

/**
 * 동네 게시판: 오늘 열리는 축제 전단지
 * - 지역 칩으로 거르고, "내 주변"을 누르면 브라우저에서만 거리를 계산합니다.
 * - 위치(위도·경도)는 이 컴포넌트 밖으로 나가지 않습니다. 서버 요청에 넣지 않고 저장하지도 않습니다.
 */

const REGION_ORDER = [
  "서울", "인천", "경기", "강원", "대전", "세종", "충북", "충남",
  "광주", "전북", "전남", "전남광주", "부산", "대구", "울산", "경북", "경남", "제주", "기타",
];
const NEAR = "내 주변";
const PAGE = 12;
const TILTS = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-[0.6deg]", "rotate-[0.8deg]", "rotate-0"];
const PINS = ["bg-[#c8412e]", "bg-[#2f5a2a]", "bg-[#e9b949]", "bg-[#2f3b5e]"];

type GeoState = "idle" | "asking" | "ok" | "denied" | "unsupported";

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(h));
}

function badgeFor(f: Festival, today: string) {
  if (f.end === today) return { text: "오늘 마지막", hot: true };
  if (f.start === today) return { text: "오늘 시작", hot: true };
  const left = dayIndex(f.end) - dayIndex(today);
  return left <= 7 ? { text: `D-${left}`, hot: false } : { text: "진행 중", hot: false };
}

function shortDate(dateKey: string) {
  const [, m, d] = dateKey.split("-").map(Number);
  return `${m}.${d}`;
}

function formatKm(km: number) {
  return km < 1 ? `${Math.round(km * 1000)}m` : km < 10 ? `${km.toFixed(1)}km` : `${Math.round(km)}km`;
}

function mapLink(f: Festival) {
  return f.lat != null && f.lng != null
    ? `https://map.kakao.com/link/map/${encodeURIComponent(f.title)},${f.lat},${f.lng}`
    : `https://map.kakao.com/link/search/${encodeURIComponent(f.address || f.title)}`;
}

interface Props {
  today: string;
  festivals: Festival[];
  ok: boolean;
}

export function FestivalBoard({ today, festivals, ok }: Props) {
  const [region, setRegion] = useState<string>("전체");
  const [geo, setGeo] = useState<GeoState>("idle");
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);
  const [posterOpen, setPosterOpen] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const regions = useMemo(() => {
    const present = new Set(festivals.map((f) => f.region));
    // 목록에 없는 새 지역 이름(통합 시·도 등)도 "기타" 앞에 붙여 보여줍니다.
    const extra = [...present].filter((r) => !REGION_ORDER.includes(r)).sort();
    const known = REGION_ORDER.filter((r) => present.has(r) && r !== "기타");
    return [...known, ...extra, ...(present.has("기타") ? ["기타"] : [])];
  }, [festivals]);

  const list = useMemo(() => {
    if (region === NEAR && here) {
      return festivals
        .filter((f) => f.lat != null && f.lng != null)
        .map((f) => ({ f, km: distanceKm(here.lat, here.lng, f.lat!, f.lng!) }))
        .sort((a, b) => a.km - b.km);
    }
    const rows = region === "전체" ? festivals : festivals.filter((f) => f.region === region);
    return rows.map((f) => ({ f, km: here && f.lat != null && f.lng != null ? distanceKm(here.lat, here.lng, f.lat, f.lng) : null }));
  }, [festivals, region, here]);

  const selected = list.find((row) => row.f.id === selectedId) ?? null;

  function choose(next: string) {
    setRegion(next);
    setLimit(PAGE);
    setSelectedId(null);
  }

  function findNear() {
    if (!("geolocation" in navigator)) {
      setGeo("unsupported");
      return;
    }
    setGeo("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeo("ok");
        choose(NEAR);
      },
      () => setGeo("denied"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 10 * 60_000 },
    );
  }

  function open(id: string) {
    setSelectedId(id);
    setPosterOpen(false);
    requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }

  function pickRandom() {
    if (!list.length) return;
    // 내 주변이면 가까운 10곳 안에서 고릅니다.
    const pool = region === NEAR ? list.slice(0, 10) : list;
    const candidates = pool.length > 1 ? pool.filter((row) => row.f.id !== selectedId) : pool;
    const row = candidates[Math.floor(Math.random() * candidates.length)];
    const index = list.indexOf(row);
    if (index >= limit) setLimit(index + 1);
    open(row.f.id);
  }

  if (!ok) {
    return (
      <div className="card px-5 py-8 text-center">
        <p className="font-sign text-2xl">게시판 정리 중이에요</p>
        <p className="mt-2 text-[15px] text-muted">축제 소식을 가져오지 못했어요. 잠시 뒤에 다시 들러 주세요.</p>
      </div>
    );
  }

  const nearNote =
    geo === "asking"
      ? "위치를 확인하고 있어요…"
      : geo === "denied"
        ? "위치 권한이 꺼져 있어요. 브라우저 설정에서 허용하거나 지역을 골라 주세요."
        : geo === "unsupported"
          ? "이 브라우저에서는 위치를 쓸 수 없어요. 지역을 골라 주세요."
          : null;

  return (
    <div>
      {/* 지역 고르기 */}
      <div className="flex items-center justify-between gap-3">
        <p className="font-label text-[17px]">
          오늘 열린 축제 <strong className="font-sign text-[22px] font-normal text-primary-deep">{festivals.length}</strong>곳
        </p>
        <button
          type="button"
          onClick={here ? () => choose(NEAR) : findNear}
          aria-pressed={region === NEAR}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-full border-[3px] border-ink px-4 font-label text-[16px]",
            region === NEAR ? "bg-ink text-surface" : "bg-primary-strong text-on-strong",
          )}
        >
          <MapPin className="size-4" aria-hidden />
          {geo === "asking" ? "찾는 중" : NEAR}
        </button>
      </div>
      {nearNote && (
        <p role="status" className="mt-2 text-sm text-muted">
          {nearNote}
        </p>
      )}

      <div
        role="group"
        aria-label="지역"
        className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {["전체", ...regions].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => choose(r)}
            aria-pressed={region === r}
            className={cn(
              "min-h-10 shrink-0 rounded-full border-2 border-ink px-3.5 font-label text-[16px]",
              region === r ? "bg-ink text-surface" : "bg-surface hover:bg-primary-light",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* 고른 전단지 */}
      {selected && (
        <div ref={detailRef} className="card relative mt-5 overflow-hidden">
          <div className="sign-band border-b-[3px] px-5 py-3">
            <span className="font-label text-[15px]">{selected.f.region} · {badgeFor(selected.f, today).text}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            aria-label="닫기"
            className="absolute right-2 top-1.5 grid size-10 place-items-center"
          >
            <X className="size-5" aria-hidden />
          </button>
          <div className="px-5 pb-5 pt-4">
            <h2 className="font-sign text-[28px] font-normal leading-tight">{selected.f.title}</h2>
            <dl className="mt-3 grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-1.5 text-[15px]">
              <dt className="font-label text-muted">기간</dt>
              <dd>
                {shortDate(selected.f.start)} ~ {shortDate(selected.f.end)}
              </dd>
              {selected.f.address && (
                <>
                  <dt className="font-label text-muted">장소</dt>
                  <dd>
                    {selected.f.address}
                    {selected.km != null && <span className="ml-1.5 text-muted">({formatKm(selected.km)})</span>}
                  </dd>
                </>
              )}
              {selected.f.tel && (
                <>
                  <dt className="font-label text-muted">문의</dt>
                  <dd>
                    <a href={`tel:${selected.f.tel.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1 underline underline-offset-2">
                      <Phone className="size-3.5" aria-hidden />
                      {selected.f.tel}
                    </a>
                  </dd>
                </>
              )}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={mapLink(selected.f)} target="_blank" rel="noopener noreferrer" className="btn-primary">
                지도에서 보기
              </a>
              {selected.f.image ? (
                <button
                  type="button"
                  onClick={() => setPosterOpen((v) => !v)}
                  aria-expanded={posterOpen}
                  aria-controls="festival-poster"
                  className={cn("btn-secondary", posterOpen && "bg-ink! text-surface!")}
                >
                  <ImageIcon className="size-4" aria-hidden />
                  {posterOpen ? "포스터 접기" : "포스터 보기"}
                </button>
              ) : null}
              <a
                href={`https://search.naver.com/search.naver?query=${encodeURIComponent(selected.f.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                자세히 검색
              </a>
            </div>
          </div>
          {selected.f.image && posterOpen && (
            <div id="festival-poster" className="border-t-2 border-dashed border-ink/40 bg-canvas px-5 pb-5 pt-4">
              <a
                href={selected.f.image}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto block max-w-md border-2 border-ink bg-surface"
              >
                {/* 공공누리 변경금지 조건을 지키기 위해 자르거나 덧씌우지 않고 원본 비율 그대로 보여줍니다. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.f.image}
                  alt={`${selected.f.title} 포스터`}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="block h-auto w-full"
                />
              </a>
              <p className="mx-auto mt-2 flex max-w-md justify-between gap-2 text-[13px] text-muted">
                <span>누르면 원본을 크게 볼 수 있어요</span>
                <span>사진: 한국관광공사</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* 코르크 게시판 */}
      <div className="mt-5 rounded-card border-[3px] border-ink bg-[#c99d66] p-3 [background-image:radial-gradient(rgb(43_29_20/0.18)_1px,transparent_1.4px)] [background-size:7px_7px] sm:p-4">
        {list.length === 0 ? (
          <p className="rounded-lg bg-surface px-4 py-8 text-center text-[15px]">
            {region === NEAR ? "근처에 위치가 표시된 축제가 없어요. 지역을 골라 보세요." : "이 지역은 오늘 붙은 전단지가 없어요."}
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {list.slice(0, limit).map(({ f, km }, i) => {
              const badge = badgeFor(f, today);
              return (
                <li key={f.id} className={cn("relative", TILTS[i % TILTS.length])}>
                  <span
                    aria-hidden
                    className={cn("absolute left-1/2 top-1 z-10 size-3 -translate-x-1/2 rounded-full border-2 border-ink", PINS[i % PINS.length])}
                  />
                  <button
                    type="button"
                    onClick={() => open(f.id)}
                    aria-pressed={selectedId === f.id}
                    className={cn(
                      "flex h-full min-h-[132px] w-full flex-col rounded-[6px] border-2 border-ink bg-surface px-3 pb-3 pt-5 text-left shadow-[2px_3px_0_rgb(43_29_20/0.35)]",
                      selectedId === f.id && "outline-[3px] outline-offset-2 outline-ink",
                    )}
                  >
                    <span className="flex items-center justify-between gap-1 font-label text-[13px]">
                      <span className="text-muted">{f.region}</span>
                      <span
                        className={cn(
                          "rounded-full border border-ink px-1.5 leading-5",
                          badge.hot ? "bg-primary-strong text-on-strong" : "bg-primary-light",
                        )}
                      >
                        {badge.text}
                      </span>
                    </span>
                    <span className="mt-1.5 line-clamp-3 flex-1 text-[15px] font-black leading-snug">{f.title}</span>
                    <span className="mt-2 font-label text-[13px] text-muted">
                      ~{shortDate(f.end)}
                      {km != null && ` · ${formatKm(km)}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {list.length > limit && (
          <button
            type="button"
            onClick={() => setLimit((n) => n + PAGE)}
            className="mt-3 w-full rounded-lg border-2 border-ink bg-surface py-2.5 font-label text-[16px]"
          >
            전단지 {Math.min(PAGE, list.length - limit)}장 더 보기 ({list.length - limit}장 남음)
          </button>
        )}
      </div>

      <p className="mt-3 text-right text-[13px] text-muted">
        축제 정보·사진: 한국관광공사 · 일정은 바뀔 수 있으니 가기 전에 꼭 확인하세요
      </p>

      {list.length > 0 && (
        <StickyAction>
          <button type="button" onClick={pickRandom} className="btn-primary w-full text-[19px]">
            아무 축제나 골라줘
          </button>
        </StickyAction>
      )}
    </div>
  );
}
