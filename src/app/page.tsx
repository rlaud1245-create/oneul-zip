import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { Shop, ShopSign } from "@/components/ShopSign";
import { activities } from "@/data/activities";
import { foods } from "@/data/foods";
import { questionForDate } from "@/features/balance/daily";
import { formatKoreanDate, kstDateKey } from "@/lib/kst";
import { pickDaily } from "@/lib/random";
import { shopInfo } from "@/lib/shops";

/**
 * 오늘의 추천이 자정(KST)에 바로 바뀌도록 요청마다 렌더링.
 * Cloudflare에서는 ISR 캐시(R2/KV)를 따로 붙이지 않으면 revalidate가 동작하지 않아 빌드 날짜로 고정될 수 있음.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const today = kstDateKey();
  const food = pickDaily(foods, today, "food");
  const activity = pickDaily(activities, today, "activity");
  const question = questionForDate(today);

  const shops = [
    {
      theme: "bunsik" as const,
      href: "/food",
      pickHref: `/food?id=${food.id}`,
      label: "사장님 추천",
      pick: `${food.emoji} ${food.name}`,
      note: food.reason,
    },
    {
      theme: "land" as const,
      href: "/activity",
      pickHref: `/activity?id=${activity.id}`,
      label: "오늘의 자유이용권",
      pick: `${activity.emoji} ${activity.name}`,
      note: activity.reason,
    },
    {
      theme: "stationery" as const,
      href: "/balance",
      pickHref: "/balance",
      label: "오늘의 뽑기판",
      pick: `${question.a} vs ${question.b}`,
      note: "고르기 어렵다면 한 칸 뜯어보세요.",
    },
  ];

  return (
    <Shop theme="town">
      <ShopSign
        shop="오늘.zip 상가"
        note={formatKoreanDate(today)}
        title="오늘, 뭐 하지?"
        description="뭘 먹을지, 뭘 할지, 뭘 고를지. 동네 가게에 들러 오늘의 고민을 가볍게 해결해 봐요."
      />
      <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-8 sm:pt-10">
        <section aria-labelledby="shops-title">
          <div className="flex items-end justify-between gap-3">
            <h2 id="shops-title" className="font-sign text-2xl font-normal">
              오늘 문 연 가게
            </h2>
            <p className="font-label text-[15px] text-muted">매일 자정(한국 시간)에 바뀌어요</p>
          </div>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {shops.map((s) => {
              const info = shopInfo(s.theme);
              return (
                <li key={s.theme} data-shop={s.theme} className="bg-transparent bg-none">
                  <div className="card flex h-full flex-col overflow-hidden">
                    <Link href={s.href} className="sign-band block border-b-[3px] px-5 py-4">
                      <span className="block font-label text-[15px]">{info?.name}</span>
                      <span className="sign-title mt-1 block text-[30px] leading-tight">{info?.menu}</span>
                    </Link>
                    <Link href={s.pickHref} className="group flex flex-1 flex-col px-5 py-4">
                      <span className="eyebrow">{s.label}</span>
                      <span className="mt-1 text-[18px] font-bold leading-snug">{s.pick}</span>
                      <span className="mt-1 flex-1 text-sm text-muted">{s.note}</span>
                      <span className="mt-3 inline-flex items-center font-label text-[16px] group-hover:text-primary-deep">
                        들어가 보기
                        <ChevronRight className="size-4" aria-hidden />
                      </span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <AdSlot id="home-bottom" className="mt-12" />
      </div>
    </Shop>
  );
}
