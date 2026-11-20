import type { Metadata } from "next";
import { InfoSection } from "@/components/InfoSection";
import { Shop, ShopSign } from "@/components/ShopSign";
import { StampBoard } from "@/features/stamp/StampBoard";
import { formatKoreanDate, kstDateKey } from "@/lib/kst";

/** 오늘 날짜 기준으로 도장 여부를 보여주므로 요청마다 렌더링 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "단골 도장판",
  description: "하루에 한 번, 오늘.zip 상가의 아무 가게나 들르면 도장이 찍혀요. 30칸을 채우고 단골 명찰과 황금 부적을 받아 보세요.",
  alternates: { canonical: "/stamp" },
};

export default function StampPage() {
  const today = kstDateKey();
  return (
    <Shop theme="town">
      <ShopSign
        width="max-w-2xl"
        shop="오늘.zip 상가 쿠폰"
        note={formatKoreanDate(today)}
        title="단골 도장판"
        description="하루에 한 번, 아무 가게나 들르면 도장이 찍혀요. 어느 가게에서 찍혔는지 색으로 남아요."
      />
      <div className="mx-auto w-full max-w-2xl px-5 pb-16 pt-6 sm:pt-8">
        <StampBoard today={today} />

        <InfoSection title="도장은 어떻게 찍히나요?">
          <p>
            분식에서 메뉴를 뽑거나, 랜드에서 놀거리를 고르거나, 문방구 뽑기판을 뜯거나, 철학관에서 부적을 받거나, 게시판에서
            축제를 고르면 그날의 도장이 찍혀요. 도장은 하루에 하나, 한국 시간 자정에 다음 날로 넘어가요.
          </p>
          <p>
            도장 기록은 지금 쓰는 기기의 브라우저에만 저장돼요. 다른 기기에서는 따로 모이고, 브라우저의 사이트 데이터를 지우면
            도장도 함께 지워져요.
          </p>
        </InfoSection>
      </div>
    </Shop>
  );
}
