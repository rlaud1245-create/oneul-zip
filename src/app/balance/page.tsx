import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { InfoSection } from "@/components/InfoSection";
import { ShopCrossLinks } from "@/components/ShopCrossLinks";
import { Shop, ShopSign } from "@/components/ShopSign";
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
      images: ["/balance/opengraph-image.png"],
      title: `${q.a} vs ${q.b}`,
      description: "오늘.zip 밸런스 게임, 당신의 선택은?",
      url: isToday ? "/balance" : `/balance?date=${dateKey}`,
    },
    twitter: { card: "summary_large_image", images: ["/balance/twitter-image.png"], title: `${q.a} vs ${q.b}`, description: "오늘.zip 밸런스 게임, 당신의 선택은?" },
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
    <Shop theme="stationery">
      <ShopSign
        width="max-w-3xl"
        shop="오늘.zip 문방구"
        note={isToday ? formatKoreanDate(today) : `${formatKoreanDate(dateKey)} 뽑기판`}
        title={isToday ? "오늘의 선택" : "지난 뽑기판"}
        description="둘 중 하나, 고르기 어렵다면 뽑기판에 맡겨보세요. 매일 판이 바뀌어요."
      />
    <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-6 sm:pt-8">
      <BalanceGame
        question={questionForDate(dateKey)}
        dateKey={dateKey}
        dateLabel={formatKoreanDate(dateKey, false)}
        isToday={isToday}
        past={past}
      />
      <ShopCrossLinks current="stationery" />
      <AdSlot id="balance-bottom" className="mt-10" />

      <InfoSection title="오늘의 뽑기판이란?">
        <p>
          음식, 연애, 일상, 취향, 여행, 재미 여섯 가지 주제의 밸런스 게임이 매일 한국 시간 자정에 하나씩 바뀌어요. 둘 중
          하나를 고르기 어려울 때, 뽑기판에서 남은 칸을 하나 뜯으면 둘 중 한쪽이 나와요.
        </p>
        <p>
          30칸 중 18칸은 이미 꽝으로 뜯겨 있고, 남은 12칸에 두 선택지가 반반씩 들어 있어요. 꽝 위치와 배치는 날짜마다
          바뀌어요. 친구에게 보내서 누가 어느 쪽을 뽑았는지 비교해 보세요.
        </p>
        <p>
          내 선택은 이 기기의 브라우저에만 저장되고, 서버로 전송되지 않아요. 전체 이용자 투표 결과는 집계 기능을 준비하고
          있어요.
        </p>
      </InfoSection>
    </div>
    </Shop>
  );
}
