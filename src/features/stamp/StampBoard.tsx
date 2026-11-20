"use client";

import Link from "next/link";
import { useHydrated, useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/cn";
import { STORAGE_KEYS } from "@/lib/storage";
import {
  BOARD_SIZE,
  EMPTY_STAMPS,
  REWARDS,
  STAMP_STYLE,
  boardCount,
  currentBoard,
  hasGoldTalisman,
  streakOf,
  type StampData,
  type StampShop,
} from "@/lib/stamps";

const ROTATIONS = ["-12deg", "8deg", "-4deg", "13deg", "-9deg", "5deg", "-6deg"];
const SHOP_ORDER: StampShop[] = ["bunsik", "land", "stationery", "fortune", "festival"];

function shortDate(dateKey: string) {
  const [, m, d] = dateKey.split("-").map(Number);
  return `${m}.${d}`;
}

export function StampBoard({ today }: { today: string }) {
  const [data] = useLocalStorage<StampData>(STORAGE_KEYS.stamps, EMPTY_STAMPS);
  const hydrated = useHydrated();
  const list = hydrated ? data.list : [];
  const board = currentBoard(list);
  const inBoard = boardCount(list.length);
  const finishedBoards = Math.floor(list.length / BOARD_SIZE) - (inBoard === BOARD_SIZE ? 1 : 0);
  const stampedToday = list.some((s) => s.d === today);
  const streak = streakOf(list, today);
  const visited = hydrated && data.today.d === today ? data.today.shops : [];
  const notYet = SHOP_ORDER.filter((s) => !visited.includes(s));
  const prizeAt = new Set(REWARDS.map((r) => r.at));

  return (
    <div className="space-y-5">
      {/* 오늘 상태 */}
      <div className="card px-4 py-3.5">
        <p className="font-label text-[18px]">
          {stampedToday ? "오늘 도장 받았어요. 내일 또 들러 주세요!" : "오늘 도장이 아직이에요"}
        </p>
        <p className="mt-1 text-[14px] text-muted">
          {stampedToday
            ? notYet.length
              ? "오늘 아직 안 들른 가게도 구경해 보세요."
              : "오늘 다섯 가게를 다 들렀어요. 동네 터줏대감이시네요."
            : "아무 가게나 들러서 메뉴를 뽑거나, 뽑기판을 뜯거나, 부적을 받으면 도장이 찍혀요."}
        </p>
        {notYet.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {notYet.map((s) => (
              <li key={s}>
                <Link
                  href={STAMP_STYLE[s].path}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-ink bg-surface px-3 font-label text-[15px] hover:bg-primary-light"
                >
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: STAMP_STYLE[s].color }} aria-hidden />
                  {STAMP_STYLE[s].name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 쿠폰 */}
      <section aria-labelledby="coupon-title" className="card px-3.5 pb-4 pt-3.5 sm:px-5">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="coupon-title" className="font-label text-[18px]">
            이번 판{" "}
            <strong className="font-sign text-[26px] font-normal text-primary-deep">{inBoard}</strong> / {BOARD_SIZE}
          </h2>
          <p className="font-label text-[15px] text-muted">
            연속 {streak}일째{finishedBoards > 0 && ` · 완주 ${finishedBoards}판`}
          </p>
        </div>

        <ol className="mt-3 grid grid-cols-6 gap-2 sm:gap-3" aria-label="도장 칸">
          {Array.from({ length: BOARD_SIZE }, (_, i) => {
            const stamp = board[i];
            const prize = prizeAt.has(i + 1);
            const style = stamp ? STAMP_STYLE[stamp.s] : null;
            return (
              <li
                key={i}
                className={cn(
                  "relative grid aspect-square place-items-center rounded-full border-2 border-dashed font-label text-[13px] text-[#9C8A73]",
                  prize ? "border-ink bg-primary-light" : "border-[#C9B48E]",
                )}
                aria-label={stamp ? `${i + 1}번째 도장: ${shortDate(stamp.d)} ${style?.name}` : `${i + 1}번째 칸${prize ? " (보상)" : ""}`}
              >
                <span aria-hidden>{prize && !stamp ? "🎁" : i + 1}</span>
                {stamp && style && (
                  <span
                    className="absolute inset-0.5 grid place-items-center rounded-full font-sign text-[19px] text-white opacity-95 shadow-[inset_0_0_0_3px_rgb(255_255_255/0.55)] sm:text-[24px]"
                    style={{ backgroundColor: style.color, transform: `rotate(${ROTATIONS[i % ROTATIONS.length]})` }}
                    aria-hidden
                  >
                    {style.char}
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-label text-[13px] text-muted" aria-label="도장 색">
          {SHOP_ORDER.map((s) => (
            <li key={s} className="inline-flex items-center gap-1">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: STAMP_STYLE[s].color }} aria-hidden />
              {STAMP_STYLE[s].name}
            </li>
          ))}
        </ul>
      </section>

      {/* 보상 */}
      <section aria-labelledby="reward-title">
        <h2 id="reward-title" className="font-sign text-xl font-normal">
          도장 보상
        </h2>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {REWARDS.map((r) => {
            const got = inBoard >= r.at || (r.at === BOARD_SIZE && hasGoldTalisman(list));
            return (
              <li
                key={r.at}
                className={cn(
                  "flex flex-col items-center rounded-card border-[3px] border-ink px-2 py-3 text-center",
                  got ? "bg-primary-light" : "bg-surface",
                )}
              >
                <span className="font-sign text-[22px] leading-none">{r.at}개</span>
                <span className="mt-1.5 font-label text-[15px] leading-tight">{r.title}</span>
                <span className="mt-1 text-[12px] leading-snug text-muted">{got ? "받았어요!" : r.description}</span>
              </li>
            );
          })}
        </ul>
        {hasGoldTalisman(list) && (
          <Link href="/fortune" className="btn-secondary mt-3 w-full">
            황금 부적 받으러 철학관 가기
          </Link>
        )}
      </section>

      {/* 명찰 */}
      {inBoard >= 7 && (
        <div className="mx-auto w-fit -rotate-2 rounded-lg border-[3px] border-ink bg-surface px-6 py-3 text-center shadow-[3px_4px_0_rgb(43_29_20/0.3)]">
          <p className="font-label text-[13px] text-muted">오늘.zip 상가</p>
          <p className="font-sign text-[26px] leading-tight">{inBoard >= 15 ? "우수 단골" : "단골 손님"}</p>
        </div>
      )}
    </div>
  );
}
