import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Dices, PartyPopper, UtensilsCrossed } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { FeatureCard } from "@/components/FeatureCard";
import { activities } from "@/data/activities";
import { foods } from "@/data/foods";
import { questionForDate } from "@/features/balance/daily";
import { formatKoreanDate, kstDateKey } from "@/lib/kst";
import { pickDaily } from "@/lib/random";

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

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-16">
      <section className="pb-7 pt-9 sm:pb-10 sm:pt-16">
        <p className="inline-flex rounded-full bg-primary-light px-3 py-1 text-sm font-semibold text-primary-deep">
          {formatKoreanDate(today)}
        </p>
        <h1 className="mt-4 text-[40px] font-bold leading-[1.15] tracking-tight sm:text-6xl">오늘, 뭐 하지?</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          뭘 먹을지, 뭘 할지, 어디 갈지.
          <br />
          오늘의 고민을 가볍게 해결해 봐요.
        </p>
      </section>

      <section aria-labelledby="features-title">
        <h2 id="features-title" className="sr-only">
          주요 기능
        </h2>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          <FeatureCard
            href="/food"
            tone="purple"
            icon={<UtensilsCrossed className="size-6" />}
            title="오늘 뭐 먹지?"
            description="메뉴 고민될 때, 빠르게 음식 추천"
          />
          <FeatureCard
            href="/activity"
            tone="yellow"
            icon={<PartyPopper className="size-6" />}
            title="오늘 뭐 하지?"
            description="심심할 때, 상황에 맞는 활동 추천"
          />
          <FeatureCard
            href="/balance"
            tone="peach"
            icon={<Dices className="size-6" />}
            title="오늘의 선택"
            description="매일 새로운 밸런스 게임"
          />
        </div>
      </section>

      <section aria-labelledby="today-title" className="mt-14">
        <div className="flex items-end justify-between gap-3">
          <h2 id="today-title" className="text-xl font-bold">
            오늘의 추천
          </h2>
          <p className="text-xs text-muted">매일 자정(한국 시간)에 바뀌어요</p>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">
          <TodayCard
            href={`/food?id=${food.id}`}
            label="오늘의 메뉴"
            title={`${food.emoji} ${food.name}`}
            description={food.reason}
          />
          <TodayCard
            href={`/activity?id=${activity.id}`}
            label="오늘의 활동"
            title={`${activity.emoji} ${activity.name}`}
            description={activity.reason}
          />
          <TodayCard
            href="/balance"
            label="오늘의 밸런스 게임"
            title={`${question.a} vs ${question.b}`}
            description="당신의 선택은?"
          />
        </ul>
      </section>

      <AdSlot id="home-bottom" className="mt-12" />
    </div>
  );
}

function TodayCard({ href, label, title, description }: { href: string; label: string; title: string; description: string }) {
  return (
    <li>
      <Link href={href} className="card group flex h-full flex-col p-5 transition hover:border-primary/40">
        <span className="text-xs font-semibold text-primary-deep">{label}</span>
        <span className="mt-2 text-[17px] font-bold leading-snug">{title}</span>
        <span className="mt-1 flex-1 text-sm text-muted">{description}</span>
        <span className="mt-3 inline-flex items-center text-sm font-medium text-muted group-hover:text-primary-deep">
          보러 가기
          <ChevronRight className="size-4" aria-hidden />
        </span>
      </Link>
    </li>
  );
}
