import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { InfoSection } from "@/components/InfoSection";
import { PageIntro } from "@/components/PageIntro";
import { BalanceGame } from "@/features/balance/BalanceGame";
import { previousDates, questionForDate } from "@/features/balance/daily";
import { formatKoreanDate, isDateKey, kstDateKey } from "@/lib/kst";

type Props = { searchParams: Promise<{ date?: string | string[] }> };

/** 오늘 또는 지난 날짜만 허용 (미래 질문 미리보기 방지) */
function resolveDate(raw: unknown, today: string): string {
  return isDateKey(raw) && raw <= today ? raw : today;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { date } = await searchParams;
  const today = kstDateKey();
  const dateKey = resolveDate(date, today);
  const q = questionForDate(dateKey);
  const isToday = dateKey === today;
  const title = isToday ? "오늘의 밸런스 게임" : `${formatKoreanDate(dateKey, false)} 밸런스 게임`;
  const description = `${q.a} vs ${q.b}, 당신의 선택은? 매일 새로운 밸런스 게임이 올라와요.`;

  return {
    title,
    description,
    alternates: { canonical: "/balance" },
    openGraph: {
      images: ["/opengraph-image.png"],
      title: `${q.a} vs ${q.b}`,
      description: "오늘.zip 밸런스 게임, 당신의 선택은?",
      url: isToday ? "/balance" : `/balance?date=${dateKey}`,
    },
    twitter: { card: "summary_large_image", images: ["/twitter-image.png"], title: `${q.a} vs ${q.b}`, description: "오늘.zip 밸런스 게임, 당신의 선택은?" },
  };
}

export default async function BalancePage({ searchParams }: Props) {
  const { date } = await searchParams;
  const today = kstDateKey();
  const dateKey = resolveDate(date, today);
  const isToday = dateKey === today;

  const past = previousDates(today, 7).map((d) => ({
    dateKey: d,
    label: formatKoreanDate(d, false),
    question: questionForDate(d),
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16">
      <PageIntro
        eyebrow={isToday ? formatKoreanDate(today) : `${formatKoreanDate(dateKey)} 질문`}
        title={isToday ? "오늘의 선택은?" : "지난 선택 다시 보기"}
        description="둘 중 하나만 고를 수 있다면? 하루에 하나씩, 가볍게 골라보세요."
      />
      <BalanceGame
        question={questionForDate(dateKey)}
        dateKey={dateKey}
        dateLabel={formatKoreanDate(dateKey, false)}
        isToday={isToday}
        past={past}
      />
      <AdSlot id="balance-bottom" className="mt-10" />

      <InfoSection title="오늘의 밸런스 게임이란?">
        <p>
          음식, 연애, 일상, 취향, 여행, 재미 여섯 가지 주제의 밸런스 게임이 매일 한국 시간 자정에 하나씩 바뀌어요. 친구에게
          공유해서 서로의 선택을 비교해 보세요.
        </p>
        <p>
          내 선택은 이 기기의 브라우저에만 저장되고, 서버로 전송되지 않아요. 전체 이용자 투표 결과는 집계 기능을 준비하고
          있어요.
        </p>
      </InfoSection>
    </div>
  );
}
