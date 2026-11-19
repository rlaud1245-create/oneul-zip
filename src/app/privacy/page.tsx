import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${SITE.name} 개인정보처리방침`,
  alternates: { canonical: "/privacy" },
};

const UPDATED_AT = "2026년 11월 12일";

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16">
      <PageIntro eyebrow="안내" title="개인정보처리방침" description={`시행일: ${UPDATED_AT}`} />

      <div className="space-y-8 text-[15px] leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-bold text-ink">1. 수집하는 개인정보</h2>
          <p className="mt-2">
            {SITE.name}은 회원가입이 없으며, 이름·이메일·전화번호 등 개인을 식별할 수 있는 정보를 수집하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">2. 브라우저 저장소(localStorage) 사용</h2>
          <p className="mt-2">서비스 이용 편의를 위해 아래 정보를 이용자 기기의 브라우저에만 저장합니다.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>최근 추천받은 메뉴·활동 (같은 결과가 반복되지 않도록 하기 위함)</li>
            <li>저장한 추천 결과</li>
            <li>밸런스 게임에서 고른 선택</li>
          </ul>
          <p className="mt-2">
            이 정보는 서버로 전송되지 않으며, 브라우저의 사이트 데이터를 삭제하면 함께 삭제됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">3. 향후 변경 사항</h2>
          <p className="mt-2">
            방문 통계 도구, 광고, 전체 투표 집계 기능 등을 도입하는 경우 수집 항목과 목적, 보관 기간을 이 페이지에 먼저
            안내한 뒤 적용합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">4. 문의</h2>
          <p className="mt-2">개인정보 관련 문의는 서비스 운영자에게 연락해 주세요.</p>
        </section>
      </div>
    </div>
  );
}
