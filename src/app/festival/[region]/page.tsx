import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { InfoSection } from "@/components/InfoSection";
import { ShopCrossLinks } from "@/components/ShopCrossLinks";
import { Shop, ShopSign } from "@/components/ShopSign";
import { FestivalBoard } from "@/features/festival/FestivalBoard";
import { festivalsFor } from "@/features/festival/festivals";
import { FESTIVAL_REGIONS, regionBySlug } from "@/features/festival/regions";
import { formatKoreanDate, kstDateKey } from "@/lib/kst";

type Props = { params: Promise<{ region: string }> };

/** 날짜가 바뀌면 열리는 축제도 바뀌므로 요청마다 렌더링 (축제 목록 자체는 6시간 캐시) */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = regionBySlug((await params).region);
  if (!region) return {};
  const { festivals } = await festivalsFor(kstDateKey());
  const count = festivals.filter((f) => f.region === region.name).length;

  const title = `${region.name} 축제: 오늘 열리는 ${region.name} 축제`;
  const description = count
    ? `오늘 ${region.fullName}에서 열리는 축제 ${count}곳을 모았어요. 오늘 시작, 오늘 마지막 축제와 장소, 기간, 포스터까지 한눈에.`
    : `${region.fullName}에서 열리는 축제를 매일 모아 보여드려요. 장소, 기간, 포스터까지 한눈에.`;
  const url = `/festival/${region.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { images: ["/festival/opengraph-image.png"], title, description, url },
    twitter: { card: "summary_large_image", images: ["/festival/twitter-image.png"], title, description },
  };
}

export default async function FestivalRegionPage({ params }: Props) {
  const region = regionBySlug((await params).region);
  if (!region) notFound();

  const today = kstDateKey();
  const { ok, festivals } = await festivalsFor(today);
  const count = festivals.filter((f) => f.region === region.name).length;
  const others = FESTIVAL_REGIONS.filter((r) => r.slug !== region.slug);

  return (
    <Shop theme="festival">
      <ShopSign
        width="max-w-3xl"
        shop="오늘.zip 동네 게시판"
        note={formatKoreanDate(today)}
        title={`${region.name} 축제`}
        description={
          ok && count
            ? `오늘 ${region.fullName}에서 열리는 축제 ${count}곳의 전단지를 붙여 놨어요.`
            : `오늘 ${region.fullName}에서 열리는 축제를 모아 보여드려요.`
        }
      />
      <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-6 sm:pt-8">
        <FestivalBoard key={region.name} today={today} festivals={festivals} ok={ok} initialRegion={region.name} />
        <ShopCrossLinks current="festival" />

        <AdSlot id="festival-region-bottom" className="mt-10" />

        <InfoSection title={`${region.name} 축제, 이렇게 모았어요`}>
          <p>
            한국관광공사 관광정보 서비스에 등록된 행사 중 오늘 {region.fullName}에서 열리는 축제만 골라 보여드려요. 목록은 몇
            시간마다 새로 받아오고, 취소된 행사는 빼고 보여드려요.
          </p>
          <p>
            전단지를 누르면 기간과 장소, 문의처를 볼 수 있고, 포스터가 있는 축제는 포스터도 펼쳐 볼 수 있어요. 가기 전에는 주최
            측 안내로 일정을 한 번 더 확인해 주세요.
          </p>
        </InfoSection>

        <nav aria-label="다른 지역 축제" className="mt-8">
          <h2 className="font-sign text-xl font-normal">다른 지역 축제</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            <li>
              <Link href="/festival" className="chip">
                전국
              </Link>
            </li>
            {others.map((r) => (
              <li key={r.slug}>
                <Link href={`/festival/${r.slug}`} className="chip">
                  {r.name} 축제
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Shop>
  );
}
