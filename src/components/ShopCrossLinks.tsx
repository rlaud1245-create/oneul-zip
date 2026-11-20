import Link from "next/link";
import { activities } from "@/data/activities";
import { foods } from "@/data/foods";
import { luckyZodiacs } from "@/data/fortunes";
import { questionForDate } from "@/features/balance/daily";
import { kstDateKey } from "@/lib/kst";
import { pickDaily } from "@/lib/random";
import type { ShopTheme } from "@/lib/shops";

/** 다른 가게의 오늘 추천으로 건너가는 쪽지 두 장 */
export function ShopCrossLinks({ current }: { current: ShopTheme }) {
  const today = kstDateKey();
  const food = pickDaily(foods, today, "food");
  const activity = pickDaily(activities, today, "activity");
  const question = questionForDate(today);
  const lucky = luckyZodiacs(today);

  const links = [
    { theme: "bunsik", label: "오늘 뭐 먹지", title: food.name, href: `/food?id=${food.id}` },
    { theme: "land", label: "오늘 뭐 하지", title: activity.name, href: `/activity?id=${activity.id}` },
    { theme: "stationery", label: "오늘의 선택", title: `${question.a} vs ${question.b}`, href: "/balance" },
    {
      theme: "fortune",
      label: "오늘의 운세",
      title: lucky.length ? `오늘 대길: ${lucky.join(", ")}띠` : "띠별 오늘의 부적",
      href: "/fortune",
    },
    { theme: "festival", label: "오늘의 축제", title: "오늘 열린 동네 축제", href: "/festival" },
  ].filter((l) => l.theme !== current);

  return (
    <nav aria-label="다른 가게" className="mt-8 grid grid-cols-2 gap-2.5">
      {links.map((l) => (
        <Link
          key={l.theme}
          href={l.href}
          data-shop={l.theme}
          className="flex flex-col gap-0.5 rounded-[10px] border-[3px] border-ink bg-surface! bg-none! px-3.5 py-3 hover:bg-primary-light!"
        >
          <span className="font-label text-[15px] text-primary-deep">{l.label}</span>
          <span className="truncate text-[15px] font-black">{l.title}</span>
        </Link>
      ))}
    </nav>
  );
}
