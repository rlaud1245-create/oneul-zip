import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { InfoSection } from "@/components/InfoSection";
import { ShopCrossLinks } from "@/components/ShopCrossLinks";
import { Shop, ShopSign } from "@/components/ShopSign";
import { FestivalBoard } from "@/features/festival/FestivalBoard";
import { festivalsFor } from "@/features/festival/festivals";
import { formatKoreanDate, kstDateKey } from "@/lib/kst";

/** 날짜가 바뀌면 열리는 축제도 바뀌므로 요청마다 렌더링 (축제 목록 자체는 6시간 캐시) */
export const dynamic = "force-dynamic";

const title = "오늘의 축제: 지금 열리는 전국 축제";
const description = "오늘 열리는 전국 축제를 지역별로, 내 주변 가까운 순으로 모아 봤어요. 오늘 시작, 오늘 마지막 축제도 한눈에.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/festival" },
  openGraph: { images: ["/festival/opengraph-image.png"], title, description, url: "/festival" },
  twitter: { card: "summary_large_image", images: ["/festival/twitter-image.png"], title, description },
};

export default async function FestivalPage() {
  const today = kstDateKey();
  const { ok, festivals } = await festivalsFor(today);

  return (
    <Shop theme="festival">
      <ShopSign
        width="max-w-3xl"
        shop="오늘.zip 동네 게시판"
        note={formatKoreanDate(today)}
        title="오늘의 축제"
        description="오늘 열리는 축제 전단지를 붙여 놨어요. 지역을 고르거나 내 주변을 눌러 가까운 축제를 찾아보세요."
      />
      <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-6 sm:pt-8">
        <FestivalBoard today={today} festivals={festivals} ok={ok} />
        <ShopCrossLinks current="festival" />

        <AdSlot id="festival-bottom" className="mt-10" />

        <InfoSection title="축제 정보는 어디서 오나요?">
          <p>
            한국관광공사 관광정보 서비스에 등록된 행사 중 오늘 날짜에 열리는 축제만 골라 보여드려요. 목록은 몇 시간마다
            새로 받아오고, 취소된 행사는 빼고 보여드려요.
          </p>
          <p>
            &lsquo;내 주변&rsquo;을 누르면 위치를 이 기기 안에서만 써서 거리를 계산해요. 위치는 서버로 보내거나 저장하지
            않아요.
          </p>
          <p>일정과 장소는 주최 측 사정으로 바뀔 수 있으니, 가기 전에 꼭 한 번 더 확인해 주세요.</p>
        </InfoSection>
      </div>
    </Shop>
  );
}
