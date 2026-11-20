import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { InfoSection } from "@/components/InfoSection";
import { ShopCrossLinks } from "@/components/ShopCrossLinks";
import { Shop, ShopSign } from "@/components/ShopSign";
import { fortuneFor, isZodiac } from "@/data/fortunes";
import { FortunePicker } from "@/features/fortune/FortunePicker";
import { formatKoreanDate, kstDateKey } from "@/lib/kst";

type Props = { searchParams: Promise<{ z?: string | string[] }> };

/** 날짜가 바뀌면 부적도 바뀌므로 요청마다 렌더링 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { z } = await searchParams;
  const zodiac = isZodiac(z) ? z : null;
  const title = "오늘의 운세: 띠별 부적";
  const description = zodiac
    ? `${zodiac}띠 오늘의 운세는 ${fortuneFor(kstDateKey(), zodiac).grade}! 띠별로 오늘의 부적을 받아보세요.`
    : "쥐띠부터 돼지띠까지, 띠별 오늘의 운세를 부적으로 받아보세요. 행운의 색과 숫자도 알려드려요.";

  return {
    title,
    description,
    alternates: { canonical: "/fortune" },
    openGraph: {
      images: ["/fortune/opengraph-image.png"],
      title: zodiac ? `${zodiac}띠 오늘의 부적` : title,
      description,
      url: zodiac ? `/fortune?z=${encodeURIComponent(zodiac)}` : "/fortune",
    },
    twitter: {
      card: "summary_large_image",
      images: ["/fortune/twitter-image.png"],
      title: zodiac ? `${zodiac}띠 오늘의 부적` : title,
      description,
    },
  };
}

export default async function FortunePage({ searchParams }: Props) {
  const { z } = await searchParams;
  const today = kstDateKey();

  return (
    <Shop theme="fortune">
      <ShopSign
        width="max-w-2xl"
        shop="오늘.zip 철학관"
        note={formatKoreanDate(today)}
        title="오늘의 운세"
        description="띠를 고르면 오늘의 부적을 써드려요. 행운의 색과 숫자, 조심할 것까지 알려드려요."
      />
      <div className="mx-auto w-full max-w-2xl px-5 pb-16 pt-6 sm:pt-8">
        <FortunePicker dateKey={today} initialZodiac={isZodiac(z) ? z : undefined} />
        <ShopCrossLinks current="fortune" />

        <AdSlot id="fortune-bottom" className="mt-10" />

        <InfoSection title="오늘의 운세는 어떻게 정해지나요?">
          <p>
            날짜와 띠를 조합해서 매일 한국 시간 자정에 새 부적이 나와요. 같은 날 같은 띠라면 누구에게나 같은 부적이
            나오니까, 친구와 가족에게 보내서 서로의 운세를 비교해 보세요.
          </p>
          <p>재미로 보는 운세라 실제 운명이나 미래를 알려주지는 않아요. 가볍게 즐겨주세요.</p>
        </InfoSection>
      </div>
    </Shop>
  );
}
